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

  // Firestore stores "voice" and "transcribedText" but the Memory type uses
  // "audioUrl" and "transcript". The onSnapshot hook casts raw doc data, so
  // the Firestore field names are what actually arrive at runtime.
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
          className="relative py-4 px-3 bg-stone-50/80 rounded-xl -mx-1 transition-all cursor-pointer"
          onClick={onToggle}
        >
          {/* Trash icon */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirm(true);
            }}
            className="absolute top-3 right-3 p-1.5 rounded-full text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            aria-label="Delete memory"
          >
            <Trash2 className="size-4" />
          </button>

          <div className="space-y-3 pr-8">
            {/* Full text */}
            <p className="text-stone-800 text-[15px] leading-snug whitespace-pre-wrap">
              {memory.text}
            </p>

            {/* Full-size image */}
            {hasImage && (
              <img
                src={memory.image}
                alt=""
                className="w-full rounded-xl"
              />
            )}

            {/* Metadata */}
            <div className="space-y-1.5 text-sm text-stone-500">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>{formatTime(memory.eventDate)}</span>
                <span className="text-stone-400">
                  {dayjs(memory.eventDate).format("MMMM D, YYYY")}
                </span>
              </div>

              {hasMood && (
                <div>
                  {MOOD_EMOJI[memory.mood!]} Mood: {memory.mood}/5
                </div>
              )}

              {hasPeople && (
                <div>With: {memory.people!.join(", ")}</div>
              )}

              {hasTags && (
                <div className="flex flex-wrap gap-1.5">
                  {memory.tags!.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600"
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
                className="w-full mt-2"
                onClick={(e) => e.stopPropagation()}
              />
            )}

            {/* Transcript */}
            {transcriptText && (
              <p className="text-sm text-stone-500 italic mt-1">
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
      className="py-3 px-1 cursor-pointer hover:bg-stone-50/50 rounded-xl transition-colors"
    >
      {hasImage ? (
        <div className="space-y-2">
          <img
            src={memory.image}
            alt=""
            className="w-full max-h-[200px] object-cover rounded-xl"
          />
          <div className="space-y-1">
            <p className="text-stone-800 text-[15px] leading-snug line-clamp-2">
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
  const hasMood = memory.mood !== undefined && memory.mood !== null;

  return (
    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-stone-400">
      <span>{formatTime(memory.eventDate)}</span>

      {hasMood && (
        <span>{MOOD_EMOJI[memory.mood!]}</span>
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
