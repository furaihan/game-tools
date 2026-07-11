import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type {
  SegmentationResult,
  ClassificationResult,
  SegmentationParams,
  CleanupParams,
  DitherParams,
  Biome,
} from '@/types'

interface PipelineState {
  originalImage: ImageData | null
  processedImage: ImageData | null
  workingImage: ImageData | null
  targetSize: number

  segmentationResult: SegmentationResult | null
  classificationResult: ClassificationResult | null
  clusterMapping: Map<number, Biome>
  editMask: Map<number, number>
  editedLabels: Uint8Array | null
  protectEdits: boolean

  params: {
    segmentation: SegmentationParams
    cleanup: CleanupParams
    dither: DitherParams
  }

  isProcessing: boolean
  progress: number
  progressMessage: string
  processingTime: number

  error: string | null

  setOriginalImage: (image: ImageData) => void
  setWorkingImage: (image: ImageData) => void
  setProcessedImage: (image: ImageData) => void
  setTargetSize: (size: number) => void

  setSegmentationResult: (result: SegmentationResult) => void
  setClassificationResult: (result: ClassificationResult) => void
  setClusterMapping: (mapping: Map<number, Biome>) => void
  updateClusterMapping: (clusterId: number, biome: Biome) => void
  setEditMask: (mask: Map<number, number>) => void
  setEditedLabels: (labels: Uint8Array) => void
  setProtectEdits: (protect: boolean) => void

  setSegmentationParams: (params: Partial<SegmentationParams>) => void
  setCleanupParams: (params: Partial<CleanupParams>) => void
  setDitherParams: (params: Partial<DitherParams>) => void

  setIsProcessing: (processing: boolean) => void
  setProgress: (progress: number, message?: string) => void
  setProcessingTime: (time: number) => void
  setError: (error: string | null) => void

  reset: () => void
}

const initialParams: {
  segmentation: SegmentationParams;
  cleanup: CleanupParams;
  dither: DitherParams;
} = {
  segmentation: { superpixelCount: 1000, compactness: 10 },
  cleanup: { majorityRadius: 1, medianRadius: 0, morphOpen: 0, morphClose: 0 },
  dither: { method: 'errorDiffusion' },
}

const PipelineContext = createContext<PipelineState | null>(null)

export function PipelineProvider({ children }: { children: ReactNode }) {
  const [originalImage, setOriginalImageState] = useState<ImageData | null>(null)
  const [processedImage, setProcessedImageState] = useState<ImageData | null>(null)
  const [workingImage, setWorkingImageState] = useState<ImageData | null>(null)
  const [targetSize, setTargetSizeState] = useState(4096)

  const [segmentationResult, setSegmentationResultState] = useState<SegmentationResult | null>(null)
  const [classificationResult, setClassificationResultState] = useState<ClassificationResult | null>(null)
  const [clusterMapping, setClusterMappingState] = useState<Map<number, Biome>>(new Map())
  const [editMask, setEditMaskState] = useState<Map<number, number>>(new Map())
  const [editedLabels, setEditedLabelsState] = useState<Uint8Array | null>(null)
  const [protectEdits, setProtectEditsState] = useState(true)

  const [params, setParams] = useState(initialParams)

  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgressState] = useState(0)
  const [progressMessage, setProgressMessage] = useState('')
  const [processingTime, setProcessingTime] = useState(0)

  const [error, setError] = useState<string | null>(null)

  const setOriginalImage = useCallback((image: ImageData) => {
    setOriginalImageState(image)
    setError(null)
  }, [])

  const setWorkingImage = useCallback((image: ImageData) => {
    setWorkingImageState(image)
  }, [])

  const setProcessedImage = useCallback((image: ImageData) => {
    setProcessedImageState(image)
  }, [])

  const setTargetSize = useCallback((size: number) => {
    setTargetSizeState(size)
  }, [])

  const setSegmentationResult = useCallback((result: SegmentationResult) => {
    setSegmentationResultState(result)
  }, [])

  const setClassificationResult = useCallback((result: ClassificationResult) => {
    setClassificationResultState(result)
  }, [])

  const setClusterMapping = useCallback((mapping: Map<number, Biome>) => {
    setClusterMappingState(mapping)
  }, [])

  const updateClusterMapping = useCallback((clusterId: number, biome: Biome) => {
    setClusterMappingState((prev) => {
      const mapping = new Map(prev)
      mapping.set(clusterId, biome)
      return mapping
    })
  }, [])

  const setEditMask = useCallback((mask: Map<number, number>) => {
    setEditMaskState(mask)
  }, [])

  const setEditedLabels = useCallback((labels: Uint8Array) => {
    setEditedLabelsState(labels)
  }, [])

  const setProtectEdits = useCallback((protect: boolean) => {
    setProtectEditsState(protect)
  }, [])

  const setSegmentationParams = useCallback((p: Partial<SegmentationParams>) => {
    setParams((prev) => ({
      ...prev,
      segmentation: { ...prev.segmentation, ...p },
    }))
  }, [])

  const setCleanupParams = useCallback((p: Partial<CleanupParams>) => {
    setParams((prev) => ({
      ...prev,
      cleanup: { ...prev.cleanup, ...p },
    }))
  }, [])

  const setDitherParams = useCallback((p: Partial<DitherParams>) => {
    setParams((prev) => ({
      ...prev,
      dither: { ...prev.dither, ...p },
    }))
  }, [])

  const setProgress = useCallback((p: number, message?: string) => {
    setProgressState(p)
    if (message !== undefined) setProgressMessage(message)
  }, [])

  const reset = useCallback(() => {
    setOriginalImageState(null)
    setProcessedImageState(null)
    setWorkingImageState(null)
    setSegmentationResultState(null)
    setClassificationResultState(null)
    setClusterMappingState(new Map())
    setEditMaskState(new Map())
    setEditedLabelsState(null)
    setIsProcessing(false)
    setProgressState(0)
    setProgressMessage('')
    setProcessingTime(0)
    setError(null)
    setParams({ ...initialParams })
  }, [])

  return (
    <PipelineContext.Provider
      value={{
        originalImage,
        processedImage,
        workingImage,
        targetSize,
        segmentationResult,
        classificationResult,
        clusterMapping,
        editMask,
        editedLabels,
        protectEdits,
        params,
        isProcessing,
        progress,
        progressMessage,
        processingTime,
        error,
        setOriginalImage,
        setWorkingImage,
        setProcessedImage,
        setTargetSize,
        setSegmentationResult,
        setClassificationResult,
        setClusterMapping,
        updateClusterMapping,
        setEditMask,
        setEditedLabels,
        setProtectEdits,
        setSegmentationParams,
        setCleanupParams,
        setDitherParams,
        setIsProcessing,
        setProgress,
        setProcessingTime,
        setError,
        reset,
      }}
    >
      {children}
    </PipelineContext.Provider>
  )
}

export function usePipelineContext() {
  const ctx = useContext(PipelineContext)
  if (!ctx) throw new Error('usePipelineContext must be used within a PipelineProvider')
  return ctx
}