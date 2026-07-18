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

    // Kumpulkan dulu ke array biasa (urutan prng() call PERSIS sama seperti sebelumnya)
    const tmpIslands: { cx: number; cy: number; biome: number; radius: number }[] = []
    for (let b = 0; b < biomes.length; b++) {
      if (biomes[b].weight <= 0) continue
      const count = Math.ceil(numIslandsPerBiome * weights[b] * biomes.length)
      for (let i = 0; i < count; i++) {
        tmpIslands.push({
          cx: Math.floor(prng() * width),
          cy: Math.floor(prng() * height),
          biome: b,
          radius: 20 + Math.floor(prng() * Math.min(width, height) * 0.1),
        })
      }
    }

    // Struct-of-arrays: lebih cepat diakses V8 dibanding array of objects
    const n = tmpIslands.length
    const iCx = new Float64Array(n)
    const iCy = new Float64Array(n)
    const iBiome = new Uint8Array(n)
    const iRadius = new Float64Array(n)
    const iRadiusSq = new Float64Array(n)
    const iInvRadius = new Float64Array(n)
    for (let i = 0; i < n; i++) {
      const isl = tmpIslands[i]
      iCx[i] = isl.cx
      iCy[i] = isl.cy
      iBiome[i] = isl.biome
      iRadius[i] = isl.radius
      iRadiusSq[i] = isl.radius * isl.radius
      iInvRadius[i] = 1 / isl.radius
    }

    for (let y = 0; y < height; y++) {
      const rowOffset = y * width
      for (let x = 0; x < width; x++) {
        let maxInfluence = 0
        let bestBiome = UNASSIGNED
        for (let i = 0; i < n; i++) {
          const dx = x - iCx[i]
          const dy = y - iCy[i]
          const distSq = dx * dx + dy * dy
          if (distSq >= iRadiusSq[i]) continue // skip sqrt kalau sudah pasti di luar radius
          const dist = Math.sqrt(distSq)
          const influence = 1 - dist * iInvRadius[i]
          if (influence > maxInfluence) {
            maxInfluence = influence
            bestBiome = iBiome[i]
          }
        }
        if (bestBiome !== UNASSIGNED) {
          data[rowOffset + x] = bestBiome
        }
      }
    }

    // Fill gaps dengan multi-source BFS, pakai head-pointer queue (bukan shift())
    const queue = new Int32Array(totalPixels)
    let qHead = 0
    let qTail = 0
    for (let i = 0; i < totalPixels; i++) {
      if (data[i] !== UNASSIGNED) queue[qTail++] = i
    }
    const dirs = [-width, width, -1, 1]
    while (qHead < qTail) {
      const idx = queue[qHead++]
      const x = idx % width
      const val = data[idx]
      for (const d of dirs) {
        const nIdx = idx + d
        if (nIdx < 0 || nIdx >= totalPixels) continue
        if (Math.abs((nIdx % width) - x) > 1) continue
        if (data[nIdx] === UNASSIGNED) {
          data[nIdx] = val
          queue[qTail++] = nIdx
        }
      }
    }

    return { width, height, seed, data }
  }
}