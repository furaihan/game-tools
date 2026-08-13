import type {
  BiomeDef,
  BiomeMap,
  BiomeGenerator,
  GenerationStatus,
} from '@/features/biome-generator/types/biome-generator'
import { createPRNG } from '@/shared/utils/prng'
import { createValueNoise2D, fbm2D } from '@/shared/utils/noise'
import { getNormalizedWeights, pickBiomeIndex } from './utils'

interface Centroid {
  elevation: number
  moisture: number
  biomeIdx: number
}

// Climate Clustering
//
// Unlike the growth-based algorithms (which spread from points in x/y space),
// this works in "climate space": every pixel gets an elevation + moisture value
// from the noise fields, then the field is clustered with mini-batch k-means.
// The same biome can appear in several separate areas whenever the climate is
// similar — like biome maps in Minecraft/Dwarf Fortress.
//
// Why it's light:
// - K-means runs on a sampled subset (mini-batch), not every pixel
// - Iterations only touch the samples; full resolution is used for one
//   assignment pass
// - End cost is comparable to (or lighter than) Probability Fields
export class ClimateClusterGenerator implements BiomeGenerator {
  generate(
    width: number,
    height: number,
    seed: number,
    biomes: BiomeDef[],
    onStatus?: (status: GenerationStatus) => void,
  ): BiomeMap {
    const data = new Uint8Array(width * height)
    const prng = createPRNG(seed)
    const weights = getNormalizedWeights(biomes)
    const totalPixels = width * height

    onStatus?.({ phase: 'Generating climate fields', progress: 0 })

    // 1. Elevation & moisture noise fields (fbm, 3 octaves)
    const elevationNoise = createValueNoise2D(seed)
    const moistureNoise = createValueNoise2D((seed ^ 0x5bd1e995) >>> 0)
    const scale = 3 + prng() * 3

    const elevation = new Float32Array(totalPixels)
    const moisture = new Float32Array(totalPixels)

    for (let y = 0; y < height; y++) {
      const ny = (y / height) * scale
      const rowOffset = y * width
      for (let x = 0; x < width; x++) {
        const nx = (x / width) * scale
        const idx = rowOffset + x
        elevation[idx] = fbm2D(elevationNoise, nx, ny, 3) * 0.5 + 0.5
        moisture[idx] = fbm2D(moistureNoise, nx, ny, 3) * 0.5 + 0.5
      }
    }

    onStatus?.({ phase: 'Seeding climate centroids', progress: 0.2 })

    // 2. Multiple centroids per biome (proportional to weight), positioned in
    // climate space (elevation, moisture) instead of pixel space
    const centroidCount = Math.max(biomes.length * 3, 12)
    const centroids: Centroid[] = []
    for (let i = 0; i < centroidCount; i++) {
      centroids.push({
        elevation: prng(),
        moisture: prng(),
        biomeIdx: pickBiomeIndex(weights, prng()),
      })
    }

    // 3. Mini-batch k-means: refine centroids on a sampled subset only
    onStatus?.({ phase: 'Clustering climate space', progress: 0.3 })
    const sampleTarget = Math.min(6000, totalPixels)
    const stride = Math.max(1, Math.floor(totalPixels / sampleTarget))
    const samples: number[] = []
    for (let i = 0; i < totalPixels; i += stride) samples.push(i)

    const iterations = 8
    for (let iter = 0; iter < iterations; iter++) {
      const sumE = new Float64Array(centroidCount)
      const sumM = new Float64Array(centroidCount)
      const count = new Float64Array(centroidCount)

      for (const idx of samples) {
        const e = elevation[idx]
        const m = moisture[idx]
        let best = 0
        let bestDist = Infinity
        for (let c = 0; c < centroidCount; c++) {
          const de = e - centroids[c].elevation
          const dm = m - centroids[c].moisture
          const dist = de * de + dm * dm
          if (dist < bestDist) {
            bestDist = dist
            best = c
          }
        }
        sumE[best] += e
        sumM[best] += m
        count[best]++
      }

      for (let c = 0; c < centroidCount; c++) {
        if (count[c] > 0) {
          centroids[c].elevation = sumE[c] / count[c]
          centroids[c].moisture = sumM[c] / count[c]
        }
      }

      onStatus?.({
        phase: `Clustering climate space (${iter + 1}/${iterations})`,
        progress: 0.3 + ((iter + 1) / iterations) * 0.4,
      })
    }

    // 4. Final pass: assign every pixel to its nearest centroid (single full-res)
    onStatus?.({ phase: 'Assigning biomes', progress: 0.75 })
    const reportInterval = Math.max(1000, Math.floor(totalPixels / 100))
    for (let idx = 0; idx < totalPixels; idx++) {
      const e = elevation[idx]
      const m = moisture[idx]
      let best = 0
      let bestDist = Infinity
      for (let c = 0; c < centroidCount; c++) {
        const de = e - centroids[c].elevation
        const dm = m - centroids[c].moisture
        const dist = de * de + dm * dm
        if (dist < bestDist) {
          bestDist = dist
          best = c
        }
      }
      data[idx] = centroids[best].biomeIdx

      if (idx % reportInterval === 0) {
        onStatus?.({
          phase: 'Assigning biomes',
          progress: 0.75 + (idx / totalPixels) * 0.25,
        })
      }
    }

    onStatus?.({ phase: 'Done', progress: 1 })
    return { width, height, seed, data }
  }
}