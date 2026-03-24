import type { Memory } from "@/types/memory";
import { formatTime } from "@/lib/date-utils";

interface MemoryRowProps {
  memory: Memory;
}

export function MemoryRow({ memory }: MemoryRowProps) {
  const hasImage = !!memory.image;

  return (
    <div className="py-3 px-1">
      {hasImage ? (
        <div className="space-y-2">
          <img
            src={memory.image}
            alt=""
            className="w-full max-h-[200px] object-cover rounded-xl"
          />
          <div className="space-y-1">
            <p className="text-stone-800 text-[15px] leading-snug">
              {memory.text}
            </p>
            <MemoryMeta memory={memory} />
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          <p className="text-stone-800 text-[15px] leading-snug line-clamp-2">
            {memory.text}
          </p>
          <MemoryMeta memory={memory} />
        </div>
      )}
    </div>
  );
}

function MemoryMeta({ memory }: { memory: Memory }) {
  const hasTags = memory.tags && memory.tags.length > 0;
  const hasPeople = memory.people && memory.people.length > 0;
  const hasMood = memory.mood !== undefined;

  return (
    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-stone-400">
      <span>{formatTime(memory.eventDate)}</span>

      {hasMood && (
        <span className="text-stone-400">mood {memory.mood}</span>
      )}

      {hasPeople && (
        <span className="text-stone-400">
          with {memory.people!.join(", ")}
        </span>
      )}

      {hasTags && (
        <div className="flex flex-wrap gap-1">
          {memory.tags!.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-stone-100 px-2 py-0.5 text-stone-500"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
