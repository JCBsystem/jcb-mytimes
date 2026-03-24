import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { getStorage } from "firebase-admin/storage";
import { getFirestore } from "firebase-admin/firestore";
import Anthropic, { toFile } from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export const transcribeMemory = onDocumentWritten(
  "project/{projectKey}/memories/{memoryId}",
  async (event) => {
    const afterData = event.data?.after?.data();

    // Document was deleted — nothing to do
    if (!afterData) {
      return;
    }

    const voice: string | undefined = afterData.voice;
    const transcribedText: string | undefined = afterData.transcribedText;

    // Skip if no voice URL or already transcribed
    if (!voice || transcribedText) {
      return;
    }

    // On updates, skip if the voice field hasn't changed
    const beforeData = event.data?.before?.data();
    if (beforeData && beforeData.voice === voice) {
      return;
    }

    const documentRef = event.data!.after!.ref;

    try {
      // Download audio from Firebase Storage
      const bucket = getStorage().bucket();
      const filePath = decodeStorageUrl(voice);
      const [audioBuffer] = await bucket.file(filePath).download();

      // Determine a filename and media type from the storage path
      const filename = filePath.split("/").pop() || "audio.wav";
      const mimeType = guessMimeType(filename);

      // Upload to Anthropic Files API
      const uploadedFile = await anthropic.beta.files.upload({
        file: await toFile(audioBuffer, filename, { type: mimeType }),
        betas: ["files-api-2025-04-14"],
      });

      try {
        // Send transcription request to Claude
        const message = await anthropic.beta.messages.create({
          model: "claude-sonnet-4-5-20250929",
          max_tokens: 1024,
          betas: ["files-api-2025-04-14"],
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "document",
                  source: {
                    type: "file",
                    file_id: uploadedFile.id,
                  },
                },
                {
                  type: "text",
                  text: "Please transcribe the audio above. Return only the transcription text, nothing else.",
                },
              ],
            },
          ],
        });

        // Extract text from the response
        const textBlock = message.content.find((block) => block.type === "text");
        const result = textBlock && "text" in textBlock ? textBlock.text : "";

        // Update the Firestore document
        await getFirestore().doc(documentRef.path).update({
          transcribedText: result,
        });
      } finally {
        // Always clean up the uploaded file
        await anthropic.beta.files.delete(uploadedFile.id, {
          betas: ["files-api-2025-04-14"],
        }).catch((err) => {
          console.error("Failed to delete Anthropic file:", err);
        });
      }
    } catch (error) {
      console.error("transcribeMemory failed:", error);
    }
  },
);

/**
 * Extract the storage file path from a Firebase Storage URL.
 * Handles both:
 *   - gs://bucket/path/to/file
 *   - https://firebasestorage.googleapis.com/v0/b/bucket/o/path%2Fto%2Ffile?...
 */
function decodeStorageUrl(url: string): string {
  if (url.startsWith("gs://")) {
    // gs://bucket-name/path/to/file
    const withoutScheme = url.slice(5);
    const slashIndex = withoutScheme.indexOf("/");
    return slashIndex === -1 ? "" : withoutScheme.slice(slashIndex + 1);
  }

  // HTTPS download URL: extract encoded path after /o/
  const firebaseMatch = url.match(/\/o\/([^?]+)/);
  if (firebaseMatch) {
    return decodeURIComponent(firebaseMatch[1]);
  }

  // Public URL: https://storage.googleapis.com/bucket-name/path/to/file
  const publicMatch = url.match(/storage\.googleapis\.com\/[^/]+\/(.+)/);
  if (publicMatch) {
    return decodeURIComponent(publicMatch[1]);
  }

  // CDN rewrite path: /cdn/{projectKey}/audio/{memoryId}/{filename}
  // Maps to storage: project/{projectKey}/audio/{memoryId}/{timestamp}.{ext}
  if (url.startsWith("/cdn/")) {
    return "project/" + url.slice(5); // strip "/cdn/" prefix
  }

  // Fallback: treat the whole string as a path
  return url;
}

function guessMimeType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "mp3":
      return "audio/mpeg";
    case "wav":
      return "audio/wav";
    case "m4a":
      return "audio/mp4";
    case "ogg":
      return "audio/ogg";
    case "webm":
      return "audio/webm";
    case "flac":
      return "audio/flac";
    case "aac":
      return "audio/aac";
    default:
      return "audio/wav";
  }
}
