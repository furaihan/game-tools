import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePipelineContext } from '@/context/pipeline-context'
import { useSegmentation } from '@/hooks/use-segmentation'
import { ClusterMapping } from './ClusterMapping'
import { CleanupControls } from './CleanupControls'
import { DitherControls } from './DitherControls'
import { Layers, Palette, Sparkles, Blend, Loader2 } from 'lucide-react'

export function PipelinePanel() {
  return (
    <Accordion className="w-full">
      <AccordionItem value="segmentation">
        <AccordionTrigger className="gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Layers className="h-3.5 w-3.5" />
            Segment
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-2">
          <SegmentationControls />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="clusters">
        <AccordionTrigger className="gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Palette className="h-3.5 w-3.5" />
            Clusters
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-2">
          <ClusterMapping />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="cleanup">
        <AccordionTrigger className="gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            Cleanup
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-2">
          <CleanupControls />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="dither">
        <AccordionTrigger className="gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Blend className="h-3.5 w-3.5" />
            Dither
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-2">
          <DitherControls />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

function SegmentationControls() {
  const { params: { segmentation }, setSegmentationParams, isProcessing } = usePipelineContext()
  const { runSegmentation } = useSegmentation()

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-medium">Superpixels</label>
        <Select
          value={segmentation.superpixelCount.toString()}
          onValueChange={(v) => v && setSegmentationParams({ superpixelCount: parseInt(v) })}
        >
          <SelectTrigger className="h-8 w-full text-xs">
            <SelectValue placeholder="Select count" />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((val) => (
              <SelectItem key={val} value={val.toString()} className="text-xs">
                {val}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium">Compactness</label>
          <span className="font-mono text-[11px] text-muted-foreground">{segmentation.compactness}</span>
        </div>
        <Slider
          min={1}
          max={40}
          step={1}
          value={[segmentation.compactness]}
          onValueChange={(v) => setSegmentationParams({ compactness: Array.isArray(v) ? v[0] : v })}
        />
      </div>

      <Separator />

      <Button
        className="w-full gap-1.5"
        size="sm"
        onClick={runSegmentation}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Layers className="h-3.5 w-3.5" />
        )}
        {isProcessing ? 'Segmenting...' : 'Run Segmentation'}
      </Button>

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Settings apply on the next segmentation run. Current image uses previous settings.
      </p>
    </div>
  )
}