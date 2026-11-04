import { OptionRow } from './OptionRow'
import {
  useSandboxValues,
  useSandboxDerived,
  useSandboxUI,
} from '@/features/sandbox-codec/context/SandboxCodecContext'
import { getDefaultIndex } from '@/features/sandbox-codec/core/sandbox-option-registry'
import { decodeCodeToPreset } from '@/features/sandbox-codec/core/sandbox-option-codec'

/**
 * The outbound half of the job: exactly the options the current code carries.
 * When there are none, the empty state still has to teach the format, since a
 * code with no entries is a valid code.
 */
export function DecodePanel() {
  const { state, disabledOptionIds } = useSandboxValues()
  const { filteredChangedGroups, changedOptions } = useSandboxDerived()
  const { currentCode, searchQuery } = useSandboxUI()

  const groups = Object.entries(filteredChangedGroups)
  const entryCount = changedOptions.length
  const parsed = decodeCodeToPreset(currentCode)

  if (groups.length === 0) {
    return (
      <div className="border border-dashed border-foreground/20 px-6 py-12 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/85 dark:text-foreground/70">
          {changedOptions.length > 0
            ? 'No changed option matches the filter'
            : 'This code carries no entries'}
        </p>
        <p className="mx-auto mt-3 max-w-sm text-pretty text-[12px] leading-relaxed text-foreground/70">
          {changedOptions.length > 0
            ? 'Clear the filter to see every option the code sets.'
            : 'Every option is at its shipped default. Pick a preset or change a value and its entry appears here.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/85 dark:text-foreground/70">
        <span>
          <span className="tabular-nums text-foreground">{parsed.size}</span> entries decoded
          {entryCount !== parsed.size && (
            <span className="ml-2 text-foreground/60">
              ({entryCount} differ from default)
            </span>
          )}
        </span>
        {searchQuery && (
          <span>
            filtered by &ldquo;<span className="normal-case text-foreground">{searchQuery}</span>&rdquo;
          </span>
        )}
      </div>

      {groups.map(([cat, opts]) => (
        <section key={cat}>
          <h3 className="flex items-baseline gap-3 border-b border-foreground/20 pb-1.5 font-mono text-[9px] uppercase tracking-[0.24em] text-foreground/85 dark:text-foreground/70">
            <span className="text-foreground">{cat}</span>
            <span className="tabular-nums">{opts.length}</span>
          </h3>
          <div className="mt-1">
            {opts.map((def) => (
              <OptionRow
                key={def.option}
                option={def}
                currentValueIndex={state.get(def.option)?.currentIndex ?? getDefaultIndex(def)}
                isDisabled={disabledOptionIds.has(def.option)}
                isReadOnly
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}