import type { BiomeDef, BiomeMap, BiomeGenerator, GenerationStatus } from '@/features/biome-generator/types/biome-generator'
import { createPRNG } from './prng'
import { getNormalizedWeights, pickBiomeIndex } from './utils'

export class RandomBlobsGenerator implements BiomeGenerator {
  generate(width: number, height: number, seed: number, biomes: BiomeDef[], onStatus?: (status: GenerationStatus) => void): BiomeMap {
    const totalPixels = width * height
    const UNASSIGNED = 255
    const data = new Uint8Array(totalPixels).fill(UNASSIGNED)
    const prng = createPRNG(seed)
    const weights = getNormalizedWeights(biomes)

    onStatus?.({ phase: "Generating blobs", progress: 0 })

    const numBlobs = Math.max(biomes.length, 30 + Math.floor(prng() * 40))
    for (let i = 0; i < numBlobs; i++) {
      onStatus?.({ phase: `Generating blob ${i + 1}/${numBlobs}`, progress: (i / numBlobs) * 0.55 })
      const cx = Math.floor(prng() * width)
      const cy = Math.floor(prng() * height)
      const radius = 10 + Math.floor(prng() * Math.min(width, height) * 0.08)
      const biome = pickBiomeIndex(weights, prng())

      const r2 = radius * radius
      
      // OPTIMIZATION 1: Exact circle rasterization
      // Instead of iterating over a square bounding box and checking distance 
      // for every pixel, we calculate the exact horizontal span for each row.
      const dyStart = Math.max(-radius, -cy)
      const dyEnd = Math.min(radius, height - 1 - cy)
      
      for (let dy = dyStart; dy <= dyEnd; dy++) {
        const y = cy + dy
        const dxMax = Math.floor(Math.sqrt(r2 - dy * dy))
        const xStart = Math.max(0, cx - dxMax)
        const xEnd = Math.min(width - 1, cx + dxMax)
        
        // OPTIMIZATION 2: Incremental index
        // Avoids recalculating `y * width + x` on every iteration
        let idx = y * width + xStart
        for (let x = xStart; x <= xEnd; x++) {
          data[idx++] = biome
        }
      }
    }

    onStatus?.({ phase: "Filling gaps", progress: 0.55 })

    // OPTIMIZATION 3: Pre-allocated TypedArray Queue
    // Array.shift() is O(N). Using a pre-allocated TypedArray with head/tail pointers 
    // turns queue operations into O(1) and prevents garbage collection overhead.
    const queue = new Uint32Array(totalPixels)
    let head = 0
    let tail = 0
    
    for (let i = 0; i < totalPixels; i++) {
      if (data[i] !== UNASSIGNED) queue[tail++] = i
    }
    
    const totalUnassigned = totalPixels - tail
    let filled = 0

    while (head < tail) {
      const idx = queue[head++]
      const biome = data[idx]
      const x = idx % width

      // OPTIMIZATION 4: Unrolled bounds checking
      // Replaces the loop over `dirs` and avoids Math.abs / modulo operations for wrap-around checks.
      
      // Left
      if (x > 0) {
        const n = idx - 1
        if (data[n] === UNASSIGNED) {
          data[n] = biome
          queue[tail++] = n
          filled++
          if (filled % 1000 === 0 && totalUnassigned > 0) {
            onStatus?.({ phase: "Filling gaps", progress: 0.55 + (filled / totalUnassigned) * 0.45 })
          }
        }
      }
      
      // Right
      if (x < width - 1) {
        const n = idx + 1
        if (data[n] === UNASSIGNED) {
          data[n] = biome
          queue[tail++] = n
          filled++
          if (filled % 1000 === 0 && totalUnassigned > 0) {
            onStatus?.({ phase: "Filling gaps", progress: 0.55 + (filled / totalUnassigned) * 0.45 })
          }
        }
      }

      // Top
      if (idx >= width) {
        const n = idx - width
        if (data[n] === UNASSIGNED) {
          data[n] = biome
          queue[tail++] = n
          filled++
          if (filled % 1000 === 0 && totalUnassigned > 0) {
            onStatus?.({ phase: "Filling gaps", progress: 0.55 + (filled / totalUnassigned) * 0.45 })
          }
        }
      }

      // Bottom
      if (idx < totalPixels - width) {
        const n = idx + width
        if (data[n] === UNASSIGNED) {
          data[n] = biome
          queue[tail++] = n
          filled++
          if (filled % 1000 === 0 && totalUnassigned > 0) {
            onStatus?.({ phase: "Filling gaps", progress: 0.55 + (filled / totalUnassigned) * 0.45 })
          }
        }
      }
    }

    onStatus?.({ phase: "Done", progress: 1 })
    return { width, height, seed, data }
  }
}