import { useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { usePipelineContext } from '@/context/pipeline-context'
import { useUIContext } from '@/context/ui-context'
import { Download, X } from 'lucide-react'

const TARGET_SIZES = [2048, 4096, 8192, 16384]

export function ExportDialog() {
  const { targetSize, setTargetSize, isProcessing, progress, setProgress, setIsProcessing, setError, editedLabels, classificationResult, workingImage } = usePipelineContext()
  const { showExportDialog, setShowExportDialog } = useUIContext()

  const workerRef = useRef<Worker | null>(null)
  const [exportedBlob, setExportedBlob] = useState<Blob | null>(null)

  const handleExport = () => {
    const labels = editedLabels || classificationResult?.labels
    const w = workingImage?.width || 0
    const h = workingImage?.height || 0

    if (!labels || !w || !h) {
      setError('No classified image to export')
      return
    }

    setIsProcessing(true)
    setProgress(0, 'Exporting...')
    setExportedBlob(null)

    const worker = new Worker(
      new URL('../../../src/workers/export.worker.ts', import.meta.url),
      { type: 'module' },
    )
    workerRef.current = worker

    worker.onmessage = (e) => {
      const data = e.data
      switch (data.type) {
        case 'progress':
          setProgress(data.value, 'Exporting...')
          break
        case 'result': {
          const blob = new Blob([data.payload], { type: 'image/png' })
          setExportedBlob(blob)
          setProgress(100, 'Export complete')
          setIsProcessing(false)
          break
        }
        case 'error':
          setError(data.message)
          setIsProcessing(false)
          break
      }
    }

    worker.postMessage({
      labels: labels.buffer,
      srcWidth: w,
      srcHeight: h,
      targetSize: targetSize,
    })
  }

  const handleDownload = () => {
    if (!exportedBlob) return
    const url = URL.createObjectURL(exportedBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'biomes.png'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCancel = () => {
    if (workerRef.current) {
      workerRef.current.terminate()
      workerRef.current = null
    }
    setIsProcessing(false)
    setProgress(0)
  }

  const estimatedSize = targetSize
    ? `${Math.round((targetSize * targetSize * 3) / (1024 * 1024))} MB`
    : ''

  return (
    <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Biome Map</DialogTitle>
          <DialogDescription>
            Choose the target resolution for your biomes.png file
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <label className="text-sm font-medium">Target Resolution</label>
          <div className="flex gap-2">
            {TARGET_SIZES.map((size) => (
              <Button
                key={size}
                variant={targetSize === size ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setTargetSize(size)}
              >
                {size}
              </Button>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Estimated output: {targetSize}&times;{targetSize} ({estimatedSize})
          </p>

          {isProcessing && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Exporting... {progress}%</span>
                <Button variant="ghost" size="sm" className="h-6 gap-1 text-xs" onClick={handleCancel}>
                  <X className="h-3 w-3" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {exportedBlob && (
            <div className="rounded-lg bg-primary/5 px-3 py-2 text-center text-sm text-primary">
              Export complete &mdash; {Math.round(exportedBlob.size / 1024)} KB
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowExportDialog(false)} disabled={isProcessing}>
            Close
          </Button>
          {exportedBlob ? (
            <Button onClick={handleDownload} className="gap-1.5">
              <Download className="h-4 w-4" />
              Download biomes.png
            </Button>
          ) : (
            <Button onClick={handleExport} disabled={isProcessing}>
              Export
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}