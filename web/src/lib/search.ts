import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";
import type { Memory } from "@/types/memory";

const searchCallable = httpsCallable<{ query: string }, { results: Memory[] }>(
  functions,
  "searchMemories"
);

export async function searchMemories(query: string): Promise<Memory[]> {
  const result = await searchCallable({ query });
  return result.data.results;
}
