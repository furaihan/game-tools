import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import {
  SANDBOX_PRESETS,
  getPresetGroupName,
  getPresetName,
  type SandboxPresetGroup,
} from '@/features/sandbox-codec/core/sandbox-presets.data'
import { useSandboxActions, useSandboxUI } from '@/features/sandbox-codec/context/SandboxCodecContext'

/**
 * The value shown when the current options are not one of the shipped presets.
 * It is a sentinel rather than an empty string so the trigger always has a label.
 */
const CUSTOM = 'custom'

const GROUP_ORDER: SandboxPresetGroup[] = ['official', 'difficulty']

/**
 * base-ui resolves the trigger's label from `items`, not from the mounted item
 * elements, so without this the trigger shows the raw id (`official.chibi-mode`)
 * rather than the name the game gives the preset.
 */
const ITEMS = [
  { value: CUSTOM, label: 'Custom / edited' },
  ...SANDBOX_PRESETS.map((preset) => ({ value: preset.id, label: getPresetName(preset) })),
]

/**
 * Picks one of the presets shipped with the game and loads it into the editor.
 * Selecting one overwrites the current options and switches to Decode Mode,
 * where the read-only rows show exactly what it changes.
 */
export function PresetPicker() {
  const { applyPreset } = useSandboxActions()
  const { activePresetId } = useSandboxUI()

  return (
    <div className="min-w-0 flex-1">
      <span
        id="codec-preset-label"
        className="font-mono text-[9px] uppercase tracking-[0.24em] text-foreground/85 dark:text-foreground/70"
      >
        Start from a shipped preset
      </span>
      <Select
        items={ITEMS}
        value={activePresetId ?? CUSTOM}
        onValueChange={(value) => {
          if (value && value !== CUSTOM) applyPreset(value)
        }}
      >
        <SelectTrigger
          size="sm"
          aria-labelledby="codec-preset-label"
          className="mt-2 h-8 w-full rounded-none border-foreground/25 bg-transparent font-mono text-[11px] dark:bg-transparent dark:hover:bg-foreground/[0.06]"
          data-testid="codec-preset-trigger"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-none">
          <SelectItem value={CUSTOM} data-testid="codec-preset-option-custom">
            Custom / edited
          </SelectItem>
          {GROUP_ORDER.map((group) => {
            const presets = SANDBOX_PRESETS.filter((preset) => preset.group === group)
            if (presets.length === 0) return null
            return (
              <SelectGroup key={group}>
                <SelectLabel className="font-mono text-[9px] uppercase tracking-[0.2em]">
                  {getPresetGroupName(group)}
                </SelectLabel>
                {presets.map((preset) => (
                  <SelectItem
                    key={preset.id}
                    value={preset.id}
                    data-testid={`codec-preset-option-${preset.id}`}
                  >
                    {getPresetName(preset)}
                  </SelectItem>
                ))}
              </SelectGroup>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}