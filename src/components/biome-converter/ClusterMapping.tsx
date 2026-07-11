import { usePipelineContext } from '@/context/pipeline-context'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { OFFICIAL_PALETTE } from '@/core/palette'
import type { Biome } from '@/types'

export function ClusterMapping() {
  const { segmentationResult, clusterMapping, updateClusterMapping, protectEdits, setProtectEdits } = usePipelineContext()

  if (!segmentationResult) return null

  const clusters = segmentationResult.clusters

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Switch
          id="protect-edits"
          checked={protectEdits}
          onCheckedChange={setProtectEdits}
        />
        <label htmlFor="protect-edits" className="text-xs text-muted-foreground leading-tight">
          Protect manual edits from reclassification
        </label>
      </div>

      <ScrollArea className="h-[360px] pr-2 scrollbar-thin">
        <div className="space-y-1.5">
          {clusters.map((cluster) => (
            <div
              key={cluster.id}
              className="flex items-center justify-between rounded-lg border bg-background/50 px-3 py-2 transition-colors hover:bg-background"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="h-5 w-5 flex-shrink-0 rounded border border-border/50"
                  style={{
                    backgroundColor: `rgb(${cluster.centroidRGB[0]},${cluster.centroidRGB[1]},${cluster.centroidRGB[2]})`,
                  }}
                />
                <div className="min-w-0">
                  <div className="text-[13px] font-medium leading-none">Cluster {cluster.id}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    {cluster.pixelCount.toLocaleString()}px
                  </div>
                </div>
              </div>

              <Select
                value={clusterMapping.get(cluster.id) || 'forest'}
                onValueChange={(val) => updateClusterMapping(cluster.id, val as Biome)}
              >
                <SelectTrigger className="h-8 w-[130px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OFFICIAL_PALETTE.map((p) => (
                    <SelectItem key={p.biome} value={p.biome} className="text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded"
                          style={{
                            backgroundColor: `rgb(${p.rgb[0]},${p.rgb[1]},${p.rgb[2]})`,
                          }}
                        />
                        <span>{p.biome.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}