import { useState } from 'react'
import { usePipelineContext } from '@/context/pipeline-context'
import { CanvasViewer } from './CanvasViewer'
import { StatisticsPanel } from './StatisticsPanel'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PreviewPanels() {
  const { originalImage, workingImage, processedImage } = usePipelineContext()
  const [showOriginal, setShowOriginal] = useState(true)
  const [showStats, setShowStats] = useState(true)

  const displayImage = workingImage || originalImage
  const displayLabel = workingImage ? 'Working Image' : 'Original'

  return (
    <div className="flex h-full flex-col gap-2 p-3">
      <div className="flex flex-1 gap-2 min-h-0">
        {showOriginal && displayImage && (
          <CanvasViewer
            imageData={displayImage}
            label={displayLabel}
            collapsible
            onToggleCollapse={() => setShowOriginal(false)}
          />
        )}
        <CanvasViewer
          imageData={processedImage}
          label={processedImage ? 'Generated Biome Map' : 'No result yet'}
        />
      </div>

      {!showOriginal && originalImage && (
        <Button
          variant="outline"
          className="h-auto gap-1 border-dashed py-1.5 text-xs"
          onClick={() => setShowOriginal(true)}
        >
          <ChevronDown className="h-3 w-3" />
          Show image
        </Button>
      )}

      {showStats && <StatisticsPanel />}
    </div>
  )
}