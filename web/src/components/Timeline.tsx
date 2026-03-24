import type { Memory } from "@/types/memory";
import { formatDateHeader, groupMemoriesByDate } from "@/lib/date-utils";
import { MemoryRow } from "@/components/MemoryRow";

interface TimelineProps {
  memories: Memory[];
}

export function Timeline({ memories }: TimelineProps) {
  const grouped = groupMemoriesByDate(memories);

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
    <div className="overflow-y-auto pt-[56px] pb-[64px] px-4">
      {Array.from(grouped.entries()).map(([dateKey, dateMemories]) => (
        <section key={dateKey} className="mb-4">
          <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm py-2">
            <h2 className="text-sm font-semibold tracking-wide text-stone-500 uppercase">
              {formatDateHeader(dateKey)}
            </h2>
          </div>

          <div className="divide-y divide-stone-100">
            {dateMemories.map((memory) => (
              <MemoryRow key={memory.id} memory={memory} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
