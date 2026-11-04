import { memo } from 'react'
import type { SandboxOptionDefinition } from '@/features/sandbox-codec/core/sandbox-option-definition.types'
import { getDefaultIndex } from '@/features/sandbox-codec/core/sandbox-option-registry'
import { getDisplayName, getDescription } from '@/features/sandbox-codec/core/localization'
import { indexToAlpha, indexToAlpha2 } from '@/features/sandbox-codec/core/sandbox-option-codec'
import { OptionControl } from './OptionControl'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/shared/ui/tooltip'
import { HelpCircleIcon } from 'lucide-react'

interface OptionRowProps {
  option: SandboxOptionDefinition
  currentValueIndex: number
  isDisabled: boolean
  isReadOnly?: boolean
}

// Pure/presentational: everything it needs is passed as props, so
// React.memo can do a plain shallow-compare (option/currentValueIndex/
// isDisabled/isReadOnly are all primitives or a stable module-level
// object) and skip re-rendering rows whose value didn't actually change,
// even when a *different* option elsewhere changes.
function OptionRowImpl({ option, currentValueIndex, isDisabled, isReadOnly }: OptionRowProps) {
  const isDefault = currentValueIndex === getDefaultIndex(option)
  const description = getDescription(option)
  const name = getDisplayName(option)
  // The triplet this row contributes to a code: its own id, then its value.
  const idChars = indexToAlpha2(option.option)
  const valueChar =
    currentValueIndex >= 0 && currentValueIndex <= 26 ? indexToAlpha(currentValueIndex) : '-'

  return (
    <div
      className={`grid grid-cols-[2.9rem_minmax(0,1fr)] items-baseline gap-x-3 border-b border-foreground/10 px-2 py-2.5 transition-colors last:border-b-0 hover:bg-foreground/[0.035] sm:grid-cols-[2.9rem_minmax(0,1fr)_auto] sm:items-center ${
        isDisabled ? 'text-foreground/85 dark:text-foreground/70' : ''
      }`}
      data-testid={`sandbox-option-${option.option}`}
    >
      <span
        aria-hidden
        title={`Option ${idChars}, value ${valueChar}`}
        className={`font-mono text-[10px] leading-5 tracking-[0.08em] tabular-nums ${
          isDefault ? 'text-foreground/85 dark:text-foreground/70' : 'text-primary'
        }`}
      >
        {idChars}
        <span className={isDefault ? 'opacity-70' : 'opacity-75'}>{valueChar}</span>
      </span>

      <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1">
        <span className="text-[13px] font-medium leading-5">{name}</span>
        {description && (
          <Tooltip>
            <TooltipTrigger
              aria-label={`What ${name} does`}
              className="flex h-4 w-4 cursor-help items-center justify-center text-foreground/85 dark:text-foreground/70 transition-colors hover:text-foreground"
            >
              <HelpCircleIcon className="h-3 w-3" />
            </TooltipTrigger>
            <TooltipContent side="top" align="center" className="max-w-sm whitespace-pre-line">
              {description}
            </TooltipContent>
          </Tooltip>
        )}
        {!isDefault && !isReadOnly && (
          <span className="border border-primary/50 px-1 font-mono text-[9px] uppercase leading-4 tracking-[0.14em] text-primary">
            set
          </span>
        )}
        {isDisabled && (
          <span className="border border-foreground/20 px-1 font-mono text-[9px] uppercase leading-4 tracking-[0.14em] text-foreground/85 dark:text-foreground/70">
            gated
          </span>
        )}
      </div>

      <div className="col-start-2 mt-1.5 flex sm:col-start-3 sm:mt-0 sm:justify-end">
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

export const OptionRow = memo(OptionRowImpl)