export type Biome = 'forest' | 'burntForest' | 'desert' | 'snow' | 'wasteland'

export const BIOMES: Biome[] = ['forest', 'burntForest', 'desert', 'snow', 'wasteland']

export interface PaletteColor {
  biome: Biome
  rgb: [number, number, number]
  lab: [number, number, number]
  hex: string
}

export interface SegmentationParams {
  superpixelCount: number
  compactness: number
  randomSeed?: number
}

export interface CleanupParams {
  majorityRadius: number
  medianRadius: number
  morphOpen: number
  morphClose: number
}

export interface DitherParams {
  method: 'errorDiffusion' | 'ordered' | 'blueNoise'
}

export interface EditAction {
  bbox: [number, number, number, number]
  before: Uint8Array
  after: Uint8Array
}

export interface ClusterInfo {
  id: number
  centroidLAB: [number, number, number]
  centroidRGB: [number, number, number]
  pixelCount: number
  assignedBiome: Biome | null
}

export interface SegmentationResult {
  labels: Int32Array
  clusters: ClusterInfo[]
  width: number
  height: number
}

export interface ClassificationResult {
  labels: Uint8Array
  width: number
  height: number
}

export type WorkerProgress = { type: 'progress'; value: number }
export type WorkerResult<T> = { type: 'result'; payload: T }
export type WorkerError = { type: 'error'; message: string }
export type WorkerMessage<T> = WorkerProgress | WorkerResult<T> | WorkerError

export type EditorTool = 'brush' | 'fill' | 'rect' | 'eyedropper' | 'pan'

export type SquareChoice = 'crop' | 'pad' | 'stretch'
export type SquareAction = 'dialog' | 'crop' | null
