import { memo } from 'react'
import type { SandboxOptionDefinition } from '@/features/sandbox-codec/core/sandbox-option-definition.types'
import { getValueSet, getDefaultIndex } from '@/features/sandbox-codec/core/sandbox-option-registry'
import { getDisplayAtIndex } from '@/features/sandbox-codec/core/sandbox-option-value-set.types'
import { Switch } from '@/shared/ui/switch'
import { Button } from '@/shared/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useSandboxActions } from '@/features/sandbox-codec/context/SandboxCodecContext'

interface OptionControlProps {
  option: SandboxOptionDefinition
  currentValueIndex: number
  isDisabled: boolean
  isReadOnly?: boolean
}

// 40px on touch, 28px from sm up: a phone finger needs the target, a desktop
// pointer does not want the row to grow.
const stepper =
  'h-10 w-10 shrink-0 rounded-none border border-foreground/20 bg-transparent text-foreground/85 outline-none transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40 sm:h-7 sm:w-7 dark:border-foreground/20 dark:bg-transparent dark:text-foreground/70 dark:hover:bg-foreground/[0.06] disabled:opacity-30'

const valueBox =
  'flex min-w-[6.5rem] flex-1 items-center justify-center border px-2 py-2.5 font-mono text-[13px] tabular-nums sm:flex-none sm:py-1.5 sm:text-[12px]'

// Only pulls `setValue` from the actions context, which has a stable
// reference across renders - so this never re-renders due to *other*
// options' values changing, only when its own props change.
function OptionControlImpl({ option, currentValueIndex, isDisabled, isReadOnly }: OptionControlProps) {
  const { setValue } = useSandboxActions()
  const valueSet = getValueSet(option)
  const values = valueSet.values
  const isDefault = currentValueIndex === getDefaultIndex(option)

  if (isReadOnly) {
    return (
      <div className="flex items-center gap-2 py-1 sm:py-0">
        <span
          className={`font-mono text-[13px] tabular-nums sm:text-[12px] ${
            isDefault ? 'text-foreground/85 dark:text-foreground/70' : 'text-primary'
          }`}
        >
          {getDisplayAtIndex(valueSet, currentValueIndex)}
        </span>
        {isDefault && (
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-foreground/85 dark:text-foreground/70">
            default
          </span>
        )}
      </div>
    )
  }

  if (option.type === 'bool') {
    const isChecked = values[currentValueIndex] === true
    return (
      <div className={`flex items-center gap-3 py-1 sm:py-0 ${isDisabled ? 'opacity-40' : ''}`}>
        <Switch
          checked={isChecked}
          onCheckedChange={(checked) => {
            setValue(option.option, checked ? 1 : 0)
          }}
          data-testid={`sandbox-value-${option.option}`}
          aria-label={isChecked ? 'Enabled' : 'Disabled'}
          className="h-6 w-10 sm:h-[18.4px] sm:w-[32px]"
        />
        <span
          className={`w-7 font-mono text-[10px] uppercase tracking-[0.14em] sm:text-[9px] ${
            isDefault ? 'text-foreground/85 dark:text-foreground/70' : 'text-primary'
          }`}
        >
          {isChecked ? 'on' : 'off'}
        </span>
      </div>
    )
  }

  const safeIndex =
    currentValueIndex >= 0 && currentValueIndex < values.length ? currentValueIndex : 0

  return (
    <div className={`flex items-stretch sm:items-center ${isDisabled ? 'opacity-40' : ''}`}>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Previous value"
        className={`${stepper} border-r-0`}
        onClick={() => setValue(option.option, safeIndex - 1)}
        disabled={safeIndex === 0 || isDisabled}
        data-testid={`sandbox-dec-${option.option}`}
      >
        <ChevronLeftIcon className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
      </Button>
      <div
        className={`${valueBox} ${
          isDefault
            ? 'border-foreground/20 text-foreground/85 dark:text-foreground/70'
            : 'border-primary text-primary'
        }`}
        data-testid={`sandbox-value-${option.option}`}
      >
        {getDisplayAtIndex(valueSet, currentValueIndex)}
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Next value"
        className={`${stepper} border-l-0`}
        onClick={() => setValue(option.option, safeIndex + 1)}
        disabled={safeIndex === values.length - 1 || isDisabled}
        data-testid={`sandbox-inc-${option.option}`}
      >
        <ChevronRightIcon className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
      </Button>
    </div>
  )
}

export const OptionControl = memo(OptionControlImpl)
