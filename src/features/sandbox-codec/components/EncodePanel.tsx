import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { OptionRow } from './OptionRow'
import { useSandboxValues, useSandboxDerived } from '@/features/sandbox-codec/context/SandboxCodecContext'
import { getDefaultIndex } from '@/features/sandbox-codec/core/sandbox-option-registry'

export function EncodePanel() {
  const { state, disabledOptionIds } = useSandboxValues()
  const { filteredGroups } = useSandboxDerived()
  const categoryKeys = Object.keys(filteredGroups)

  if (categoryKeys.length === 0) {
    return (
      <div className="border border-dashed border-foreground/20 px-6 py-12 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/85 dark:text-foreground/70">
          No option matches the filter
        </p>
      </div>
    )
  }

  return (
    <div className="animate-fade-slide">
      <Tabs defaultValue={categoryKeys[0]} className="w-full gap-0">
        <TabsList className="scrollbar-thin flex h-auto w-full flex-wrap justify-start gap-x-1 gap-y-1 overflow-x-auto rounded-none border-b border-foreground/10 p-0 pb-2">
          {categoryKeys.map((cat) => {
            const opts = filteredGroups[cat]
            const modifiedCount = opts.filter((o) => {
              const s = state.get(o.option)
              return s && s.currentIndex !== getDefaultIndex(o)
            }).length
            return (
              <TabsTrigger
                key={cat}
                value={cat}
                className="h-auto flex-none gap-1.5 rounded-none border border-transparent px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/85 dark:text-foreground/70 transition-colors hover:text-foreground data-active:border-foreground/25 data-active:bg-foreground/[0.06] data-active:text-foreground data-active:shadow-none"
              >
                {cat}
                {modifiedCount > 0 && (
                  <span className="tabular-nums text-primary">{modifiedCount}</span>
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>
        {categoryKeys.map((cat) => (
          <TabsContent key={cat} value={cat} className="mt-1 outline-none">
            <div>
              {filteredGroups[cat].map((def) => (
                <OptionRow
                  key={def.option}
                  option={def}
                  currentValueIndex={state.get(def.option)?.currentIndex ?? getDefaultIndex(def)}
                  isDisabled={disabledOptionIds.has(def.option)}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}