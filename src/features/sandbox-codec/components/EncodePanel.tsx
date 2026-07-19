import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Badge } from '@/shared/ui/badge'
import { OptionRow } from './OptionRow'
import { useSandboxCodec } from '@/features/sandbox-codec/context/SandboxCodecContext'

export function EncodePanel() {
  const { filteredGroups, values } = useSandboxCodec()
  const categoryKeys = Object.keys(filteredGroups)

  if (categoryKeys.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
        No options matched your search.
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
      <Tabs defaultValue={categoryKeys[0]} className="w-full">
        <TabsList className="flex flex-wrap w-full h-auto gap-2 bg-transparent justify-start mb-6 px-0">
          {categoryKeys.map((cat) => {
            const opts = filteredGroups[cat]
            const modifiedCount = opts.filter((o) => values[o.id] !== o.defaultValueIndex).length
            return (
              <TabsTrigger
                key={cat}
                value={cat}
                className="data-active:bg-primary data-active:text-primary-foreground border rounded-full px-4 py-2 flex items-center gap-2 transition-colors"
              >
                {cat}
                {modifiedCount > 0 && (
                  <Badge variant="secondary" className="rounded-full px-1.5 py-0.5 text-[10px] bg-background/50">
                    {modifiedCount}
                  </Badge>
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>
        {categoryKeys.map((cat) => (
          <TabsContent key={cat} value={cat} className="mt-0 outline-none">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
              {filteredGroups[cat].map((opt) => (
                <OptionRow key={opt.id} option={opt} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
