import type { BiomeDef, BiomeMap, BiomeGenerator } from '@/types/biome-generator'
import { createPRNG } from './prng'
import { getNormalizedWeights, pickBiomeIndex } from './utils'

export class RandomSeedsGenerator implements BiomeGenerator {
  generate(width: number, height: number, seed: number, biomes: BiomeDef[]): BiomeMap {
    const data = new Uint8Array(width * height)
    const prng = createPRNG(seed)
    const weights = getNormalizedWeights(biomes)

    const seeds: { x: number; y: number; biome: number }[] = []
    const numSeeds = Math.max(biomes.length, Math.floor(width * height / 500))
    for (let i = 0; i < numSeeds; i++) {
      seeds.push({
        x: Math.floor(prng() * width),
        y: Math.floor(prng() * height),
        biome: pickBiomeIndex(weights, prng()),
      })
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let minDist = Infinity
        let bestBiome = 0
        for (const s of seeds) {
          const dx = s.x - x
          const dy = s.y - y
          const dist = dx * dx + dy * dy
          if (dist < minDist) {
            minDist = dist
            bestBiome = s.biome
          }
        }
        data[y * width + x] = bestBiome
      }
    }

    return { width, height, seed, data }
  }
}
