import { memo } from 'react'
import type { SandboxOptionDefinition } from '@/features/sandbox-codec/core/sandbox-option-definition.types'
import { getValueSet, getDefaultIndex } from '@/features/sandbox-codec/core/sandbox-option-registry'
import { getDisplayAtIndex } from '@/features/sandbox-codec/core/sandbox-option-value-set.types'
import { Switch } from '@/shared/ui/switch'
import { Label } from '@/shared/ui/label'
import { Button } from '@/shared/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useSandboxActions } from '@/features/sandbox-codec/context/SandboxCodecContext'

interface OptionControlProps {
  option: SandboxOptionDefinition
  currentValueIndex: number
  isDisabled: boolean
  isReadOnly?: boolean
}

// Only pulls `setValue` from the actions context, which has a stable
// reference across renders — so this never re-renders due to *other*
// options' values changing, only when its own props change.
function OptionControlImpl({ option, currentValueIndex, isDisabled, isReadOnly }: OptionControlProps) {
  const { setValue } = useSandboxActions()
  const valueSet = getValueSet(option)
  const values = valueSet.values
  const isDefault = currentValueIndex === getDefaultIndex(option)

  if (isReadOnly) {
    return (
      <div className="flex items-center space-x-3">
        <div className="font-medium text-sm text-accent">
          {getDisplayAtIndex(valueSet, currentValueIndex)} {isDefault && <span className="text-muted-foreground text-xs ml-1">(Default)</span>}
        </div>
      </div>
    )
  }

  if (option.type === 'bool') {
    const isChecked = values[currentValueIndex] === true
    return (
      <div className={`flex items-center space-x-2 ${isDisabled ? 'opacity-50 grayscale' : ''}`}>
        <Switch
          checked={isChecked}
          onCheckedChange={(checked) => {
            setValue(option.option, checked ? 1 : 0)
          }}
          data-testid={`sandbox-value-${option.option}`}
        />
        <Label className="text-sm font-medium">
          {isChecked ? 'Enabled' : 'Disabled'}
        </Label>
      </div>
    )
  }

  const safeIndex = currentValueIndex >= 0 && currentValueIndex < values.length
    ? currentValueIndex
    : 0

  return (
    <div className={`flex items-center space-x-2 ${isDisabled ? 'opacity-50 grayscale' : ''}`}>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 flex-shrink-0"
        onClick={() => setValue(option.option, safeIndex - 1)}
        disabled={safeIndex === 0 || isDisabled}
        data-testid={`sandbox-dec-${option.option}`}
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>
      <div
        className={`w-[130px] text-center font-medium text-sm px-2 py-1.5 rounded-md border ${!isDefault ? 'border-primary bg-primary/5' : 'border-transparent'}`}
        data-testid={`sandbox-value-${option.option}`}
      >
        {getDisplayAtIndex(valueSet, currentValueIndex)}
        {isDefault && <span className="text-muted-foreground text-xs font-normal block">(Default)</span>}
      </div>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 flex-shrink-0"
        onClick={() => setValue(option.option, safeIndex + 1)}
        disabled={safeIndex === values.length - 1 || isDisabled}
        data-testid={`sandbox-inc-${option.option}`}
      >
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

export const OptionControl = memo(OptionControlImpl)
