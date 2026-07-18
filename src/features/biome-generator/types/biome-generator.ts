export interface BiomeDef {
  id: string
  name: string
  color: string
  weight: number
}

export interface BiomeMap {
  width: number
  height: number
  seed: number
  data: Uint8Array
}

export interface BiomeGenerator {
  generate(width: number, height: number, seed: number, biomes: BiomeDef[]): BiomeMap
}

export type AlgorithmName =
  | "Random Seeds"
  | "Territory Expansion"
  | "Random Walkers"
  | "Random Blobs"
  | "Cellular Growth"
  | "Probability Fields"
  | "Recursive Split"
  | "Weighted Expansion"
  | "Biome Islands"


