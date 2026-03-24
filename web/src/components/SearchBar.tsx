import { useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: (query: string) => void
}

const DEBOUNCE_MS = 300

export function SearchBar({ value, onChange, onSearch }: SearchBarProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounce the onSearch callback
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(() => {
      // Only fire search for 2+ characters or empty string (to clear)
      if (value.trim().length >= 2 || value.trim().length === 0) {
        onSearch(value.trim())
      }
    }, DEBOUNCE_MS)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [value, onSearch])

  const handleClear = () => {
    onChange("")
    onSearch("")
  }

  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-2.5">
      <div className="relative flex items-center">
        <Search className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search memories..."
          className="w-full rounded-lg bg-muted/50 py-2 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none focus:bg-muted/80 focus:ring-1 focus:ring-ring/30 transition-colors"
        />
        {value && (
          <Button
            variant="ghost"
            size="icon-xs"
            className="absolute right-1.5"
            onClick={handleClear}
          >
            <X className="size-3.5" />
          </Button>
        )}
      </div>
    </div>
  )
}
