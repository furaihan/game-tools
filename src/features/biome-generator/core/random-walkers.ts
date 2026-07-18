import type { BiomeDef, BiomeMap, BiomeGenerator, GenerationStatus } from '@/features/biome-generator/types/biome-generator'
import { createPRNG } from './prng'
import { getNormalizedWeights, pickBiomeIndex } from './utils'

export class RandomWalkersGenerator implements BiomeGenerator {
  generate(width: number, height: number, seed: number, biomes: BiomeDef[], onStatus?: (status: GenerationStatus) => void): BiomeMap {
    const totalPixels = width * height
    const UNASSIGNED = 255
    const data = new Uint8Array(totalPixels).fill(UNASSIGNED)
    const prng = createPRNG(seed)
    const weights = getNormalizedWeights(biomes)

    onStatus?.({ phase: "Spawning walkers", progress: 0 })

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
    for (let wi = 0; wi < walkers.length; wi++) {
      onStatus?.({ phase: `Walking (${wi + 1}/${walkers.length})`, progress: 0.05 + (wi / walkers.length) * 0.55 })
      const w = walkers[wi]
      for (let s = 0; s < w.steps; s++) {
        const idx = w.y * width + w.x
        data[idx] = w.biome
        const dir = dirs[Math.floor(prng() * 4)]
        w.x = Math.max(0, Math.min(width - 1, w.x + dir[0]))
        w.y = Math.max(0, Math.min(height - 1, w.y + dir[1]))
      }
    }

    onStatus?.({ phase: "Filling gaps", progress: 0.60 })

    // Fill unassigned via BFS
    const queue: number[] = []
    for (let i = 0; i < totalPixels; i++) {
      if (data[i] !== UNASSIGNED) queue.push(i)
    }
    const bfsDirs = [-width, width, -1, 1]
    const totalUnassigned = totalPixels - queue.length
    let filled = 0
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
          filled++
          if (filled % 1000 === 0) {
            onStatus?.({ phase: "Filling gaps", progress: 0.60 + (filled / totalUnassigned) * 0.40 })
          }
        }
      }
    }

    onStatus?.({ phase: "Done", progress: 1 })
    return { width, height, seed, data }
  }
}
