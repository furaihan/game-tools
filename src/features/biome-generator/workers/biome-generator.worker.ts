import type { AlgorithmName, BiomeDef } from '../types/biome-generator'
import { generators } from '../core/index'

self.onmessage = (e: MessageEvent<{
  width: number
  height: number
  seed: number
  biomes: BiomeDef[]
  algorithm: AlgorithmName
}>) => {
  const { width, height, seed, biomes, algorithm } = e.data

  try {
    const generator = generators[algorithm]
    if (!generator) {
      throw new Error(`Algorithm ${algorithm} not found`)
    }

    const start = performance.now()
    const result = generator.generate(width, height, seed, biomes)
    console.log(`Generation took ${performance.now() - start}ms`)

    self.postMessage({ type: 'success', data: result })
  } catch (err: any) {
    self.postMessage({ type: 'error', error: err.message })
  }
}
