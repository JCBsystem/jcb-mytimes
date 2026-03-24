import { createContext, useContext, useCallback } from "react";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth.tsx";
import { useMemories } from "@/hooks/useMemories.ts";
import { createMemory, deleteMemory } from "@/lib/memories.ts";
import type { Memory } from "@/types/memory.ts";

interface MemoriesContextValue {
  memories: Memory[];
  loading: boolean;
  error: string | null;
  create: (data: {
    text: string;
    image?: File;
    people?: string[];
    tags?: string[];
    mood?: number;
    eventDate?: string;
  }) => Promise<Memory>;
  remove: (memoryId: string) => Promise<void>;
}

const MemoriesContext = createContext<MemoriesContextValue | null>(null);

export function MemoriesProvider({ children }: { children: ReactNode }) {
  const { projectKey } = useAuth();
  const { memories, loading, error } = useMemories(projectKey);

  const create = useCallback(
    async (data: {
      text: string;
      image?: File;
      people?: string[];
      tags?: string[];
      mood?: number;
      eventDate?: string;
    }): Promise<Memory> => {
      if (!projectKey) {
        throw new Error("No project key available");
      }
      return createMemory(projectKey, data);
    },
    [projectKey],
  );

  const remove = useCallback(
    async (memoryId: string): Promise<void> => {
      if (!projectKey) {
        throw new Error("No project key available");
      }
      return deleteMemory(projectKey, memoryId);
    },
    [projectKey],
  );

  return (
    <MemoriesContext value={{ memories, loading, error, create, remove }}>
      {children}
    </MemoriesContext>
  );
}

export function useMemoriesContext(): MemoriesContextValue {
  const ctx = useContext(MemoriesContext);
  if (!ctx) {
    throw new Error(
      "useMemoriesContext must be used within a MemoriesProvider",
    );
  }
  return ctx;
}
