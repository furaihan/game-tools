import type { BiomeGenerator, AlgorithmName } from '@/features/biome-generator/types/biome-generator'
import { RandomSeedsGenerator } from './random-seeds'
import { TerritoryExpansionGenerator } from './territory-expansion'
import { RandomWalkersGenerator } from './random-walkers'
import { RandomBlobsGenerator } from './random-blobs'
import { CellularGrowthGenerator } from './cellular-growth'
import { ProbabilityFieldsGenerator } from './probability-fields'
import { RecursiveSplitGenerator } from './recursive-split'
import { WeightedExpansionGenerator } from './weighted-expansion'
import { BiomeIslandsGenerator } from './biome-islands'

export const generators: Record<AlgorithmName, BiomeGenerator> = {
  "Random Seeds": new RandomSeedsGenerator(),
  "Territory Expansion": new TerritoryExpansionGenerator(),
  "Random Walkers": new RandomWalkersGenerator(),
  "Random Blobs": new RandomBlobsGenerator(),
  "Cellular Growth": new CellularGrowthGenerator(),
  "Probability Fields": new ProbabilityFieldsGenerator(),
  "Recursive Split": new RecursiveSplitGenerator(),
  "Weighted Expansion": new WeightedExpansionGenerator(),
  "Biome Islands": new BiomeIslandsGenerator(),
}
