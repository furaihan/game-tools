import type { BiomeDef, BiomeMap, BiomeGenerator, NoiseConfig } from '@/types/biome-generator'
import { createNoise2D } from 'simplex-noise'

function mulberry32(a: number) {
  return function() {
    var t = a += 0x6D2B79F5
    t = Math.imul(t ^ t >>> 15, t | 1)
    t ^= t + Math.imul(t ^ t >>> 7, t | 61)
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

class PerlinNoise {
  private p: number[] = new Array(512)

  constructor(prng: () => number) {
    const p = new Array(256)
    for (let i = 0; i < 256; i++) p[i] = Math.floor(prng() * 256)
    for (let i = 0; i < 512; i++) this.p[i] = p[i & 255]
  }

  private fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10) }
  private lerp(t: number, a: number, b: number) { return a + t * (b - a) }
  private grad(hash: number, x: number, y: number) {
    const h = hash & 15
    const u = h < 8 ? x : y
    const v = h < 4 ? y : h === 12 || h === 14 ? x : 0
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
  }

  noise2D(x: number, y: number): number {
    const X = Math.floor(x) & 255
    const Y = Math.floor(y) & 255
    x -= Math.floor(x)
    y -= Math.floor(y)
    const u = this.fade(x)
    const v = this.fade(y)
    const A = this.p[X] + Y, B = this.p[X + 1] + Y
    return this.lerp(v,
      this.lerp(u, this.grad(this.p[A], x, y), this.grad(this.p[B], x - 1, y)),
      this.lerp(u, this.grad(this.p[A + 1], x, y - 1), this.grad(this.p[B + 1], x - 1, y - 1))
    )
  }
}

class WorleyNoise {
  private hash(x: number, y: number): number {
    let h = (x * 73856093) ^ (y * 19349663)
    h = ((h ^ (h >>> 16)) * 0x45d9f3b) >>> 0
    h = ((h ^ (h >>> 16)) * 0x45d9f3b) >>> 0
    h = (h ^ (h >>> 16)) >>> 0
    return h / 4294967296
  }

  noise2D(x: number, y: number): number {
    const X = Math.floor(x)
    const Y = Math.floor(y)
    let minDist = 1.0
    for (let j = -1; j <= 1; j++) {
      for (let i = -1; i <= 1; i++) {
        const nx = X + i
        const ny = Y + j
        const h1 = this.hash(nx, ny)
        const h2 = this.hash(nx + 100, ny - 100)
        const px = nx + h1
        const py = ny + h2
        const dx = x - px
        const dy = y - py
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < minDist) minDist = dist
      }
    }
    return minDist * 2.0 - 1.0
  }
}

export class NoiseFieldGenerator implements BiomeGenerator {
  config: NoiseConfig

  constructor(config: NoiseConfig) {
    this.config = config
  }

  generate(width: number, height: number, seed: number, biomes: BiomeDef[]): BiomeMap {
    const data = new Uint8Array(width * height)
    const validBiomes = biomes.filter(b => b.weight > 0)
    if (validBiomes.length === 0) return { width, height, seed, data }

    const totalWeight = validBiomes.reduce((sum, b) => sum + b.weight, 0)

    const getNoiseFunc = (prng: () => number) => {
      const simplex = createNoise2D(prng)
      const perlin = new PerlinNoise(prng)
      const worley = new WorleyNoise()

      return (nx: number, ny: number) => {
        let v = 0
        let amplitude = 1
        let frequency = 1
        let maxVal = 0
        const octaves = this.config.noiseType === "Fractal" ? this.config.octaves : 1

        for (let i = 0; i < octaves; i++) {
          const sx = nx * frequency
          const sy = ny * frequency
          let noiseVal = 0
          if (this.config.noiseType === "Perlin") {
            noiseVal = perlin.noise2D(sx, sy)
          } else if (this.config.noiseType === "Simplex" || this.config.noiseType === "Fractal") {
            noiseVal = simplex(sx, sy)
          } else if (this.config.noiseType === "Worley") {
            noiseVal = worley.noise2D(sx, sy)
          }
          v += noiseVal * amplitude
          maxVal += amplitude
          amplitude *= this.config.persistence
          frequency *= this.config.lacunarity
        }

        return v / maxVal
      }
    }

    if (this.config.biomeMapping === "Threshold Bands") {
      const prng = mulberry32(seed)
      const noise = getNoiseFunc(prng)

      const thresholds: { val: number; index: number }[] = []
      let accum = 0
      for (const b of validBiomes) {
        accum += (b.weight / totalWeight)
        thresholds.push({ val: accum * 2 - 1, index: biomes.indexOf(b) })
      }

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const nx = x / this.config.scale
          const ny = y / this.config.scale
          const val = noise(nx, ny)

          let chosen = thresholds[0].index
          for (const t of thresholds) {
            if (val <= t.val) {
              chosen = t.index
              break
            }
          }
          data[y * width + x] = chosen
        }
      }
    } else {
      const noiseLayers = validBiomes.map(b => {
        const layerSeed = seed ^ this.hashString(b.id)
        const prng = mulberry32(layerSeed)
        const noise = getNoiseFunc(prng)
        return {
          noise,
          index: biomes.indexOf(b),
          weight: b.weight / totalWeight,
        }
      })

      // Deterministic shuffle
      const prng = mulberry32(seed)
      for (let i = noiseLayers.length - 1; i > 0; i--) {
        const j = Math.floor(prng() * (i + 1))
        ;[noiseLayers[i], noiseLayers[j]] = [noiseLayers[j], noiseLayers[i]]
      }

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const nx = x / this.config.scale
          const ny = y / this.config.scale

          let maxScore = -Infinity
          let bestIndex = 0

          for (const layer of noiseLayers) {
            const val = (layer.noise(nx, ny) * 0.5 + 0.5)
            const score = val * layer.weight
            if (score > maxScore) {
              maxScore = score
              bestIndex = layer.index
            }
          }

          data[y * width + x] = bestIndex
        }
      }
    }

    return { width, height, seed, data }
  }

  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return hash
  }
}
