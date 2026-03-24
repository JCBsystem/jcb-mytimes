import { useRef, useState } from "react"
import { ArrowUp, ImagePlus, Plus, Volume2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MoodPicker } from "@/components/MoodPicker"
import { TagInput } from "@/components/TagInput"
import { PeopleInput } from "@/components/PeopleInput"
import { AudioRecorder } from "@/components/AudioRecorder"
import { uploadAudioToMemory } from "@/lib/memories"
import type { Memory } from "@/types/memory"
import { cn } from "@/lib/utils"

interface BottomBarProps {
  onSend: (data: {
    text: string
    image?: File
    tags?: string[]
    mood?: number
    people?: string[]
    eventDate?: string
  }) => Promise<Memory>
  allTags?: string[]
}

export function BottomBar({ onSend, allTags }: BottomBarProps) {
  const [text, setText] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Expand row state
  const [expanded, setExpanded] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [mood, setMood] = useState<number | undefined>(undefined)
  const [people, setPeople] = useState<string[]>([])
  const [eventDate, setEventDate] = useState("")

  // Audio recording state
  const [pendingAudio, setPendingAudio] = useState<{
    base64: string
    contentType: string
  } | null>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImage(file)
    const url = URL.createObjectURL(file)
    setImagePreview(url)
  }

  const clearImage = () => {
    setImage(null)
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
      setImagePreview(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSend = async () => {
    const trimmed = text.trim()
    if (!trimmed) return

    const memory = await onSend({
      text: trimmed,
      image: image ?? undefined,
      tags: tags.length > 0 ? tags : undefined,
      mood,
      people: people.length > 0 ? people : undefined,
      eventDate: eventDate || undefined,
    })

    // If audio was recorded, upload it now that we have the memoryId
    if (pendingAudio && memory?.id) {
      try {
        await uploadAudioToMemory(
          memory.id,
          pendingAudio.base64,
          pendingAudio.contentType,
        )
      } catch (err) {
        console.error("Audio upload failed:", err)
      }
    }

    // Reset all state
    setText("")
    clearImage()
    setTags([])
    setMood(undefined)
    setPeople([])
    setEventDate("")
    setPendingAudio(null)
    setExpanded(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const canSend = text.trim().length > 0

  return (
    <div className="fixed bottom-0 inset-x-0 z-10 bg-background/95 backdrop-blur-sm border-t border-border/50">
      {/* Expand row */}
      {expanded && (
        <div className="space-y-3 px-4 py-3 border-b border-stone-100">
          <div>
            <label className="text-xs font-medium text-stone-400 uppercase tracking-wide">
              Mood
            </label>
            <div className="mt-1">
              <MoodPicker value={mood} onChange={setMood} />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-400 uppercase tracking-wide">
              Tags
            </label>
            <div className="mt-1">
              <TagInput tags={tags} onChange={setTags} allTags={allTags} />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-400 uppercase tracking-wide">
              People
            </label>
            <div className="mt-1">
              <PeopleInput people={people} onChange={setPeople} />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-400 uppercase tracking-wide">
              Date
            </label>
            <div className="mt-1">
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-700 outline-none focus:ring-1 focus:ring-stone-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* Image preview */}
      {imagePreview && (
        <div className="px-4 pt-3 pb-1">
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Selected"
              className="h-16 w-16 rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-foreground/80 text-background transition-colors hover:bg-foreground"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* Audio indicator */}
      {pendingAudio && (
        <div className="px-4 py-1.5 flex items-center gap-2 text-xs text-stone-500">
          <Volume2 className="size-3.5" />
          <span>Audio attached</span>
          <button
            type="button"
            onClick={() => setPendingAudio(null)}
            className="ml-auto hover:text-stone-700"
          >
            <X className="size-3" />
          </button>
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2 px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "shrink-0 transition-transform",
            expanded && "rotate-45 text-stone-600",
          )}
        >
          <Plus className="size-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          <ImagePlus className="size-5" />
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Capture a moment..."
          data-testid="input-memory-text"
          className="min-w-0 flex-1 rounded-full bg-muted/50 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:bg-muted/80 focus:ring-1 focus:ring-ring/30 transition-colors"
        />

        <AudioRecorder
          onRecorded={(base64, contentType) =>
            setPendingAudio({ base64, contentType })
          }
        />

        {canSend && (
          <Button
            size="icon"
            onClick={handleSend}
            data-testid="btn-send-memory"
            className="shrink-0 rounded-full"
          >
            <ArrowUp className="size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
