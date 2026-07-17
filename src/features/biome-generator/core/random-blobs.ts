import type { BiomeDef, BiomeMap, BiomeGenerator } from '@/features/biome-generator/types/biome-generator'
import { createPRNG } from './prng'
import { getNormalizedWeights, pickBiomeIndex } from './utils'

export class RandomBlobsGenerator implements BiomeGenerator {
  generate(width: number, height: number, seed: number, biomes: BiomeDef[]): BiomeMap {
    const totalPixels = width * height
    const UNASSIGNED = 255
    const data = new Uint8Array(totalPixels).fill(UNASSIGNED)
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

    // Fill gaps with multi-source BFS
    const queue: number[] = []
    for (let i = 0; i < totalPixels; i++) {
      if (data[i] !== UNASSIGNED) queue.push(i)
    }
    const dirs = [-width, width, -1, 1]
    while (queue.length > 0) {
      const idx = queue.shift()!
      const x = idx % width, y = Math.floor(idx / width)
      const biome = data[idx]
      for (const d of dirs) {
        const n = idx + d
        if (n < 0 || n >= totalPixels) continue
        if (Math.abs((n % width) - x) > 1) continue
        if (data[n] === UNASSIGNED) {
          data[n] = biome
          queue.push(n)
        }
      }
    }

    return { width, height, seed, data }
  }
}
