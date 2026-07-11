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
  | "Layered Stamps"
  | "Probability Fields"
  | "Recursive Split"
  | "Weighted Expansion"
  | "Biome Islands"

export type GenerationMode = "Simple" | "Noise"

export type NoiseType = "Perlin" | "Simplex" | "Fractal" | "Worley"

export type BiomeMapping = "Threshold Bands" | "Multi-Layer Argmax"

export interface NoiseConfig {
  noiseType: NoiseType
  scale: number
  octaves: number
  persistence: number
  lacunarity: number
  biomeMapping: BiomeMapping
}
