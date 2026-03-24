import { collection, doc, setDoc, deleteDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "@/lib/firebase";
import type { Memory } from "@/types/memory";

const MAX_IMAGE_WIDTH = 1920;
const IMAGE_QUALITY = 0.82;

/**
 * Resize an image file client-side via canvas.
 * Returns a base64-encoded JPEG, capped at MAX_IMAGE_WIDTH.
 * This prevents oversized uploads from phone cameras (often 5-12MB).
 */
function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > MAX_IMAGE_WIDTH) {
        height = Math.round((height * MAX_IMAGE_WIDTH) / width);
        width = MAX_IMAGE_WIDTH;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL("image/jpeg", IMAGE_QUALITY);
      resolve(dataUrl.split(",")[1]); // strip data:...;base64, prefix
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Create a new memory document in Firestore.
 * Optionally uploads an image first and attaches the URL.
 */
export async function createMemory(
  projectKey: string,
  data: {
    text: string;
    image?: File;
    people?: string[];
    tags?: string[];
    mood?: number;
    eventDate?: string;
  },
): Promise<Memory> {
  const now = new Date().toISOString();

  const colRef = collection(db, "project", projectKey, "memories");
  const docRef = doc(colRef);
  const memoryId = docRef.id;

  const memory: Memory = {
    id: memoryId,
    text: data.text,
    createdAt: now,
    updatedAt: now,
    eventDate: data.eventDate ?? now,
    ...(data.people !== undefined && { people: data.people }),
    ...(data.tags !== undefined && { tags: data.tags }),
    ...(data.mood !== undefined && { mood: data.mood }),
  };

  // Write to Firestore without the local `id` field (Firestore doc ID is the key)
  const { id: _, ...firestoreData } = memory;
  await setDoc(docRef, firestoreData);

  // Upload image via CF (resizes + optimizes server-side)
  if (data.image) {
    const imageBase64 = await resizeImage(data.image);
    const callable = httpsCallable<
      { memoryId: string; imageBase64: string },
      { success: boolean; imageUrl: string }
    >(functions, "uploadImage");
    const result = await callable({ memoryId, imageBase64 });
    memory.image = result.data.imageUrl;
  }

  return memory;
}

/**
 * Update an existing memory document in Firestore.
 */
export async function updateMemory(
  projectKey: string,
  memoryId: string,
  data: {
    text: string;
    image?: File;
    people?: string[];
    tags?: string[];
    mood?: number;
    eventDate?: string;
  },
): Promise<void> {
  const now = new Date().toISOString();
  const docRef = doc(db, "project", projectKey, "memories", memoryId);

  const updates: Record<string, unknown> = {
    text: data.text,
    updatedAt: now,
    eventDate: data.eventDate ?? now,
  };

  if (data.people !== undefined) updates.people = data.people;
  if (data.tags !== undefined) updates.tags = data.tags;
  if (data.mood !== undefined) updates.mood = data.mood;

  await setDoc(docRef, updates, { merge: true });

  if (data.image) {
    const imageBase64 = await resizeImage(data.image);
    const callable = httpsCallable<
      { memoryId: string; imageBase64: string },
      { success: boolean; imageUrl: string }
    >(functions, "uploadImage");
    await callable({ memoryId, imageBase64 });
  }
}

/**
 * Delete a memory document from Firestore.
 * Does not remove the associated Storage image.
 */
export async function deleteMemory(
  projectKey: string,
  memoryId: string,
): Promise<void> {
  const docRef = doc(db, "project", projectKey, "memories", memoryId);
  await deleteDoc(docRef);
}

/**
 * Upload audio to a memory via the uploadAudio Cloud Function.
 * Returns the Storage URL of the uploaded audio file.
 */
export async function uploadAudioToMemory(
  memoryId: string,
  audioBase64: string,
  contentType: string,
): Promise<string> {
  const callable = httpsCallable<
    { memoryId: string; audioBase64: string; contentType: string },
    { success: boolean; voiceUrl: string }
  >(functions, "uploadAudio");
  const result = await callable({ memoryId, audioBase64, contentType });
  return result.data.voiceUrl;
}
