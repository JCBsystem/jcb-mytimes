/**
 * Server-side memory search endpoint.
 *
 * DEMO / TIME-CONSTRAINED IMPLEMENTATION
 * ========================================
 * Firestore does not support native full-text search. In production, this
 * should be backed by a dedicated search engine (Algolia, Typesense, or
 * Meilisearch) synced via Firestore triggers. This function reads all
 * memories and filters in-memory — acceptable for a personal app with
 * hundreds of memories, but will not scale to tens of thousands.
 *
 * Performance considerations applied:
 * - Only fetches the fields needed for search + display (select projection)
 * - Compiles the search pattern once, not per-document
 * - Caps results at 50 to limit response size
 * - Short-circuits per-document: skips to next doc on first match
 */

import { getFirestore } from "firebase-admin/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";

interface Memory {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  eventDate: string;
  image?: string;
  people?: string[];
  tags?: string[];
  mood?: number;
  audioUrl?: string;
  transcript?: string;
}

const MAX_RESULTS = 50;

export const searchMemories = onCall({ cors: true }, async (request) => {
  // --- Auth check ---
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "Must be logged in to search.");
  }

  const projectKey = request.auth?.token?.projectKey as string | undefined;
  if (!projectKey) {
    throw new HttpsError(
      "permission-denied",
      "No project associated with this account."
    );
  }

  // --- Input validation ---
  const query: unknown = request.data?.query;
  if (typeof query !== "string" || query.trim().length === 0) {
    throw new HttpsError(
      "invalid-argument",
      "A non-empty 'query' string is required."
    );
  }

  // Compile search term once — lowercase for case-insensitive matching
  const needle = query.trim().toLowerCase();

  // --- Fetch all memories for this project ---
  const db = getFirestore();
  const snapshot = await db
    .collection(`project/${projectKey}/data/memories`)
    .select(
      "text",
      "transcript",
      "people",
      "tags",
      "createdAt",
      "updatedAt",
      "eventDate",
      "image",
      "mood",
      "audioUrl"
    )
    .get();

  // --- Filter in-memory with short-circuit per document ---
  const matches: Memory[] = [];

  for (const doc of snapshot.docs) {
    const data = doc.data();

    // Short-circuit: check text first (most likely to match)
    const text: string = data.text ?? "";
    if (text.toLowerCase().includes(needle)) {
      matches.push(docToMemory(doc.id, data));
      continue; // next doc — no need to check remaining fields
    }

    // Check transcript
    const transcript: string | undefined = data.transcript;
    if (transcript && transcript.toLowerCase().includes(needle)) {
      matches.push(docToMemory(doc.id, data));
      continue;
    }

    // Check people array
    const people: string[] | undefined = data.people;
    if (people && people.some((p: string) => p.toLowerCase().includes(needle))) {
      matches.push(docToMemory(doc.id, data));
      continue;
    }

    // Check tags array
    const tags: string[] | undefined = data.tags;
    if (tags && tags.some((t: string) => t.toLowerCase().includes(needle))) {
      matches.push(docToMemory(doc.id, data));
      // continue not needed — last check
    }
  }

  // --- Sort by eventDate descending and cap at MAX_RESULTS ---
  matches.sort((a, b) => (b.eventDate > a.eventDate ? 1 : -1));
  const results = matches.slice(0, MAX_RESULTS);

  return { results };
});

/** Map a Firestore document to the Memory interface. */
function docToMemory(
  id: string,
  data: FirebaseFirestore.DocumentData
): Memory {
  return {
    id,
    text: data.text ?? "",
    createdAt: data.createdAt ?? "",
    updatedAt: data.updatedAt ?? "",
    eventDate: data.eventDate ?? "",
    ...(data.image !== undefined && { image: data.image }),
    ...(data.people !== undefined && { people: data.people }),
    ...(data.tags !== undefined && { tags: data.tags }),
    ...(data.mood !== undefined && { mood: data.mood }),
    ...(data.audioUrl !== undefined && { audioUrl: data.audioUrl }),
    ...(data.transcript !== undefined && { transcript: data.transcript }),
  };
}
