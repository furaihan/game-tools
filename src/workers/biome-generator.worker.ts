import type { AlgorithmName, BiomeDef, BiomeMap, GenerationMode, NoiseConfig } from '../types/biome-generator'
import { generators } from '../core/biome-generator/index'
import { NoiseFieldGenerator } from '../core/biome-generator/noise-field'

self.onmessage = (e: MessageEvent<{
  width: number
  height: number
  seed: number
  biomes: BiomeDef[]
  mode: GenerationMode
  algorithm: AlgorithmName
  noiseConfig?: NoiseConfig
}>) => {
  const { width, height, seed, biomes, mode, algorithm, noiseConfig } = e.data

  try {
    console.log(`Generating biome map with ${mode} mode and ${algorithm} algorithm...`)
    let generator: { generate(w: number, h: number, s: number, b: BiomeDef[]): BiomeMap }

    if (mode === "Noise") {
      if (!noiseConfig) throw new Error("Noise config is required for Noise mode")
      generator = new NoiseFieldGenerator(noiseConfig)
    } else {
      generator = generators[algorithm]
      if (!generator) {
        throw new Error(`Algorithm ${algorithm} not found`)
      }
    }

    const start = performance.now()
    const result = generator.generate(width, height, seed, biomes)
    console.log(`Generation took ${performance.now() - start}ms`)

    self.postMessage({ type: 'success', data: result })
  } catch (err: any) {
    self.postMessage({ type: 'error', error: err.message })
  }
}
