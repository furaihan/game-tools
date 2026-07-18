import type { BiomeDef, BiomeMap, BiomeGenerator } from '@/features/biome-generator/types/biome-generator'
import { createPRNG } from './prng'
import { getNormalizedWeights, pickBiomeIndex } from './utils'

export class TerritoryExpansionGenerator implements BiomeGenerator {
  generate(width: number, height: number, seed: number, biomes: BiomeDef[]): BiomeMap {
    const data = new Uint8Array(width * height).fill(255)
    const prng = createPRNG(seed)
    const weights = getNormalizedWeights(biomes)

    const totalPixels = width * height
    const numSeeds = Math.max(biomes.length, 20)
    const frontier: number[] = []
    const assigned = new Uint8Array(totalPixels)

    for (let i = 0; i < numSeeds; i++) {
      const x = Math.floor(prng() * width)
      const y = Math.floor(prng() * height)
      const idx = y * width + x
      if (!assigned[idx]) {
        assigned[idx] = 1
        data[idx] = pickBiomeIndex(weights, prng())
        frontier.push(idx)
      }
    }

    const dirs = [-width, width, -1, 1]
    
    while (frontier.length > 0) {
      // 1. O(1) Random Pick: Ambil indeks acak tanpa shuffle seluruh array
      const randomIdx = Math.floor(prng() * frontier.length)
      const idx = frontier[randomIdx]
      
      // Swap dengan elemen terakhir, lalu pop untuk menghapus dalam O(1)
      frontier[randomIdx] = frontier[frontier.length - 1]
      frontier.pop()

      const biome = data[idx]
      const x = idx % width
      // const y dihapus karena tidak dipakai

      // 2. O(1) Loop: Hindari .map() dan .filter() untuk mengurangi beban Garbage Collection
      for (let i = 0; i < 4; i++) {
        const n = idx + dirs[i]
        
        // Cek batas atas dan bawah
        if (n < 0 || n >= totalPixels) continue
        
        // Cek batas kiri dan kanan (mencegah wrapping horizontal)
        const nx = n % width
        if (Math.abs(nx - x) > 1) continue
        
        // Lewati jika sudah di-assign
        if (assigned[n]) continue

        assigned[n] = 1
        data[n] = biome
        frontier.push(n)
      }
    }

    return { width, height, seed, data }
  }
}