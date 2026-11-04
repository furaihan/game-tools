import { Input } from '@/shared/ui/input'
import { SearchIcon, XIcon } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full sm:w-64">
      <SearchIcon className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground/85 dark:text-foreground/70" />
      <Input
        placeholder="Filter options"
        aria-label="Filter options"
        className="h-8 rounded-none border-foreground/25 bg-transparent pl-7 pr-7 font-mono text-[11px] tracking-[0.02em] placeholder:text-foreground/60 dark:placeholder:text-foreground/50 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/30 dark:bg-transparent"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid="codec-search"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear filter"
          onClick={() => onChange('')}
          className="absolute right-1.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-foreground/85 dark:text-foreground/70 transition-colors hover:text-foreground"
        >
          <XIcon className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}