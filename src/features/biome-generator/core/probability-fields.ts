import type { BiomeDef, BiomeMap, BiomeGenerator } from '@/features/biome-generator/types/biome-generator'
import { createPRNG } from './prng'
import { getNormalizedWeights, pickBiomeIndex, shuffleArray } from './utils'

export class ProbabilityFieldsGenerator implements BiomeGenerator {
  generate(width: number, height: number, seed: number, biomes: BiomeDef[]): BiomeMap {
    const data = new Uint8Array(width * height)
    const prng = createPRNG(seed)
    const weights = getNormalizedWeights(biomes)

    const field: Float64Array[] = biomes.map(() => new Float64Array(width * height))
    const scale = 0.5 + prng() * 0.5
    const numSeeds = 5 + Math.floor(prng() * 15)

    for (let b = 0; b < biomes.length; b++) {
      for (let s = 0; s < numSeeds; s++) {
        const sx = Math.floor(prng() * width)
        const sy = Math.floor(prng() * height)
        const strength = (b === 0 ? 0.5 : prng()) * weights[b] * 1.5

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const dx = x - sx
            const dy = y - sy
            const dist = Math.sqrt(dx * dx + dy * dy)
            const influence = Math.exp(-dist * scale / (width * 0.05))
            field[b][y * width + x] += influence * strength
          }
        }
      }
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x
        let maxVal = -Infinity
        let best = 0
        for (let b = 0; b < biomes.length; b++) {
          const val = field[b][idx]
          if (val > maxVal) {
            maxVal = val
            best = b
          }
        }
        data[idx] = best
      }
    }

    return { width, height, seed, data }
  }
}
