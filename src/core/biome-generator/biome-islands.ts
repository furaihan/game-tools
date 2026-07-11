import type { BiomeDef, BiomeMap, BiomeGenerator } from '@/types/biome-generator'
import { createPRNG } from './prng'
import { getNormalizedWeights, pickBiomeIndex } from './utils'

export class BiomeIslandsGenerator implements BiomeGenerator {
  generate(width: number, height: number, seed: number, biomes: BiomeDef[]): BiomeMap {
    const data = new Uint8Array(width * height)
    const prng = createPRNG(seed)
    const weights = getNormalizedWeights(biomes)

    const numIslandsPerBiome = Math.max(1, Math.floor(prng() * 5) + 2)
    const islands: { cx: number; cy: number; biome: number; radius: number }[] = []

    for (let b = 0; b < biomes.length; b++) {
      if (biomes[b].weight <= 0) continue
      const count = Math.ceil(numIslandsPerBiome * weights[b] * biomes.length)
      for (let i = 0; i < count; i++) {
        islands.push({
          cx: Math.floor(prng() * width),
          cy: Math.floor(prng() * height),
          biome: b,
          radius: 20 + Math.floor(prng() * Math.min(width, height) * 0.1),
        })
      }
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let maxInfluence = 0
        let bestBiome = 0
        for (const island of islands) {
          const dx = x - island.cx
          const dy = y - island.cy
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < island.radius) {
            const influence = 1 - dist / island.radius
            if (influence > maxInfluence) {
              maxInfluence = influence
              bestBiome = island.biome
            }
          }
        }
        data[y * width + x] = bestBiome
      }
    }

    return { width, height, seed, data }
  }
}
