import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getStorage } from "firebase-admin/storage";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const EXTENSION_MAP: Record<string, string> = {
  "audio/webm": "webm",
  "audio/mp4": "mp4",
  "audio/wav": "wav",
  "audio/ogg": "ogg",
  "audio/mpeg": "mp3",
  "audio/aac": "aac",
  "audio/flac": "flac",
};

export const uploadAudio = onCall(async (request) => {
  // 1. Verify authentication
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "Must be logged in to upload audio.");
  }

  // 2. Get projectKey from custom claims
  const projectKey = request.auth?.token?.projectKey as string | undefined;
  if (!projectKey) {
    throw new HttpsError(
      "failed-precondition",
      "User does not have an assigned project. Create a project first."
    );
  }

  // 3. Validate request data
  const { memoryId, audioBase64, contentType } = request.data as {
    memoryId?: string;
    audioBase64?: string;
    contentType?: string;
  };

  if (!memoryId || !audioBase64 || !contentType) {
    throw new HttpsError(
      "invalid-argument",
      "Missing required fields: memoryId, audioBase64, contentType."
    );
  }

  // Strip codec parameters (e.g. "audio/webm;codecs=opus" -> "audio/webm")
  const baseContentType = contentType.split(";")[0].trim();
  const extension = EXTENSION_MAP[baseContentType];
  if (!extension) {
    throw new HttpsError(
      "invalid-argument",
      `Unsupported content type: ${contentType}. Supported: ${Object.keys(EXTENSION_MAP).join(", ")}`
    );
  }

  // 4. Upload audio to Firebase Storage
  const timestamp = Date.now();
  const storagePath = `project/${projectKey}/audio/${memoryId}/${timestamp}.${extension}`;
  const bucket = getStorage().bucket();
  const file = bucket.file(storagePath);

  try {
    const buffer = Buffer.from(audioBase64, "base64");
    await file.save(buffer, {
      contentType: baseContentType,
      metadata: {
        metadata: {
          uploadedBy: uid,
          memoryId,
        },
      },
    });

    await file.makePublic();
    const voiceUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;

    // 5. Update Firestore document
    const db = getFirestore();
    await db
      .doc(`project/${projectKey}/memories/${memoryId}`)
      .set(
        { voice: voiceUrl, updatedAt: FieldValue.serverTimestamp() },
        { merge: true }
      );

    // 6. Return success
    return { success: true, voiceUrl };
  } catch (error) {
    throw new HttpsError(
      "internal",
      `Failed to upload audio: ${error instanceof Error ? error.message : String(error)}`
    );
  }
});
