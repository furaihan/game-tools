import type { BiomeDef, BiomeMap, BiomeGenerator } from '@/types/biome-generator'
import { createPRNG } from './prng'
import { getNormalizedWeights, pickBiomeIndex } from './utils'

export class RandomWalkersGenerator implements BiomeGenerator {
  generate(width: number, height: number, seed: number, biomes: BiomeDef[]): BiomeMap {
    const data = new Uint8Array(width * height)
    const prng = createPRNG(seed)
    const weights = getNormalizedWeights(biomes)
    const totalPixels = width * height

    const numWalkers = Math.max(biomes.length, 50)
    const walkers: { x: number; y: number; biome: number; steps: number }[] = []

    for (let i = 0; i < numWalkers; i++) {
      walkers.push({
        x: Math.floor(prng() * width),
        y: Math.floor(prng() * height),
        biome: pickBiomeIndex(weights, prng()),
        steps: Math.floor(prng() * (width + height)) + 50,
      })
    }

    const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]]
    for (const w of walkers) {
      for (let s = 0; s < w.steps; s++) {
        const idx = w.y * width + w.x
        data[idx] = w.biome
        const dir = dirs[Math.floor(prng() * 4)]
        w.x = Math.max(0, Math.min(width - 1, w.x + dir[0]))
        w.y = Math.max(0, Math.min(height - 1, w.y + dir[1]))
      }
    }

    // Fill unassigned via nearest neighbor
    const unassigned: number[] = []
    for (let i = 0; i < totalPixels; i++) {
      if (data[i] === 0) unassigned.push(i)
    }
    for (const idx of unassigned) {
      const x = idx % width
      const y = Math.floor(idx / width)
      let minDist = Infinity
      let best = 0
      for (const w of walkers) {
        const dx = w.x - x
        const dy = w.y - y
        const dist = dx * dx + dy * dy
        if (dist < minDist) {
          minDist = dist
          best = w.biome
        }
      }
      data[idx] = best
    }

    return { width, height, seed, data }
  }
}
