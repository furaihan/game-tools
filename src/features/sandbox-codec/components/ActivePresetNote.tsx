import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { CopyIcon } from 'lucide-react'
import {
  getPresetDescription,
  getPresetName,
  getSandboxPreset,
} from '@/features/sandbox-codec/core/sandbox-presets.data'
import { useSandboxActions, useSandboxUI, useSandboxDerived } from '@/features/sandbox-codec/context/SandboxCodecContext'

/**
 * The line under the live code card: which shipped preset is loaded, what the
 * game says about it, and how many options it changes. Renders nothing while
 * the options are a custom set, so the default view stays unchanged.
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
      className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-start sm:justify-between"
      data-testid="codec-preset-note"
    >
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold" data-testid="codec-preset-name">
            {getPresetName(preset)}
          </span>
          <Badge variant="secondary">{changedOptions.length} options changed</Badge>
        </div>
        {description && (
          <p className="max-w-2xl text-sm text-muted-foreground" data-testid="codec-preset-description">
            {description}
          </p>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="shrink-0"
        onClick={() => copyToClipboard(currentCode)}
        data-testid="codec-preset-copy"
      >
        <CopyIcon className="w-4 h-4 mr-2" />
        Copy preset code
      </Button>
    </div>
  )
}
