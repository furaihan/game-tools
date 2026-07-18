import type { BiomeDef, BiomeMap, BiomeGenerator } from '@/features/biome-generator/types/biome-generator'
import { createPRNG } from './prng'
import { getNormalizedWeights, pickBiomeIndex, shuffleArray } from './utils'

export class ProbabilityFieldsGenerator implements BiomeGenerator {
  generate(width: number, height: number, seed: number, biomes: BiomeDef[]): BiomeMap {
    const data = new Uint8Array(width * height)
    const prng = createPRNG(seed)
    const weights = getNormalizedWeights(biomes)

    const numBiomes = biomes.length
    const field: Float64Array[] = new Array(numBiomes)
    for (let b = 0; b < numBiomes; b++) {
      field[b] = new Float64Array(width * height)
    }
    
    const scale = 0.5 + prng() * 0.5
    const numSeeds = 5 + Math.floor(prng() * 15)

    // 1. PRECOMPUTE EXPONENTIAL DECAY TABLE
    // Menghindari pemanggilan Math.sqrt dan Math.exp di dalam inner loop yang berjalan jutaan kali.
    const decay = scale / (width * 0.05)
    const W1 = width + 1
    const expTable = new Float64Array(W1 * (height + 1))
    for (let dy = 0; dy <= height; dy++) {
      const dySq = dy * dy
      const rowOffset = dy * W1
      for (let dx = 0; dx <= width; dx++) {
        expTable[rowOffset + dx] = Math.exp(-Math.sqrt(dx * dx + dySq) * decay)
      }
    }

    // 2. MAIN FIELD GENERATION
    for (let b = 0; b < numBiomes; b++) {
      const currentField = field[b]
      for (let s = 0; s < numSeeds; s++) {
        const sx = Math.floor(prng() * width)
        const sy = Math.floor(prng() * height)
        const strength = (b === 0 ? 0.5 : prng()) * weights[b] * 1.5

        for (let y = 0; y < height; y++) {
          const dy = y >= sy ? y - sy : sy - y
          const rowOffset = y * width
          const expRowOffset = dy * W1
          const centerFieldIdx = rowOffset + sx
          
          // Loop Kiri (x < sx): Menghindari Math.abs() agar CPU branch prediction optimal
          for (let dx = 1; dx <= sx; dx++) {
            currentField[centerFieldIdx - dx] += expTable[expRowOffset + dx] * strength
          }

          // Loop Kanan (x >= sx)
          for (let dx = 0; dx < width - sx; dx++) {
            currentField[centerFieldIdx + dx] += expTable[expRowOffset + dx] * strength
          }
        }
      }
    }

    // 3. OPTIMIZED MAX TRACKING (CACHE-FRIENDLY)
    // Membaca memori secara sekuensial (berurutan) untuk menghindari CPU Cache Miss.
    const maxVals = new Float64Array(width * height).fill(-Infinity)
    for (let b = 0; b < numBiomes; b++) {
      const currentField = field[b]
      for (let idx = 0; idx < width * height; idx++) {
        const val = currentField[idx]
        // Menggunakan operator > agar tie-breaking (jika nilai sama) sama persis dengan kode asli
        if (val > maxVals[idx]) {
          maxVals[idx] = val
          data[idx] = b
        }
      }
    }

    return { width, height, seed, data }
  }
}