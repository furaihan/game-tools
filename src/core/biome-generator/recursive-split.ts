import type { BiomeDef, BiomeMap, BiomeGenerator } from '@/types/biome-generator'
import { createPRNG } from './prng'
import { getNormalizedWeights, pickBiomeIndex } from './utils'

interface Region {
  x: number
  y: number
  w: number
  h: number
}

export class RecursiveSplitGenerator implements BiomeGenerator {
  generate(width: number, height: number, seed: number, biomes: BiomeDef[]): BiomeMap {
    const data = new Uint8Array(width * height)
    const prng = createPRNG(seed)
    const weights = getNormalizedWeights(biomes)

    const regions: Region[] = [{ x: 0, y: 0, w: width, h: height }]
    const minSize = Math.max(8, Math.min(width, height) * 0.05)

    for (let i = 0; i < regions.length; i++) {
      const r = regions[i]
      if (r.w > minSize * 2 && r.h > minSize * 2 && prng() > 0.3) {
        const splitH = prng() > 0.5
        if (splitH && r.w > minSize * 2) {
          const splitX = Math.floor(r.w * (0.3 + prng() * 0.4))
          regions.push({ x: r.x, y: r.y, w: splitX, h: r.h })
          regions.push({ x: r.x + splitX, y: r.y, w: r.w - splitX, h: r.h })
        } else if (r.h > minSize * 2) {
          const splitY = Math.floor(r.h * (0.3 + prng() * 0.4))
          regions.push({ x: r.x, y: r.y, w: r.w, h: splitY })
          regions.push({ x: r.x, y: r.y + splitY, w: r.w, h: r.h - splitY })
        }
        regions.splice(i, 1)
        i--
      }
    }

    for (const r of regions) {
      const biome = pickBiomeIndex(weights, prng())
      for (let y = r.y; y < r.y + r.h && y < height; y++) {
        for (let x = r.x; x < r.x + r.w && x < width; x++) {
          data[y * width + x] = biome
        }
      }
    }

    return { width, height, seed, data }
  }
}
