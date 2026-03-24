import { useRef, useState } from "react"
import { ImagePlus, Plus, Volume2, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MoodPicker } from "@/components/MoodPicker"
import { TagInput } from "@/components/TagInput"
import { PeopleInput } from "@/components/PeopleInput"
import { AudioRecorder } from "@/components/AudioRecorder"
import { uploadAudioToMemory } from "@/lib/memories"
import type { Memory } from "@/types/memory"

interface BottomBarProps {
  onSend: (data: {
    text: string
    image?: File
    tags?: string[]
    mood?: number
    people?: string[]
    eventDate?: string
  }) => Promise<Memory>
  onUpdate?: (memoryId: string, data: {
    text: string
    image?: File
    tags?: string[]
    mood?: number
    people?: string[]
    eventDate?: string
  }) => Promise<void>
  editingMemory?: Memory | null
  onEditDone?: () => void
  allTags?: string[]
}

export function BottomBar({ onSend, onUpdate, editingMemory, onEditDone, allTags }: BottomBarProps) {
  const [open, setOpen] = useState(false)
  const [sending, setSending] = useState(false)

  const [text, setText] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [mood, setMood] = useState<number | undefined>(undefined)
  const [people, setPeople] = useState<string[]>([])
  const [eventDate, setEventDate] = useState("")
  const [pendingAudio, setPendingAudio] = useState<{
    base64: string
    contentType: string
  } | null>(null)
  const [editId, setEditId] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Open modal in edit mode when editingMemory changes
  const prevEditRef = useRef<string | null>(null)
  if (editingMemory && editingMemory.id !== prevEditRef.current) {
    prevEditRef.current = editingMemory.id
    setEditId(editingMemory.id)
    setText(editingMemory.text)
    setTags(editingMemory.tags ?? [])
    setMood(editingMemory.mood)
    setPeople(editingMemory.people ?? [])
    setImagePreview(editingMemory.image ?? null)
    setImage(null) // can't reconstruct File from URL
    const d = editingMemory.eventDate ? new Date(editingMemory.eventDate) : null
    setEventDate(d ? d.toISOString().split("T")[0] : "")
    setPendingAudio(null)
    setOpen(true)
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImage(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const resetForm = () => {
    setText("")
    clearImage()
    setTags([])
    setMood(undefined)
    setPeople([])
    setEventDate("")
    setPendingAudio(null)
    setEditId(null)
    prevEditRef.current = null
  }

  const handleSend = async () => {
    const trimmed = text.trim()
    if (!trimmed || sending) return

    setSending(true)
    try {
      const payload = {
        text: trimmed,
        image: image ?? undefined,
        tags: tags.length > 0 ? tags : undefined,
        mood,
        people: people.length > 0 ? people : undefined,
        eventDate: eventDate || undefined,
      }

      if (editId && onUpdate) {
        await onUpdate(editId, payload)
        onEditDone?.()
      } else {
        const memory = await onSend(payload)

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
      }

      resetForm()
      setOpen(false)
    } finally {
      setSending(false)
    }
  }

  const canSend = text.trim().length > 0

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => {
          setOpen(true)
          setTimeout(() => textareaRef.current?.focus(), 100)
        }}
        className="fixed bottom-6 right-5 z-20 w-14 h-14 rounded-full bg-stone-800 text-white shadow-lg shadow-stone-300/40 hover:bg-stone-700 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center"
        data-testid="btn-new-memory"

      >
        <Plus className="size-6" />
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) { resetForm(); setOpen(false); onEditDone?.() }
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />

          {/* Modal */}
          <div className="relative w-full max-w-lg mx-4 mb-4 sm:mb-0 bg-white rounded-2xl shadow-2xl shadow-stone-400/20 border border-stone-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
              <h2 className="text-sm font-bold tracking-[0.1em] text-stone-500 uppercase">
                {editId ? "Edit Memory" : "New Memory"}
              </h2>
              <button
                onClick={() => { resetForm(); setOpen(false); onEditDone?.() }}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4 space-y-5 max-h-[60vh] overflow-y-auto">
              {/* Text */}
              <div>
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="What happened? What are you feeling?"
                  data-testid="input-memory-text"
                  rows={3}
                  className="w-full bg-transparent text-stone-700 text-[15px] leading-relaxed placeholder:text-stone-300 outline-none resize-none"
                />
              </div>

              {/* Image */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  data-testid="input-image-file"
                />
                {imagePreview ? (
                  <div className="relative inline-block" data-testid="image-preview">
                    <img
                      src={imagePreview}
                      alt="Selected"
                      className="h-24 rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-stone-800 text-white shadow-sm hover:bg-stone-700"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    data-testid="btn-add-image"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-stone-200 text-stone-400 text-sm hover:border-stone-300 hover:text-stone-500 transition-colors"
                  >
                    <ImagePlus className="size-4" />
                    Add photo
                  </button>
                )}
              </div>

              {/* Mood */}
              <div>
                <label className="text-[11px] font-bold tracking-[0.15em] text-stone-400 uppercase block mb-2">
                  How are you feeling?
                </label>
                <MoodPicker value={mood} onChange={setMood} />
              </div>

              {/* Tags */}
              <div>
                <label className="text-[11px] font-bold tracking-[0.15em] text-stone-400 uppercase block mb-2">
                  Tags
                </label>
                <TagInput tags={tags} onChange={setTags} allTags={allTags} />
              </div>

              {/* People */}
              <div>
                <label className="text-[11px] font-bold tracking-[0.15em] text-stone-400 uppercase block mb-2">
                  Who were you with?
                </label>
                <PeopleInput people={people} onChange={setPeople} />
              </div>

              {/* Date + Audio row */}
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <label className="text-[11px] font-bold tracking-[0.15em] text-stone-400 uppercase block mb-2">
                    When did this happen?
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 outline-none focus:ring-1 focus:ring-stone-300 transition-colors"
                  />
                </div>
                <div className="pb-0.5">
                  <AudioRecorder
                    onRecorded={(base64, contentType) =>
                      setPendingAudio({ base64, contentType })
                    }
                  />
                </div>
              </div>

              {/* Audio indicator */}
              {pendingAudio && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-50 text-xs text-stone-500" data-testid="audio-indicator">
                  <Volume2 className="size-3.5" />
                  <span>Voice memo attached</span>
                  <button
                    type="button"
                    onClick={() => setPendingAudio(null)}
                    className="ml-auto hover:text-stone-700"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-stone-100 flex justify-end">
              <Button
                onClick={handleSend}
                disabled={!canSend || sending}
                data-testid="btn-send-memory"
                className="rounded-xl px-6 gap-2"
              >
                <Send className="size-4" />
                {sending ? "Saving..." : editId ? "Update Memory" : "Save Memory"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
