import type { BiomeDef, BiomeMap, BiomeGenerator } from '@/types/biome-generator'
import { createPRNG } from './prng'
import { getNormalizedWeights, pickBiomeIndex, shuffleArray } from './utils'

export class TerritoryExpansionGenerator implements BiomeGenerator {
  generate(width: number, height: number, seed: number, biomes: BiomeDef[]): BiomeMap {
    const data = new Uint8Array(width * height).fill(255)
    const prng = createPRNG(seed)
    const weights = getNormalizedWeights(biomes)

    const totalPixels = width * height
    const numSeeds = Math.max(biomes.length, 20)
    const frontier: number[] = []
    const assigned = new Uint8Array(totalPixels)

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
    while (frontier.length > 0) {
      shuffleArray(frontier, prng)
      const idx = frontier.pop()!
      const biome = data[idx]
      const x = idx % width
      const y = Math.floor(idx / width)

      const neighbors = dirs.map(d => idx + d).filter(n => {
        if (n < 0 || n >= totalPixels) return false
        const nx = n % width
        if (Math.abs(nx - x) > 1) return false
        return !assigned[n]
      })

      for (const n of neighbors) {
        assigned[n] = 1
        data[n] = biome
        frontier.push(n)
      }
    }

    return { width, height, seed, data }
  }
}
