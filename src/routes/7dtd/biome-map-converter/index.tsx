import { createFileRoute } from '@tanstack/react-router'
import { UIProvider, useUIContext } from '@/context/ui-context'
import { PipelineProvider, usePipelineContext } from '@/context/pipeline-context'
import { EditorProvider } from '@/context/editor-context'
import { ImageUpload } from '@/components/biome-converter/ImageUpload'
import { SquareImageDialog } from '@/components/biome-converter/SquareImageDialog'
import { CropTool } from '@/components/biome-converter/CropTool'
import { PipelinePanel } from '@/components/biome-converter/PipelinePanel'
import { Toolbar } from '@/components/biome-converter/Toolbar'
import { PreviewPanels } from '@/components/biome-converter/PreviewPanels'
import { ExportDialog } from '@/components/biome-converter/ExportDialog'
import { ErrorBanner } from '@/components/biome-converter/ErrorBanner'
import { useClassification } from '@/hooks/use-classification'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, Download } from 'lucide-react'

export const Route = createFileRoute('/7dtd/biome-map-converter/')({
  component: BiomeMapConverterWrapper,
})

function BiomeMapConverterWrapper() {
  return (
    <PipelineProvider>
      <UIProvider>
        <EditorProvider>
          <BiomeMapConverter />
        </EditorProvider>
      </UIProvider>
    </PipelineProvider>
  )
}

function BiomeMapConverter() {
  const { uploadPhase, setUploadPhase, setShowExportDialog } = useUIContext()
  const { reset, clusterMapping, segmentationResult } = usePipelineContext()
  const { runClassification } = useClassification()

  useEffect(() => {
    if (segmentationResult && clusterMapping.size > 0) {
      runClassification()
    }
  }, [segmentationResult, clusterMapping, runClassification])

  if (uploadPhase === 'upload') {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-semibold tracking-tight">Biome Map Converter</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Upload an image to convert into a 7 Days to Die biomes.png map
            </p>
          </div>
          <ErrorBanner />
          <ImageUpload />
          <SquareImageDialog />
          <CropTool />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 min-h-0">
      <CropTool />
      <SquareImageDialog />
      <ExportDialog />

      <aside className="flex w-72 flex-shrink-0 flex-col border-r bg-card">
        <div className="flex items-center justify-between border-b px-4 py-2.5">
          <h2 className="text-sm font-semibold">Biome Map</h2>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 text-xs"
            onClick={() => {
              reset()
              setUploadPhase('upload')
            }}
          >
            <Upload className="h-3.5 w-3.5" />
            New
          </Button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-3">
          <ErrorBanner />
          <PipelinePanel />
        </div>

        <div className="border-t px-4 py-3">
          <Toolbar />
          <div className="mt-3">
            <Button
              className="w-full gap-2"
              onClick={() => setShowExportDialog(true)}
            >
              <Download className="h-4 w-4" data-icon="inline-start" />
              Export biomes.png
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col min-w-0">
        <PreviewPanels />
      </div>
    </div>
  )
}