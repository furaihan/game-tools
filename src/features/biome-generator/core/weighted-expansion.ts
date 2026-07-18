import type {
  BiomeDef,
  BiomeMap,
  BiomeGenerator,
  GenerationStatus,
} from "@/features/biome-generator/types/biome-generator";
import { createPRNG } from "./prng";
import { getNormalizedWeights, pickBiomeIndex } from "./utils";

export class WeightedExpansionGenerator implements BiomeGenerator {
  generate(
    width: number,
    height: number,
    seed: number,
    biomes: BiomeDef[],
    onStatus?: (status: GenerationStatus) => void,
  ): BiomeMap {
    const data = new Uint8Array(width * height).fill(255);
    const prng = createPRNG(seed);
    const weights = getNormalizedWeights(biomes);
    const totalPixels = width * height;

    onStatus?.({ phase: "Placing seeds", progress: 0 });

    const numSeeds = Math.max(biomes.length * 2, 30);
    const frontier: number[] = [];
    let assignedCount = 0;

    for (let i = 0; i < numSeeds; i++) {
      const x = Math.floor(prng() * width);
      const y = Math.floor(prng() * height);
      const idx = y * width + x;
      if (data[idx] === 255) {
        data[idx] = pickBiomeIndex(weights, prng());
        frontier.push(idx);
        assignedCount++;
      }
    }

    const dirs = [-width, width, -1, 1];
    const reportInterval = Math.max(1000, Math.floor(totalPixels / 100));

    onStatus?.({ phase: "Expanding territories", progress: 0.05 });

    while (frontier.length > 0) {
      const idx = frontier.shift()!;
      const x = idx % width;
      const y = Math.floor(idx / width);

      const neighbors = dirs
        .map((d) => idx + d)
        .filter((n) => {
          if (n < 0 || n >= totalPixels) return false;
          const nx = n % width;
          if (Math.abs(nx - x) > 1) return false;
          return data[n] === 255;
        });

      for (const n of neighbors) {
        data[n] = data[idx];
        assignedCount++;
        if (assignedCount % reportInterval === 0) {
          onStatus?.({ phase: "Expanding territories", progress: 0.05 + (assignedCount / totalPixels) * 0.80 })
        }
        if (prng() < 0.7) frontier.push(n);
      }
    }

    onStatus?.({ phase: "Filling remaining gaps", progress: 0.85 });

    let remaining = true;
    while (remaining) {
      remaining = false;
      for (let idx = 0; idx < totalPixels; idx++) {
        if (data[idx] !== 255) continue;
        const x = idx % width;
        const neighborVals = dirs
          .map((d) => idx + d)
          .filter((n) => {
            if (n < 0 || n >= totalPixels) return false;
            const nx = n % width;
            if (Math.abs(nx - x) > 1) return false;
            return data[n] !== 255;
          })
          .map((n) => data[n]);

        if (neighborVals.length > 0) {
          data[idx] = neighborVals[Math.floor(prng() * neighborVals.length)];
          remaining = true;
        }
      }
    }

    onStatus?.({ phase: "Done", progress: 1 });
    return { width, height, seed, data };
  }
}

