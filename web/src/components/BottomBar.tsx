import { useRef, useState } from "react"
import { ArrowUp, ImagePlus, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BottomBarProps {
  onSend: (data: { text: string; image?: File }) => void
}

export function BottomBar({ onSend }: BottomBarProps) {
  const [text, setText] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onSend({ text: trimmed, image: image ?? undefined })
    setText("")
    clearImage()
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

      {/* Input row */}
      <div className="flex items-end gap-2 px-4 py-3">
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
          className="min-w-0 flex-1 rounded-full bg-muted/50 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:bg-muted/80 focus:ring-1 focus:ring-ring/30 transition-colors"
        />

        {canSend && (
          <Button
            size="icon"
            onClick={handleSend}
            className="shrink-0 rounded-full"
          >
            <ArrowUp className="size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
