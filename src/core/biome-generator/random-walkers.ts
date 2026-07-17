import type { BiomeDef, BiomeMap, BiomeGenerator } from '@/types/biome-generator'
import { createPRNG } from './prng'
import { getNormalizedWeights, pickBiomeIndex } from './utils'

export class RandomWalkersGenerator implements BiomeGenerator {
  generate(width: number, height: number, seed: number, biomes: BiomeDef[]): BiomeMap {
    const totalPixels = width * height
    const UNASSIGNED = 255
    const data = new Uint8Array(totalPixels).fill(UNASSIGNED)
    const prng = createPRNG(seed)
    const weights = getNormalizedWeights(biomes)

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

    // Fill unassigned via BFS
    const queue: number[] = []
    for (let i = 0; i < totalPixels; i++) {
      if (data[i] !== UNASSIGNED) queue.push(i)
    }
    const bfsDirs = [-width, width, -1, 1]
    while (queue.length > 0) {
      const idx = queue.shift()!
      const x = idx % width
      for (const d of bfsDirs) {
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
