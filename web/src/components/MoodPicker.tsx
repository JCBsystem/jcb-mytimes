import { cn } from "@/lib/utils"

const MOODS = [
  { idx: 1, emoji: "\u{1F61E}" },  // grimacing
  { idx: 2, emoji: "\u{1F610}" },  // neutral
  { idx: 3, emoji: "\u{1F642}" },  // slightly smiling
  { idx: 4, emoji: "\u{1F604}" },  // grinning
  { idx: 5, emoji: "\u{1F929}" },  // star-struck
] as const

interface MoodPickerProps {
  value: number | undefined
  onChange: (mood: number | undefined) => void
}

export function MoodPicker({ value, onChange }: MoodPickerProps) {
  return (
    <div className="flex items-center gap-1">
      {MOODS.map(({ idx, emoji }) => (
        <button
          key={idx}
          type="button"
          onClick={() => onChange(value === idx ? undefined : idx)}
          className={cn(
            "rounded-full p-1.5 text-xl transition-all",
            value === idx
              ? "scale-125 bg-stone-200"
              : "opacity-60 hover:opacity-80",
          )}
        >
          {emoji}
        </button>
      ))}
    </div>
  )
}
