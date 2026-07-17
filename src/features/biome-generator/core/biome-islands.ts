import type { BiomeDef, BiomeMap, BiomeGenerator } from '@/features/biome-generator/types/biome-generator'
import { createPRNG } from './prng'
import { getNormalizedWeights, pickBiomeIndex } from './utils'

export class BiomeIslandsGenerator implements BiomeGenerator {
  generate(width: number, height: number, seed: number, biomes: BiomeDef[]): BiomeMap {
    const totalPixels = width * height
    const UNASSIGNED = 255
    const data = new Uint8Array(totalPixels).fill(UNASSIGNED)
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
        let bestBiome = UNASSIGNED
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
        if (bestBiome !== UNASSIGNED) {
          data[y * width + x] = bestBiome
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
      const x = idx % width
      for (const d of dirs) {
        const n = idx + d
        if (n < 0 || n >= totalPixels) continue
        if (Math.abs((n % width) - x) > 1) continue
        if (data[n] === UNASSIGNED) {
          data[n] = data[idx]
          queue.push(n)
        }
      }
    }

    return { width, height, seed, data }
  }
}
