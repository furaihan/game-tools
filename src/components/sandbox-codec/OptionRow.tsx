import { type SandboxOption, getDisplayName, getDescription } from '@/lib/sandbox-codec/sandboxOptions'
import { OptionControl } from './OptionControl'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { HelpCircle } from 'lucide-react'

interface OptionRowProps {
  option: SandboxOption
  currentValueIndex: number
  isDisabled: boolean
  isReadOnly?: boolean
  onSetValue?: (optionId: number, valueIndex: number) => void
}

export function OptionRow({ option, currentValueIndex, isDisabled, isReadOnly, onSetValue }: OptionRowProps) {
  const isDefault = currentValueIndex === option.defaultValueIndex
  const description = getDescription(option.enumName)

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border bg-card text-card-foreground shadow-sm gap-4 transition-all">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{getDisplayName(option.enumName)}</span>
          {description && (
            <Tooltip>
              <TooltipTrigger className="cursor-help text-muted-foreground hover:text-foreground transition-colors">
                <HelpCircle className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent side="top" align="center" className="max-w-sm whitespace-pre-line">
                {description}
              </TooltipContent>
            </Tooltip>
          )}
          {!isDefault && <Badge variant="secondary">Modified</Badge>}
          {isDisabled && <Badge variant="outline" className="text-muted-foreground">Disabled</Badge>}
        </div>
        <p className="text-xs text-muted-foreground font-mono">{option.enumName}</p>
      </div>
      <div className="flex-shrink-0">
        <OptionControl
          option={option}
          currentValueIndex={currentValueIndex}
          isDisabled={isDisabled}
          isReadOnly={isReadOnly}
          onSetValue={onSetValue}
        />
      </div>
    </div>
  )
}
