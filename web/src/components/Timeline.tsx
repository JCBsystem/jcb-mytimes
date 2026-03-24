import { useState } from "react";
import type { Memory } from "@/types/memory";
import { formatDateHeader, groupMemoriesByDate } from "@/lib/date-utils";
import { MemoryRow } from "@/components/MemoryRow";

interface TimelineProps {
  memories: Memory[];
  onDelete: (memoryId: string) => void;
}

export function Timeline({ memories, onDelete }: TimelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const grouped = groupMemoriesByDate(memories);

  const handleToggle = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  if (memories.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center pt-56 pb-20 px-6">
        <p className="text-center text-stone-400 text-[15px] leading-relaxed">
          No memories yet.
          <br />
          Capture your first moment.
        </p>
      </div>
    );
  }

  return (
    <div
      className="overflow-y-auto pt-[56px] pb-[64px] px-4"
      onClick={() => setExpandedId(null)}
    >
      {Array.from(grouped.entries()).map(([dateKey, dateMemories]) => (
        <section key={dateKey} className="mb-4">
          <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm py-2">
            <h2 className="text-sm font-semibold tracking-wide text-stone-500 uppercase">
              {formatDateHeader(dateKey)}
            </h2>
          </div>

          <div className="divide-y divide-stone-100">
            {dateMemories.map((memory) => (
              <div key={memory.id} onClick={(e) => e.stopPropagation()}>
                <MemoryRow
                  memory={memory}
                  isExpanded={expandedId === memory.id}
                  onToggle={() => handleToggle(memory.id)}
                  onDelete={onDelete}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
