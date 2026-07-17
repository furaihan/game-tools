import type { BiomeDef, BiomeMap, BiomeGenerator } from '@/features/biome-generator/types/biome-generator'
import { createPRNG } from './prng'
import { getNormalizedWeights, pickBiomeIndex } from './utils'

export class CellularGrowthGenerator implements BiomeGenerator {
  generate(width: number, height: number, seed: number, biomes: BiomeDef[]): BiomeMap {
    const data = new Uint8Array(width * height)
    const prng = createPRNG(seed)
    const weights = getNormalizedWeights(biomes)
    const totalPixels = width * height

    // Initialize random noise
    for (let i = 0; i < totalPixels; i++) {
      data[i] = pickBiomeIndex(weights, prng())
    }

    const iterations = 5
    const next = new Uint8Array(width * height)

    for (let iter = 0; iter < iterations; iter++) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const counts: number[] = new Array(biomes.length).fill(0)
          const yMin = Math.max(0, y - 1)
          const yMax = Math.min(height - 1, y + 1)
          const xMin = Math.max(0, x - 1)
          const xMax = Math.min(width - 1, x + 1)

          for (let ny = yMin; ny <= yMax; ny++) {
            for (let nx = xMin; nx <= xMax; nx++) {
              counts[data[ny * width + nx]]++
            }
          }

          let maxCount = 0
          let best = data[y * width + x]
          for (let i = 0; i < counts.length; i++) {
            if (counts[i] > maxCount) {
              maxCount = counts[i]
              best = i
            }
          }
          next[y * width + x] = best
        }
      }
      for (let i = 0; i < totalPixels; i++) {
        data[i] = next[i]
      }
    }

    return { width, height, seed, data }
  }
}
