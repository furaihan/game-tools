import type { BiomeDef, BiomeMap, BiomeGenerator } from '@/types/biome-generator'
import { createPRNG } from './prng'
import { getNormalizedWeights, pickBiomeIndex } from './utils'

export class LayeredStampsGenerator implements BiomeGenerator {
  generate(width: number, height: number, seed: number, biomes: BiomeDef[]): BiomeMap {
    const totalPixels = width * height
    const UNASSIGNED = 255
    const data = new Uint8Array(totalPixels).fill(UNASSIGNED)
    const prng = createPRNG(seed)
    const weights = getNormalizedWeights(biomes)

    const numStamps = 5 + Math.floor(prng() * 10)
    for (let layer = 0; layer < numStamps; layer++) {
      const biome = pickBiomeIndex(weights, prng())
      const stampWeights = Array.from({ length: 9 }, () => prng())
      const stamp: number[][] = []
      let totalW = 0
      for (let sy = 0; sy < 3; sy++) {
        stamp[sy] = []
        for (let sx = 0; sx < 3; sx++) {
          const w = stampWeights[sy * 3 + sx]
          stamp[sy][sx] = w
          totalW += w
        }
      }
      for (let sy = 0; sy < 3; sy++) {
        for (let sx = 0; sx < 3; sx++) {
          stamp[sy][sx] /= totalW
        }
      }

      const scale = 4 + Math.floor(prng() * 6)
      const sw = Math.floor(width / scale)
      const sh = Math.floor(height / scale)
      const grid: number[][] = Array.from({ length: sh }, () => new Array(sw).fill(0))
      for (let gy = 0; gy < sh; gy++) {
        for (let gx = 0; gx < sw; gx++) {
          let val = 0
          for (let sy = 0; sy < 3; sy++) {
            for (let sx = 0; sx < 3; sx++) {
              const py = gy + sy - 1
              const px = gx + sx - 1
              if (py >= 0 && py < sh && px >= 0 && px < sw) {
                val += grid[py][px] * stamp[sy][sx]
              }
            }
          }
          val += prng() * 0.3
          grid[gy][gx] = Math.min(1, val)
        }
      }

      const threshold = 1 - (layer + 1) / (numStamps + 1)
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const gx = Math.floor(x / scale)
          const gy = Math.floor(y / scale)
          if (grid[gy]?.[gx] !== undefined && grid[gy][gx] > threshold) {
            data[y * width + x] = biome
          }
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
