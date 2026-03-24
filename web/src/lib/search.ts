import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";

const searchCallable = httpsCallable<{ query: string }, { ids: string[] }>(
  functions,
  "searchMemories"
);

/**
 * Calls the server-side search function and returns matching memory IDs.
 * The client filters its already-loaded listener data by these IDs.
 *
 * KNOWN BUG / TIME HACK: Firestore does not support native full-text search.
 * The Cloud Function reads ALL documents and filters in-memory — this works
 * for a personal app with hundreds of memories but will NOT scale to tens of
 * thousands. In production, replace with Algolia, Typesense, or Meilisearch
 * synced via Firestore triggers.
 *
 * Additionally, the onSnapshot listener loads ALL memories, so client-side
 * filtering would work too. Server-side is kept so the contract stays clean
 * when the listener is eventually paginated.
 */
export async function searchMemories(query: string): Promise<string[]> {
  const result = await searchCallable({ query });
  return result.data.ids;
}
