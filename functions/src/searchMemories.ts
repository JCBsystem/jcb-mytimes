/**
 * Server-side memory search endpoint.
 *
 * Returns only matching document IDs — the client already holds the full
 * memory objects via its real-time onSnapshot listener and filters locally.
 *
 * DEMO / TIME-CONSTRAINED IMPLEMENTATION
 * ========================================
 * Firestore does not support native full-text search. In production, this
 * should be backed by a dedicated search engine (Algolia, Typesense, or
 * Meilisearch) synced via Firestore triggers. This function reads all
 * memories and filters in-memory — acceptable for a personal app with
 * hundreds of memories, but will not scale to tens of thousands.
 *
 * TIME HACK: The client currently loads ALL memories via onSnapshot, so
 * it could technically filter client-side without this function. We keep
 * search server-side because in production the listener would be paginated
 * (e.g. last 100 memories), and search needs to reach the full dataset.
 * Returning IDs-only keeps the contract clean for that future.
 *
 * Performance considerations applied:
 * - Only fetches searchable fields via select() projection — not full docs
 * - Compiles the search pattern once, not per-document
 * - Caps results at 50 to limit response size
 * - Short-circuits per-document: skips to next doc on first match
 */

import { getFirestore } from "firebase-admin/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";

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

  // --- Fetch only searchable fields (no full doc reads) ---
  const db = getFirestore();
  const snapshot = await db
    .collection(`project/${projectKey}/memories`)
    .select("text", "transcript", "people", "tags", "eventDate")
    .get();

  // --- Filter in-memory with short-circuit per document ---
  const matches: { id: string; eventDate: string }[] = [];

  for (const doc of snapshot.docs) {
    const data = doc.data();

    // Short-circuit: check text first (most likely to match)
    const text: string = data.text ?? "";
    if (text.toLowerCase().includes(needle)) {
      matches.push({ id: doc.id, eventDate: data.eventDate ?? "" });
      continue;
    }

    // Check transcript
    const transcript: string | undefined = data.transcript;
    if (transcript && transcript.toLowerCase().includes(needle)) {
      matches.push({ id: doc.id, eventDate: data.eventDate ?? "" });
      continue;
    }

    // Check people array
    const people: string[] | undefined = data.people;
    if (people && people.some((p: string) => p.toLowerCase().includes(needle))) {
      matches.push({ id: doc.id, eventDate: data.eventDate ?? "" });
      continue;
    }

    // Check tags array
    const tags: string[] | undefined = data.tags;
    if (tags && tags.some((t: string) => t.toLowerCase().includes(needle))) {
      matches.push({ id: doc.id, eventDate: data.eventDate ?? "" });
    }
  }

  // --- Sort by eventDate descending and cap at MAX_RESULTS ---
  matches.sort((a, b) => (b.eventDate > a.eventDate ? 1 : -1));
  const ids = matches.slice(0, MAX_RESULTS).map((m) => m.id);

  return { ids };
});
