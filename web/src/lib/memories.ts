import { collection, doc, setDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import type { Memory } from "@/types/memory";

/**
 * Upload an image file to Firebase Storage.
 * Returns the public download URL.
 */
export async function uploadImage(
  projectKey: string,
  memoryId: string,
  file: File,
): Promise<string> {
  const storageRef = ref(
    storage,
    `project/${projectKey}/images/${memoryId}/${file.name}`,
  );
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
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

  const colRef = collection(db, "project", projectKey, "data", "memories");
  const docRef = doc(colRef);
  const memoryId = docRef.id;

  let imageUrl: string | undefined;
  if (data.image) {
    imageUrl = await uploadImage(projectKey, memoryId, data.image);
  }

  const memory: Memory = {
    id: memoryId,
    text: data.text,
    createdAt: now,
    updatedAt: now,
    eventDate: data.eventDate ?? now,
    ...(imageUrl !== undefined && { image: imageUrl }),
    ...(data.people !== undefined && { people: data.people }),
    ...(data.tags !== undefined && { tags: data.tags }),
    ...(data.mood !== undefined && { mood: data.mood }),
  };

  // Write to Firestore without the local `id` field (Firestore doc ID is the key)
  const { id: _, ...firestoreData } = memory;
  await setDoc(docRef, firestoreData);

  return memory;
}

/**
 * Delete a memory document from Firestore.
 * Does not remove the associated Storage image.
 */
export async function deleteMemory(
  projectKey: string,
  memoryId: string,
): Promise<void> {
  const docRef = doc(db, "project", projectKey, "data", "memories", memoryId);
  await deleteDoc(docRef);
}
