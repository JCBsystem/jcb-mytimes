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
 * TIME HACK: Currently the onSnapshot listener loads ALL memories, so
 * client-side filtering would work too. We keep search server-side
 * because in production the listener would be paginated, and search
 * needs to reach the full dataset. This keeps the contract clean.
 */
export async function searchMemories(query: string): Promise<string[]> {
  const result = await searchCallable({ query });
  return result.data.ids;
}
