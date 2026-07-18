import type { BiomeDef, BiomeMap, BiomeGenerator, GenerationStatus } from '@/features/biome-generator/types/biome-generator'
import { createPRNG } from './prng'
import { getNormalizedWeights, pickBiomeIndex } from './utils'

function distSq(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x1 - x2
  const dy = y1 - y2
  return dx * dx + dy * dy
}

export class RandomSeedsGenerator implements BiomeGenerator {
  generate(width: number, height: number, seed: number, biomes: BiomeDef[], onStatus?: (status: GenerationStatus) => void): BiomeMap {
    const prng = createPRNG(seed)
    const weights = getNormalizedWeights(biomes)

    onStatus?.({ phase: "Placing seeds", progress: 0 })

    const numSeeds = Math.max(biomes.length, Math.floor((width * height) / 500))
    const seedX = new Int32Array(numSeeds)
    const seedY = new Int32Array(numSeeds)
    const seedBiome = new Uint8Array(numSeeds)

    for (let i = 0; i < numSeeds; i++) {
      seedX[i] = Math.floor(prng() * width)
      seedY[i] = Math.floor(prng() * height)
      seedBiome[i] = pickBiomeIndex(weights, prng())
    }

    // nearestId[cell] = index seed terdekat yang diketahui sejauh ini, -1 = belum ada info
    let curr = new Int32Array(width * height).fill(-1)
    for (let i = 0; i < numSeeds; i++) {
      curr[seedY[i] * width + seedX[i]] = i
    }

    let next = new Int32Array(width * height)

    const maxDim = Math.max(width, height)
    let step = 1 << Math.ceil(Math.log2(maxDim))

    const totalSteps = Math.ceil(Math.log2(maxDim)) + 1
    let stepIdx = 0

    // JFA utama: step mengecil separuh tiap iterasi (512, 256, ..., 1)
    while (step >= 1) {
      stepIdx++
      onStatus?.({ phase: `Jump flood pass ${stepIdx}/${totalSteps}`, progress: 0.05 + (stepIdx / totalSteps) * 0.80 })

      next.set(curr)

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = y * width + x
          let bestId = curr[idx]
          let bestDist = bestId === -1 ? Infinity : distSq(x, y, seedX[bestId], seedY[bestId])

          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue
              const nx = x + dx * step
              const ny = y + dy * step
              if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue

              const nId = curr[ny * width + nx]
              if (nId === -1) continue

              const d = distSq(x, y, seedX[nId], seedY[nId])
              if (d < bestDist) {
                bestDist = d
                bestId = nId
              }
            }
          }

          next[idx] = bestId
        }
      }

      ;[curr, next] = [next, curr]
      step >>= 1
    }

    onStatus?.({ phase: "Cleanup pass", progress: 0.85 })

    // pass cleanup extra (JFA+1) buat ngerapiin edge case yang kadang miss di JFA murni
    next.set(curr)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x
        let bestId = curr[idx]
        let bestDist = bestId === -1 ? Infinity : distSq(x, y, seedX[bestId], seedY[bestId])

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue
            const nx = x + dx
            const ny = y + dy
            if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue

            const nId = curr[ny * width + nx]
            if (nId === -1) continue

            const d = distSq(x, y, seedX[nId], seedY[nId])
            if (d < bestDist) {
              bestDist = d
              bestId = nId
            }
          }
        }

        next[idx] = bestId
      }
    }
    curr = next

    onStatus?.({ phase: "Building output", progress: 0.95 })

    const data = new Uint8Array(width * height)
    for (let i = 0; i < width * height; i++) {
      const id = curr[i]
      data[i] = id === -1 ? 0 : seedBiome[id]
    }

    onStatus?.({ phase: "Done", progress: 1 })
    return { width, height, seed, data }
  }
}