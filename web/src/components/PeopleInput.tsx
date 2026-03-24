import { useState } from "react"
import { X } from "lucide-react"

interface PeopleInputProps {
  people: string[]
  onChange: (people: string[]) => void
}

export function PeopleInput({ people, onChange }: PeopleInputProps) {
  const [inputValue, setInputValue] = useState("")

  const addPerson = (name: string) => {
    const trimmed = name.trim()
    if (!trimmed || people.includes(trimmed)) return
    onChange([...people, trimmed])
    setInputValue("")
  }

  const removePerson = (name: string) => {
    onChange(people.filter((p) => p !== name))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addPerson(inputValue)
    }
    if (e.key === "Backspace" && !inputValue && people.length > 0) {
      onChange(people.slice(0, -1))
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {people.map((person) => (
        <span
          key={person}
          className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600"
        >
          {person}
          <button type="button" onClick={() => removePerson(person)}>
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add person..."
        className="min-w-[80px] flex-1 bg-transparent text-sm outline-none placeholder:text-stone-400"
      />
    </div>
  )
}
