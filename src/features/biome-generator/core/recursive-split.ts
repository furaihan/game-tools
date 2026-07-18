import type { BiomeDef, BiomeMap, BiomeGenerator } from '@/features/biome-generator/types/biome-generator'
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
    const targetRegions = Math.max(6, Math.floor((width * height) / 1500))

    while (regions.length < targetRegions) {
      let largest = 0
      for (let i = 1; i < regions.length; i++) {
        if (regions[i].w * regions[i].h > regions[largest].w * regions[largest].h) {
          largest = i
        }
      }

      const r = regions[largest]
      const canSplitW = r.w > minSize * 2
      const canSplitH = r.h > minSize * 2

      if (!canSplitW && !canSplitH) break

      const splitAlongWidth = canSplitW && (!canSplitH || prng() > 0.5)

      if (splitAlongWidth) {
        const splitX = Math.floor(r.w * (0.35 + prng() * 0.3))
        regions.splice(largest, 1,
          { x: r.x, y: r.y, w: splitX, h: r.h },
          { x: r.x + splitX, y: r.y, w: r.w - splitX, h: r.h }
        )
      } else {
        const splitY = Math.floor(r.h * (0.35 + prng() * 0.3))
        regions.splice(largest, 1,
          { x: r.x, y: r.y, w: r.w, h: splitY },
          { x: r.x, y: r.y + splitY, w: r.w, h: r.h - splitY }
        )
      }
    }

    let lastBiome = -1

    for (const r of regions) {
      let biome = pickBiomeIndex(weights, prng())
      for (let i = 0; i < 3 && biome === lastBiome; i++) {
        biome = pickBiomeIndex(weights, prng())
      }
      lastBiome = biome

      for (let y = r.y; y < r.y + r.h && y < height; y++) {
        for (let x = r.x; x < r.x + r.w && x < width; x++) {
          data[y * width + x] = biome
        }
      }
    }

    return { width, height, seed, data }
  }
}
