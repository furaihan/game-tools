import type { BiomeDef, BiomeMap, BiomeGenerator } from '@/types/biome-generator'
import { createPRNG } from './prng'
import { getNormalizedWeights, pickBiomeIndex } from './utils'

export class RandomBlobsGenerator implements BiomeGenerator {
  generate(width: number, height: number, seed: number, biomes: BiomeDef[]): BiomeMap {
    const data = new Uint8Array(width * height)
    const prng = createPRNG(seed)
    const weights = getNormalizedWeights(biomes)

    const numBlobs = Math.max(biomes.length, 30 + Math.floor(prng() * 40))
    for (let i = 0; i < numBlobs; i++) {
      const cx = Math.floor(prng() * width)
      const cy = Math.floor(prng() * height)
      const radius = 10 + Math.floor(prng() * Math.min(width, height) * 0.08)
      const biome = pickBiomeIndex(weights, prng())

      const r2 = radius * radius
      const xMin = Math.max(0, cx - radius)
      const xMax = Math.min(width - 1, cx + radius)
      const yMin = Math.max(0, cy - radius)
      const yMax = Math.min(height - 1, cy + radius)

      for (let y = yMin; y <= yMax; y++) {
        for (let x = xMin; x <= xMax; x++) {
          const dx = x - cx
          const dy = y - cy
          if (dx * dx + dy * dy <= r2) {
            data[y * width + x] = biome
          }
        }
      }
    }

    // Fill gaps with nearest blob
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (data[y * width + x] === 0) {
          let minDist = Infinity
          let best = 0
          for (let ty = 0; ty < height; ty++) {
            for (let tx = 0; tx < width; tx++) {
              if (data[ty * width + tx] !== 0) {
                const dx = tx - x
                const dy = ty - y
                const dist = dx * dx + dy * dy
                if (dist < minDist) {
                  minDist = dist
                  best = data[ty * width + tx]
                }
              }
            }
          }
          data[y * width + x] = best
        }
      }
    }

    return { width, height, seed, data }
  }
}
