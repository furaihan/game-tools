import { type SandboxOption, getDisplayName, getDescription } from '@/features/sandbox-codec/core/sandboxOptions'
import { OptionControl } from './OptionControl'
import { Badge } from '@/shared/ui/badge'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/shared/ui/tooltip'
import { HelpCircle } from 'lucide-react'
import { useSandboxCodec } from '@/features/sandbox-codec/context/SandboxCodecContext'

interface OptionRowProps {
  option: SandboxOption
  isReadOnly?: boolean
}

export function OptionRow({ option, isReadOnly }: OptionRowProps) {
  const { values, disabledOptionIds } = useSandboxCodec()
  const currentValueIndex = values[option.id] ?? option.defaultValueIndex
  const isDisabled = disabledOptionIds.has(option.id)
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
          {!isDefault && !isReadOnly && <Badge variant="secondary">Modified</Badge>}
          {isDisabled && <Badge variant="outline" className="text-muted-foreground">Disabled</Badge>}
        </div>
      </div>
      <div className="flex-shrink-0">
        <OptionControl
          option={option}
          currentValueIndex={currentValueIndex}
          isDisabled={isDisabled}
          isReadOnly={isReadOnly}
        />
      </div>
    </div>
  )
}
