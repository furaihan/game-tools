import type { BiomeDef, BiomeMap, BiomeGenerator } from '@/features/biome-generator/types/biome-generator'
import { createPRNG } from './prng'
import { getNormalizedWeights, pickBiomeIndex } from './utils'

export class CellularGrowthGenerator implements BiomeGenerator {
  generate(width: number, height: number, seed: number, biomes: BiomeDef[]): BiomeMap {
    const data = new Uint8Array(width * height).fill(255) // 255 = unassigned
    const prng = createPRNG(seed)
    const weights = getNormalizedWeights(biomes)
    const totalPixels = width * height

    // 1. Scatter seed points, count proportional to biome weight
    const seedCount = Math.max(biomes.length * 3, Math.floor(totalPixels / 400))
    const frontier: number[] = []

    for (let i = 0; i < seedCount; i++) {
      const biomeIdx = pickBiomeIndex(weights, prng())
      const x = Math.floor(prng() * width)
      const y = Math.floor(prng() * height)
      const idx = y * width + x
      if (data[idx] === 255) {
        data[idx] = biomeIdx
        frontier.push(idx)
      }
    }

    // 2. Grow blobs outward (BFS-ish with randomized order = organic edges)
    while (frontier.length > 0) {
      // pop random element instead of shift, biar growth-nya gak berpola arah tetap
      const pickAt = Math.floor(prng() * frontier.length)
      const idx = frontier[pickAt]
      frontier[pickAt] = frontier[frontier.length - 1]
      frontier.pop()

      const x = idx % width
      const y = Math.floor(idx / width)
      const biomeIdx = data[idx]

      const neighbors = [
        [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1],
      ]

      for (const [nx, ny] of neighbors) {
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue
        const nIdx = ny * width + nx
        if (data[nIdx] !== 255) continue
        data[nIdx] = biomeIdx
        frontier.push(nIdx)
      }
    }

    // 3. Light smoothing pass buat rapiin edge (bukan generate dari scratch lagi)
    const smoothed = new Uint8Array(data)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const counts: number[] = new Array(biomes.length).fill(0)
        const yMin = Math.max(0, y - 1), yMax = Math.min(height - 1, y + 1)
        const xMin = Math.max(0, x - 1), xMax = Math.min(width - 1, x + 1)

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
        smoothed[y * width + x] = best
      }
    }

    return { width, height, seed, data: smoothed }
  }
}