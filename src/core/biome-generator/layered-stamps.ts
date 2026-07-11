import type { BiomeDef, BiomeMap, BiomeGenerator } from '@/types/biome-generator'
import { createPRNG } from './prng'
import { getNormalizedWeights, pickBiomeIndex } from './utils'

export class LayeredStampsGenerator implements BiomeGenerator {
  generate(width: number, height: number, seed: number, biomes: BiomeDef[]): BiomeMap {
    const data = new Uint8Array(width * height)
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

    for (let i = 0; i < data.length; i++) {
      if (data[i] === 0) {
        let best = 0
        let closest = Infinity
        const x = i % width, y = Math.floor(i / width)
        for (let ty = 0; ty < height; ty++) {
          for (let tx = 0; tx < width; tx++) {
            const idx = ty * width + tx
            if (data[idx] !== 0) {
              const d = (tx - x) ** 2 + (ty - y) ** 2
              if (d < closest) { closest = d; best = data[idx] }
            }
          }
        }
        data[i] = best
      }
    }

    return { width, height, seed, data }
  }
}
