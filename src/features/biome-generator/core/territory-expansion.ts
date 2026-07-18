import type { BiomeDef, BiomeMap, BiomeGenerator, GenerationStatus } from '@/features/biome-generator/types/biome-generator'
import { createPRNG } from './prng'
import { getNormalizedWeights, pickBiomeIndex } from './utils'

export class TerritoryExpansionGenerator implements BiomeGenerator {
  generate(width: number, height: number, seed: number, biomes: BiomeDef[], onStatus?: (status: GenerationStatus) => void): BiomeMap {
    const data = new Uint8Array(width * height).fill(255)
    const prng = createPRNG(seed)
    const weights = getNormalizedWeights(biomes)

    const totalPixels = width * height
    const numSeeds = Math.max(biomes.length, 20)
    const frontier: number[] = []
    const assigned = new Uint8Array(totalPixels)

    onStatus?.({ phase: "Placing seeds", progress: 0 })

    for (let i = 0; i < numSeeds; i++) {
      const x = Math.floor(prng() * width)
      const y = Math.floor(prng() * height)
      const idx = y * width + x
      if (!assigned[idx]) {
        assigned[idx] = 1
        data[idx] = pickBiomeIndex(weights, prng())
        frontier.push(idx)
      }
    }

    const dirs = [-width, width, -1, 1]
    let assignedCount = frontier.length
    const reportInterval = Math.max(1000, Math.floor(totalPixels / 100))

    onStatus?.({ phase: "Expanding territories", progress: 0.05 })

    while (frontier.length > 0) {
      const randomIdx = Math.floor(prng() * frontier.length)
      const idx = frontier[randomIdx]

      frontier[randomIdx] = frontier[frontier.length - 1]
      frontier.pop()

      const biome = data[idx]
      const x = idx % width

      for (let i = 0; i < 4; i++) {
        const n = idx + dirs[i]

        if (n < 0 || n >= totalPixels) continue

        const nx = n % width
        if (Math.abs(nx - x) > 1) continue

        if (assigned[n]) continue

        assigned[n] = 1
        data[n] = biome
        frontier.push(n)
      }

      assignedCount++
      if (assignedCount % reportInterval === 0) {
        onStatus?.({ phase: "Expanding territories", progress: 0.05 + (assignedCount / totalPixels) * 0.95 })
      }
    }

    onStatus?.({ phase: "Done", progress: 1 })
    return { width, height, seed, data }
  }
}