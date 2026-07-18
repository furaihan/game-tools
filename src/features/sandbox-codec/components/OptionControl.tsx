import type { SandboxOption } from '@/features/sandbox-codec/core/sandboxOptions'
import { getValueSetValues, getValueSetDisplay } from '@/features/sandbox-codec/core/valueSets'
import { Switch } from '@/shared/ui/switch'
import { Label } from '@/shared/ui/label'
import { Button } from '@/shared/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface OptionControlProps {
  option: SandboxOption
  currentValueIndex: number
  isDisabled: boolean
  isReadOnly?: boolean
  onSetValue?: (optionId: number, valueIndex: number) => void
}

export function OptionControl({ option, currentValueIndex, isDisabled, isReadOnly, onSetValue }: OptionControlProps) {
  const isDefault = currentValueIndex === option.defaultValueIndex
  const values = getValueSetValues(option.valueSetName, option.type)
  const currentItem = values.find((v) => v.index === currentValueIndex) || values[0]

  if (isReadOnly) {
    return (
      <div className="flex items-center space-x-3">
        <div className="font-medium text-sm text-accent">
          {getValueSetDisplay(option.valueSetName, option.type, currentValueIndex)} {isDefault && <span className="text-muted-foreground text-xs ml-1">(Default)</span>}
        </div>
      </div>
    )
  }

  if (option.type === 'bool') {
    const isChecked = currentItem?.value === 'true'
    return (
      <div className={`flex items-center space-x-2 ${isDisabled ? 'opacity-50 grayscale' : ''}`}>
        <Switch
          checked={isChecked}
          onCheckedChange={(checked) => {
            const idxItem = values.find((v) => v.value === String(checked))
            if (idxItem && onSetValue) onSetValue(option.id, idxItem.index)
          }}
        />
        <Label className="text-sm font-medium">
          {isChecked ? 'Enabled' : 'Disabled'}
        </Label>
      </div>
    )
  }

  const validCurrentIndex = values.findIndex((v) => v.index === currentValueIndex)
  const safeIndex = validCurrentIndex !== -1 ? validCurrentIndex : 0

  return (
    <div className={`flex items-center space-x-2 ${isDisabled ? 'opacity-50 grayscale' : ''}`}>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 flex-shrink-0"
        onClick={() => onSetValue?.(option.id, values[safeIndex - 1].index)}
        disabled={safeIndex === 0 || isDisabled}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className={`w-[130px] text-center font-medium text-sm px-2 py-1.5 rounded-md border ${!isDefault ? 'border-primary bg-primary/5' : 'border-transparent'}`}>
        {getValueSetDisplay(option.valueSetName, option.type, currentValueIndex)}
        {isDefault && <span className="text-muted-foreground text-xs font-normal block">(Default)</span>}
      </div>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 flex-shrink-0"
        onClick={() => onSetValue?.(option.id, values[safeIndex + 1].index)}
        disabled={safeIndex === values.length - 1 || isDisabled}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
