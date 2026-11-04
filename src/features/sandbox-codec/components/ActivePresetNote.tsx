import { Button } from '@/shared/ui/button'
import { CopyIcon } from 'lucide-react'
import {
  getPresetDescription,
  getPresetName,
  getSandboxPreset,
} from '@/features/sandbox-codec/core/sandbox-presets.data'
import { useSandboxActions, useSandboxUI, useSandboxDerived } from '@/features/sandbox-codec/context/SandboxCodecContext'

/**
 * The line under the code plate: which shipped preset is loaded, what the game
 * says about it, and how many options it changes. Renders nothing while the
 * options are a custom set, so the default view stays unchanged.
 */
export function ActivePresetNote() {
  const { copyToClipboard } = useSandboxActions()
  const { activePresetId, currentCode } = useSandboxUI()
  const { changedOptions } = useSandboxDerived()

  const preset = activePresetId ? getSandboxPreset(activePresetId) : undefined
  if (!preset) return null

  const description = getPresetDescription(preset)

  return (
    <div
      className="mt-4 flex flex-col gap-3 border border-foreground/15 bg-foreground/[0.03] px-4 py-3 sm:flex-row sm:items-start sm:justify-between dark:bg-foreground/[0.045]"
      data-testid="codec-preset-note"
    >
      <div className="flex min-w-0 items-start gap-3">
        <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-primary" />
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-[13px] font-semibold" data-testid="codec-preset-name">
              {getPresetName(preset)}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/85 dark:text-foreground/70">
              <span className="tabular-nums text-primary">{changedOptions.length}</span> options changed
            </span>
          </div>
          {description && (
            <p
              className="max-w-2xl text-pretty text-[12px] leading-relaxed text-foreground/80 dark:text-foreground/70"
              data-testid="codec-preset-description"
            >
              {description}
            </p>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 shrink-0 rounded-none border border-foreground/25 px-2.5 font-mono text-[9px] uppercase tracking-[0.16em] hover:bg-foreground/[0.07] dark:border-foreground/25 dark:bg-transparent dark:hover:bg-foreground/[0.07]"
        onClick={() => copyToClipboard(currentCode)}
        data-testid="codec-preset-copy"
      >
        <CopyIcon className="mr-1.5 h-3 w-3" />
        Copy preset code
      </Button>
    </div>
  )
}