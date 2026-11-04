import { Button } from '@/shared/ui/button'
import { Textarea } from '@/shared/ui/textarea'
import { CornerDownLeftIcon } from 'lucide-react'
import { useSandboxActions, useSandboxUI } from '@/features/sandbox-codec/context/SandboxCodecContext'

/**
 * The inbound half of the codec: paste a code, read what it sets. It sits
 * beside the live code so both directions of the job are on the first screen.
 */
export function DecodeStrip() {
  const { setDecodeInput, handleDecode } = useSandboxActions()
  const { decodeInput } = useSandboxUI()

  return (
    <div>
      <label
        htmlFor="codec-decode-input"
        className="font-mono text-[9px] uppercase tracking-[0.24em] text-foreground/85 dark:text-foreground/70"
      >
        Decode a code
      </label>
      <Textarea
        id="codec-decode-input"
        data-testid="codec-decode-input"
        placeholder="A&#8230; paste a sandbox code"
        value={decodeInput}
        onChange={(e) => setDecodeInput(e.target.value)}
        spellCheck={false}
        autoComplete="off"
        className="scrollbar-thin mt-2 max-h-28 min-h-[4.25rem] resize-none rounded-none border-foreground/25 bg-transparent px-2.5 py-2 font-mono text-[11px] leading-relaxed tracking-[0.05em] placeholder:text-foreground/60 dark:placeholder:text-foreground/50 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/30 dark:bg-transparent"
      />
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
        <Button
          onClick={handleDecode}
          data-testid="codec-decode-apply"
          className="h-7 rounded-none px-3 font-mono text-[10px] uppercase tracking-[0.18em] outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <CornerDownLeftIcon className="mr-1.5 h-3 w-3" />
          Decode
        </Button>
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/85 dark:text-foreground/70">
          Only changed options are in the string
        </span>
      </div>
    </div>
  )
}
