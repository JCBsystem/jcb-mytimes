import { useState } from "react";
import type { Memory } from "@/types/memory";
import { formatDateHeader, groupMemoriesByDate } from "@/lib/date-utils";
import { MemoryRow } from "@/components/MemoryRow";
import { DateMarker } from "@/components/DateMarker";

interface TimelineProps {
  memories: Memory[];
  onDelete: (memoryId: string) => void;
  onEdit: (memory: Memory) => void;
}

export function Timeline({ memories, onDelete, onEdit }: TimelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const grouped = groupMemoriesByDate(memories);

  const handleToggle = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  if (memories.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center pt-40 pb-20 px-6">
        <div className="w-10 h-10 rounded-full border-2 border-stone-200 mb-5 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-stone-200" />
        </div>
        <p className="text-center text-stone-400 text-sm leading-relaxed">
          No memories yet.
        </p>
        <p className="text-center text-stone-300 text-sm mt-1">
          Tap <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-stone-800 text-white text-[10px] align-middle">+</span> to capture your first moment.
        </p>
      </div>
    );
  }

  const entries = Array.from(grouped.entries());

  return (
    <div
      className="overflow-y-auto pb-24 px-5 pt-3"
      onClick={() => setExpandedId(null)}
    >
      {entries.map(([dateKey, dateMemories], groupIdx) => (
        <section key={dateKey} className="relative">
          {/* Timeline spine — starts below the date marker, runs to bottom */}
          <div className="absolute left-[17px] top-[52px] bottom-0 w-px bg-gradient-to-b from-stone-200 to-stone-100/40" />

          {/* Date header with calendar marker */}
          <div className="sticky top-0 z-10 backdrop-blur-md bg-stone-50/90 py-3 -mx-5 px-5">
            <div className="flex items-center gap-3">
              <DateMarker dateKey={dateKey} />
              <div>
                <h2 className="text-[12px] font-bold tracking-wide text-stone-500">
                  {formatDateHeader(dateKey)}
                </h2>
              </div>
            </div>
          </div>

          {/* Memory items */}
          <div className="pl-[48px] pb-2">
            {dateMemories.map((memory, idx) => (
              <div
                key={memory.id}
                onClick={(e) => e.stopPropagation()}
                className="relative"
              >
                {/* Connector dot on the spine */}
                <div className="absolute -left-[31px] top-5 w-[5px] h-[5px] rounded-full bg-stone-300" />

                <div className={idx < dateMemories.length - 1 ? "mb-1" : ""}>
                  <MemoryRow
                    memory={memory}
                    isExpanded={expandedId === memory.id}
                    onToggle={() => handleToggle(memory.id)}
                    onDelete={onDelete}
                    onEdit={onEdit}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Gap between groups */}
          {groupIdx < entries.length - 1 && <div className="h-4" />}
        </section>
      ))}
    </div>
  );
}
