import { usePipelineContext } from '@/context/pipeline-context'
import { OFFICIAL_PALETTE } from '@/core/palette'

export function StatisticsPanel() {
  const { classificationResult, processedImage, processingTime, segmentationResult } = usePipelineContext()

  if (!classificationResult && !processedImage) return null

  const labels = classificationResult?.labels
  const totalPixels = labels ? labels.length : 0

  const biomeCounts: Record<string, number> = {}
  let totalClassified = 0

  if (labels) {
    for (const p of OFFICIAL_PALETTE) biomeCounts[p.biome] = 0
    for (let i = 0; i < labels.length; i++) {
      const biome = OFFICIAL_PALETTE[labels[i]]?.biome
      if (biome) {
        biomeCounts[biome] = (biomeCounts[biome] || 0) + 1
        totalClassified++
      }
    }
  }

  const regionCount = segmentationResult?.clusters.length || 0
  const maxCount = Math.max(...Object.values(biomeCounts), 1)

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold">Biome Distribution</h4>
        <div className="flex gap-3 text-[11px] text-muted-foreground">
          <span>{totalPixels.toLocaleString()} px</span>
          <span>{regionCount} regions</span>
          <span>{processingTime}ms</span>
        </div>
      </div>
      <div className="mt-2.5 space-y-1.5">
        {OFFICIAL_PALETTE.map((p) => {
          const count = biomeCounts[p.biome] || 0
          const pct = totalClassified > 0 ? ((count / totalClassified) * 100) : 0
          const barWidth = (count / maxCount) * 100

          return (
            <div key={p.biome} className="flex items-center gap-2">
              <div
                className="h-3 w-3 flex-shrink-0 rounded"
                style={{
                  backgroundColor: `rgb(${p.rgb[0]},${p.rgb[1]},${p.rgb[2]})`,
                }}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium capitalize">
                    {p.biome.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-muted-foreground">{pct.toFixed(1)}%</span>
                </div>
                <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: `rgb(${p.rgb[0]},${p.rgb[1]},${p.rgb[2]})`,
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}