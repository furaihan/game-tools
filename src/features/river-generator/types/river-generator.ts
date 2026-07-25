import type { GenerationStatus } from '@/features/biome-generator/types/biome-generator'

export interface WaterMap {
  width: number
  height: number
  seed: number
  data: Uint8Array
}

export interface RiverGenParams {
  width: number
  height: number
  seed: number
  branchCount: number
  mainStemWidth: number
  branchWidth: number
  noiseScale: number
}

export type RiverGenStatus = GenerationStatus
