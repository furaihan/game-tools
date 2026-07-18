import type { BiomeDef, BiomeMap, BiomeGenerator, GenerationStatus } from '@/features/biome-generator/types/biome-generator'
import { createPRNG } from './prng'
import { getNormalizedWeights, pickBiomeIndex, shuffleArray } from './utils'

export class ProbabilityFieldsGenerator implements BiomeGenerator {
  generate(width: number, height: number, seed: number, biomes: BiomeDef[], onStatus?: (status: GenerationStatus) => void): BiomeMap {
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

    onStatus?.({ phase: "Precomputing decay table", progress: 0 })

    // 1. PRECOMPUTE EXPONENTIAL DECAY TABLE
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
    onStatus?.({ phase: "Building influence fields", progress: 0.05 })
    for (let b = 0; b < numBiomes; b++) {
      onStatus?.({ phase: `Building field ${b + 1}/${numBiomes}`, progress: 0.05 + ((b + 1) / numBiomes) * 0.75 })
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
          
          for (let dx = 1; dx <= sx; dx++) {
            currentField[centerFieldIdx - dx] += expTable[expRowOffset + dx] * strength
          }

          for (let dx = 0; dx < width - sx; dx++) {
            currentField[centerFieldIdx + dx] += expTable[expRowOffset + dx] * strength
          }
        }
      }
    }

    // 3. OPTIMIZED MAX TRACKING (CACHE-FRIENDLY)
    onStatus?.({ phase: "Resolving biomes", progress: 0.80 })
    const maxVals = new Float64Array(width * height).fill(-Infinity)
    for (let b = 0; b < numBiomes; b++) {
      const currentField = field[b]
      for (let idx = 0; idx < width * height; idx++) {
        const val = currentField[idx]
        if (val > maxVals[idx]) {
          maxVals[idx] = val
          data[idx] = b
        }
      }
    }

    onStatus?.({ phase: "Done", progress: 1 })
    return { width, height, seed, data }
  }
}