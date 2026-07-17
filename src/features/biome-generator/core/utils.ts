import type { BiomeDef } from '@/features/biome-generator/types/biome-generator'

export function getNormalizedWeights(biomes: BiomeDef[]): number[] {
  const sum = biomes.reduce((acc, b) => acc + Math.max(0, b.weight), 0)
  if (sum === 0) return biomes.map(() => 0)
  return biomes.map(b => Math.max(0, b.weight) / sum)
}

export function pickBiomeIndex(weights: number[], randomValue: number): number {
  let acc = 0
  for (let i = 0; i < weights.length; i++) {
    acc += weights[i]
    if (randomValue <= acc) return i
  }
  return weights.length - 1
}

export function getValidBiomeIndices(biomes: BiomeDef[]): number[] {
  return biomes.map((b, i) => b.weight > 0 ? i : -1).filter(i => i !== -1)
}

export function shuffleArray<T>(array: T[], prng: () => number): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}
