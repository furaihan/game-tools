import { usePipelineContext } from '@/context/pipeline-context'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

export function CleanupControls() {
  const { params: { cleanup }, setCleanupParams, isProcessing } = usePipelineContext()

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Majority Filter</Label>
          <span className="font-mono text-[11px] text-muted-foreground">{cleanup.majorityRadius}</span>
        </div>
        <Slider
          min={0}
          max={5}
          step={1}
          value={[cleanup.majorityRadius]}
          onValueChange={(v) => setCleanupParams({ majorityRadius: Array.isArray(v) ? v[0] : v })}
        />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Replaces each pixel with the majority value in its neighborhood
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Median Filter</Label>
          <span className="font-mono text-[11px] text-muted-foreground">{cleanup.medianRadius}</span>
        </div>
        <Slider
          min={0}
          max={5}
          step={1}
          value={[cleanup.medianRadius]}
          onValueChange={(v) => setCleanupParams({ medianRadius: Array.isArray(v) ? v[0] : v })}
        />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Replaces each pixel with the median value in its neighborhood
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Morphological Opening</Label>
          <span className="font-mono text-[11px] text-muted-foreground">{cleanup.morphOpen}</span>
        </div>
        <Slider
          min={0}
          max={5}
          step={1}
          value={[cleanup.morphOpen]}
          onValueChange={(v) => setCleanupParams({ morphOpen: Array.isArray(v) ? v[0] : v })}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Morphological Closing</Label>
          <span className="font-mono text-[11px] text-muted-foreground">{cleanup.morphClose}</span>
        </div>
        <Slider
          min={0}
          max={5}
          step={1}
          value={[cleanup.morphClose]}
          onValueChange={(v) => setCleanupParams({ morphClose: Array.isArray(v) ? v[0] : v })}
        />
      </div>

      <Button className="w-full gap-1.5" size="sm" variant="secondary" disabled={isProcessing}>
        <Sparkles className="h-3.5 w-3.5" />
        Apply Cleanup
      </Button>
    </div>
  )
}