import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getStorage } from "firebase-admin/storage";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import sharp from "sharp";

const MAX_INPUT_BYTES = 10 * 1024 * 1024; // 10 MB input limit
const MAX_WIDTH = 1200;
const JPEG_QUALITY = 80;

export const uploadImage = onCall(
  { cors: true, memory: "512MiB" },
  async (request) => {
    const uid = request.auth?.uid;
    if (!uid) {
      throw new HttpsError("unauthenticated", "Must be logged in.");
    }

    const projectKey = request.auth?.token?.projectKey as string | undefined;
    if (!projectKey) {
      throw new HttpsError(
        "failed-precondition",
        "No project assigned. Create a project first."
      );
    }

    const { memoryId, imageBase64 } = request.data as {
      memoryId?: string;
      imageBase64?: string;
    };

    if (!memoryId || !imageBase64) {
      throw new HttpsError(
        "invalid-argument",
        "Missing required fields: memoryId, imageBase64."
      );
    }

    const raw = Buffer.from(imageBase64, "base64");
    if (raw.length > MAX_INPUT_BYTES) {
      throw new HttpsError(
        "invalid-argument",
        `Image too large (${(raw.length / 1024 / 1024).toFixed(1)} MB). Max is 10 MB.`
      );
    }

    try {
      const optimized = await sharp(raw)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .jpeg({ quality: JPEG_QUALITY })
        .toBuffer();

      const storagePath = `project/${projectKey}/images/${memoryId}/${Date.now()}.jpg`;
      const bucket = getStorage().bucket();
      const file = bucket.file(storagePath);

      await file.save(optimized, {
        contentType: "image/jpeg",
        metadata: { metadata: { uploadedBy: uid, memoryId } },
      });

      // Serve via Firebase Hosting CDN rewrite — no makePublic() needed
      const imageUrl = `/cdn/${projectKey}/images/${memoryId}/${storagePath.split("/").pop()}`;

      const db = getFirestore();
      await db
        .doc(`project/${projectKey}/memories/${memoryId}`)
        .set(
          { image: imageUrl, updatedAt: FieldValue.serverTimestamp() },
          { merge: true }
        );

      return { success: true, imageUrl };
    } catch (error) {
      throw new HttpsError(
        "internal",
        `Image processing failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
);
