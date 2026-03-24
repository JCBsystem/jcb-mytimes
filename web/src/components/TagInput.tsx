import { useState } from "react"
import { X } from "lucide-react"

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  allTags?: string[]
}

export function TagInput({ tags, onChange, allTags }: TagInputProps) {
  const [inputValue, setInputValue] = useState("")

  const addTag = (tag: string) => {
    const trimmed = tag.trim()
    if (!trimmed || tags.includes(trimmed)) return
    onChange([...tags, trimmed])
    setInputValue("")
  }

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(inputValue)
    }
    if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1))
    }
  }

  const suggestions =
    allTags && inputValue
      ? allTags
          .filter(
            (t) =>
              t.toLowerCase().includes(inputValue.toLowerCase()) &&
              !tags.includes(t),
          )
          .slice(0, 5)
      : []

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600"
          >
            {tag}
            <button type="button" onClick={() => removeTag(tag)}>
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add tag..."
          className="min-w-[80px] flex-1 bg-transparent text-sm outline-none placeholder:text-stone-400"
        />
      </div>
      {suggestions.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {suggestions.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => addTag(tag)}
              className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600 cursor-pointer hover:bg-stone-200"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
