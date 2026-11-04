import { Button } from '@/shared/ui/button'
import { CopyIcon } from 'lucide-react'

interface LiveCodeCardProps {
  currentCode: string
  onCopy: () => void
}

/**
 * The artifact, given the strongest ground on the page. A sandbox code is a
 * version letter followed by 3-character triplets, so the plate prints it that
 * way: the version stands apart, every triplet is its own cell, and the reader
 * can count the entries without decoding the string.
 */
export function LiveCodeCard({ currentCode, onCopy }: LiveCodeCardProps) {
  const version = currentCode.slice(0, 1)
  const body = currentCode.slice(1)
  const entries: string[] = []
  for (let i = 0; i < body.length; i += 3) entries.push(body.slice(i, i + 3))

  return (
    <div className="relative flex min-w-0 flex-col bg-primary text-primary-foreground">
      <div className="flex items-baseline justify-between gap-4 border-b border-primary-foreground/25 px-5 py-2.5">
        <span className="font-mono text-[9px] uppercase tracking-[0.28em]">Live code</span>
        <span
          className="font-mono text-[9px] uppercase tracking-[0.18em] tabular-nums text-primary-foreground/70"
          data-testid="codec-length"
        >
          {currentCode.length} {currentCode.length === 1 ? "char" : "chars"} &middot; {entries.length}{' '}
          {entries.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      <div
        className="scrollbar-thin max-h-[10.5rem] min-h-[8rem] flex-1 overflow-y-auto px-5 py-4"
        data-testid="codec-live-code"
      >
        <span className="sr-only">{currentCode}</span>
        <div aria-hidden className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
          <span className="mr-1 inline-flex h-5 min-w-5 items-center justify-center border border-primary-foreground/45 px-1 font-mono text-[10px] leading-none">
            {version}
          </span>
          {entries.map((entry) => (
            <span
              key={entry.slice(0, 2)}
              className="inline-flex h-5 items-center px-0.5 font-mono text-[13px] leading-none tracking-[0.08em] transition-colors hover:bg-primary-foreground/20"
            >
              {entry}
            </span>
          ))}
          {entries.length === 0 && (
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary-foreground/60">
              no entries
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-primary-foreground/25 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.18em] text-primary-foreground/70">
          {entries.length === 0
            ? 'Default state \u00b7 every option at its shipped value'
            : `${entries.length} ${entries.length === 1 ? 'option differs' : 'options differ'} from the defaults`}
        </span>
        <Button
          onClick={onCopy}
          data-testid="codec-copy"
          variant="ghost"
          className="h-8 w-full rounded-none border border-primary-foreground/45 bg-transparent px-3 font-mono text-[10px] uppercase tracking-[0.18em] text-primary-foreground outline-none transition-colors hover:bg-primary-foreground hover:text-primary focus-visible:ring-2 focus-visible:ring-primary-foreground/60 sm:w-auto"
        >
          <CopyIcon className="mr-2 h-3.5 w-3.5" />
          Copy code
        </Button>
      </div>
    </div>
  )
}