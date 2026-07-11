import { useCallback, useRef } from 'react'
import { usePipelineContext } from '@/context/pipeline-context'
import { labelsToImageData } from '@/core/classification'
import type { ClassificationResult } from '@/types'

export function useClassification() {
  const workerRef = useRef<Worker | null>(null)
  const { 
    segmentationResult, 
    clusterMapping, 
    setClassificationResult, 
    setProcessedImage, 
    setError, 
    setIsProcessing 
  } = usePipelineContext()

  const runClassification = useCallback(async () => {
    if (!segmentationResult) return

    setIsProcessing(true)

    const worker = new Worker(
      new URL('../../src/workers/classification.worker.ts', import.meta.url),
      { type: 'module' },
    )
    workerRef.current = worker

    worker.onmessage = (e) => {
      const data = e.data
      if (data.type === 'result') {
        const result: ClassificationResult = data.payload
        setClassificationResult(result)
        const imageData = labelsToImageData(result.labels, result.width, result.height)
        setProcessedImage(imageData)
        setIsProcessing(false)
      } else if (data.type === 'error') {
        setError(data.message)
        setIsProcessing(false)
      }
    }

    worker.postMessage({
      labels: segmentationResult.labels,
      mapping: clusterMapping,
      width: segmentationResult.width,
      height: segmentationResult.height,
    })
  }, [segmentationResult, clusterMapping, setClassificationResult, setProcessedImage, setError, setIsProcessing])

  return { runClassification }
}
