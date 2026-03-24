import { useState } from "react";
import type { Memory } from "@/types/memory";
import { formatTime } from "@/lib/date-utils";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Trash2 } from "lucide-react";
import dayjs from "dayjs";

const MOOD_EMOJI: Record<number, string> = {
  1: "\u{1F61E}",
  2: "\u{1F610}",
  3: "\u{1F642}",
  4: "\u{1F604}",
  5: "\u{1F929}",
};

interface MemoryRowProps {
  memory: Memory;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: (memoryId: string) => void;
}

export function MemoryRow({
  memory,
  isExpanded,
  onToggle,
  onDelete,
}: MemoryRowProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const raw = memory as unknown as Record<string, unknown>;
  const audioSrc = (memory.audioUrl ?? raw.voice) as string | undefined;
  const transcriptText = (memory.transcript ?? raw.transcribedText) as
    | string
    | undefined;

  const hasImage = !!memory.image;
  const hasTags = memory.tags && memory.tags.length > 0;
  const hasPeople = memory.people && memory.people.length > 0;
  const hasMood = memory.mood !== undefined && memory.mood !== null;

  if (isExpanded) {
    return (
      <>
        <div
          className="relative py-5 px-4 bg-white rounded-2xl shadow-sm shadow-stone-200/60 border border-stone-100/80 -mx-1 transition-all duration-200 cursor-pointer"
          onClick={onToggle}
          data-testid="memory-detail"
        >
          {/* Trash icon */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirm(true);
            }}
            className="absolute top-4 right-4 p-1.5 rounded-full text-stone-300 hover:text-red-400 hover:bg-red-50 transition-colors"
            aria-label="Delete memory"
            data-testid="btn-delete-memory"
          >
            <Trash2 className="size-3.5" />
          </button>

          <div className="space-y-4 pr-8">
            {/* Full text */}
            <p className="text-stone-700 text-[15px] leading-relaxed whitespace-pre-wrap">
              {memory.text}
            </p>

            {/* Full-size image — constrained */}
            {hasImage && (
              <div className="overflow-hidden rounded-xl">
                <img
                  src={memory.image}
                  alt=""
                  className="w-full max-h-[400px] object-cover"
                />
              </div>
            )}

            {/* Metadata block */}
            <div className="space-y-2.5 pt-3 border-t border-stone-100">
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] font-medium tracking-wide text-stone-400 uppercase">
                  {formatTime(memory.eventDate)}
                </span>
                <span className="text-stone-200">&middot;</span>
                <span className="text-[11px] text-stone-400">
                  {dayjs(memory.eventDate).format("MMMM D, YYYY")}
                </span>
              </div>

              {hasMood && (
                <div className="flex items-center gap-1.5">
                  <span className="text-lg leading-none">{MOOD_EMOJI[memory.mood!]}</span>
                  <span className="text-[11px] text-stone-400 font-medium">{memory.mood}/5</span>
                </div>
              )}

              {hasPeople && (
                <p className="text-[12px] text-stone-500 italic">
                  with {memory.people!.join(", ")}
                </p>
              )}

              {hasTags && (
                <div className="flex flex-wrap gap-1.5">
                  {memory.tags!.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-amber-50 border border-amber-100/80 px-2.5 py-0.5 text-[11px] font-medium text-amber-700/80 tracking-wide"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Audio player */}
            {audioSrc && (
              <audio
                controls
                src={audioSrc}
                className="w-full mt-1"
                onClick={(e) => e.stopPropagation()}
              />
            )}

            {/* Transcript */}
            {transcriptText && (
              <p className="text-[12px] text-stone-400 italic leading-relaxed">
                {transcriptText}
              </p>
            )}
          </div>
        </div>

        <ConfirmDialog
          open={showConfirm}
          title="Delete memory?"
          description="This memory will be permanently deleted."
          onConfirm={() => {
            onDelete(memory.id);
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      </>
    );
  }

  // Collapsed mode
  return (
    <div
      onClick={onToggle}
      data-testid="memory-item"
      className="group py-3.5 px-3 -mx-1 cursor-pointer hover:bg-white/80 rounded-xl transition-all duration-150"
    >
      {hasImage ? (
        <div className="space-y-2.5">
          <div className="overflow-hidden rounded-xl">
            <img
              src={memory.image}
              alt=""
              className="w-full max-h-[220px] object-cover transition-transform duration-300 group-hover:scale-[1.01]"
            />
          </div>
          <div className="space-y-1.5">
            <p className="text-stone-700 text-[15px] leading-relaxed line-clamp-2">
              {hasMood && <span className="mr-1.5">{MOOD_EMOJI[memory.mood!]}</span>}
              {memory.text}
            </p>
            <MemoryMeta memory={memory} />
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          <p className="text-stone-700 text-[15px] leading-relaxed line-clamp-2">
            {hasMood && <span className="mr-1.5">{MOOD_EMOJI[memory.mood!]}</span>}
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
  const hasMood = memory.mood !== undefined && memory.mood !== null;

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-stone-400">
      <span className="font-medium tracking-wide uppercase">
        {formatTime(memory.eventDate)}
      </span>

      {hasMood && (
        <>
          <span className="text-stone-200">&middot;</span>
          <span className="text-sm leading-none">{MOOD_EMOJI[memory.mood!]}</span>
        </>
      )}

      {hasPeople && (
        <>
          <span className="text-stone-200">&middot;</span>
          <span className="italic text-stone-400">
            with {memory.people!.join(", ")}
          </span>
        </>
      )}

      {hasTags && (
        <>
          <span className="text-stone-200">&middot;</span>
          <div className="flex flex-wrap gap-1">
            {memory.tags!.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-amber-50 border border-amber-100/80 px-2 py-px text-[10px] font-medium text-amber-700/70 tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
