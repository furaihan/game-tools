import type { BiomeDef, BiomeMap, BiomeGenerator } from '@/types/biome-generator'
import { createPRNG } from './prng'
import { getNormalizedWeights, pickBiomeIndex } from './utils'

export class WeightedExpansionGenerator implements BiomeGenerator {
  generate(width: number, height: number, seed: number, biomes: BiomeDef[]): BiomeMap {
    const data = new Uint8Array(width * height).fill(255)
    const prng = createPRNG(seed)
    const weights = getNormalizedWeights(biomes)
    const totalPixels = width * height

    const numSeeds = Math.max(biomes.length * 2, 30)
    const frontier: number[] = []

    for (let i = 0; i < numSeeds; i++) {
      const x = Math.floor(prng() * width)
      const y = Math.floor(prng() * height)
      const idx = y * width + x
      if (data[idx] === 255) {
        data[idx] = pickBiomeIndex(weights, prng())
        frontier.push(idx)
      }
    }

    const dirs = [-width, width, -1, 1]
    while (frontier.length > 0) {
      const idx = frontier.shift()!
      const x = idx % width
      const y = Math.floor(idx / width)

      const neighbors = dirs.map(d => idx + d).filter(n => {
        if (n < 0 || n >= totalPixels) return false
        const nx = n % width
        if (Math.abs(nx - x) > 1) return false
        return data[n] === 255
      })

      for (const n of neighbors) {
        data[n] = data[idx]
        if (prng() < 0.7) frontier.push(n)
      }
    }

    return { width, height, seed, data }
  }
}
