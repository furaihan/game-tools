import { useCallback, useRef } from 'react'
import { usePipelineContext } from '@/context/pipeline-context'
import { downscaleImageData } from '@/lib/canvas'

export function useSegmentation() {
  const workerRef = useRef<Worker | null>(null)

  const { setSegmentationResult, setClusterMapping, setProgress, setIsProcessing, setError, setProcessingTime, params, workingImage, setWorkingImage } = usePipelineContext()

  const runSegmentation = useCallback(async () => {
    if (!workingImage) return

    setIsProcessing(true)
    setProgress(0, 'Preparing image...')

    const startTime = performance.now()
    const workingCopy = downscaleImageData(workingImage, 1024)
    setWorkingImage(workingCopy)

    const worker = new Worker(
      new URL('../../src/workers/segmentation.worker.ts', import.meta.url),
      { type: 'module' },
    )
    workerRef.current = worker

    worker.onmessage = (e) => {
      const data = e.data

      switch (data.type) {
        case 'progress':
          setProgress(data.value, 'Segmenting image...')
          break

        case 'result': {
          const result = data.payload
          setSegmentationResult(result)

          const mapping = new Map<number, typeof result.clusters[0]['assignedBiome']>()
          for (const cluster of result.clusters) {
            mapping.set(cluster.id, cluster.assignedBiome)
          }
          setClusterMapping(mapping as Map<number, any>)

          const elapsed = Math.round(performance.now() - startTime)
          setProcessingTime(elapsed)
          setProgress(100, 'Segmentation complete')
          setIsProcessing(false)
          break
        }

        case 'error':
          setError(data.message)
          setIsProcessing(false)
          break
      }
    }

    worker.onerror = (err) => {
      setError(err.message)
      setIsProcessing(false)
    }

    worker.postMessage(
      {
        imageData: workingCopy,
        params: params.segmentation,
      }
    )
  }, [workingImage, params.segmentation, setSegmentationResult, setClusterMapping, setProgress, setIsProcessing, setError, setProcessingTime, setWorkingImage])

  const cancel = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate()
      workerRef.current = null
    }
    setIsProcessing(false)
  }, [setIsProcessing])

  return { runSegmentation, cancel }
}
