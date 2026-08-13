import { createPRNG } from '@/shared/utils/prng'

export function createValueNoise2D(seed: number) {
  const prng = createPRNG(seed)
  const size = 256
  const values = new Float32Array(size)
  const perm = new Uint8Array(size * 2)

  for (let i = 0; i < size; i++) {
    values[i] = prng() * 2 - 1
    perm[i] = i
  }

  for (let i = size - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1))
    const temp = perm[i]
    perm[i] = perm[j]
    perm[j] = temp
  }

  for (let i = 0; i < size; i++) {
    perm[size + i] = perm[i]
  }

  return function noise2D(x: number, y: number): number {
    const X = Math.floor(x) & 255
    const Y = Math.floor(y) & 255
    const xf = x - Math.floor(x)
    const yf = y - Math.floor(y)

    const u = xf * xf * (3 - 2 * xf)
    const v = yf * yf * (3 - 2 * yf)

    const n00 = values[perm[perm[X] + Y]]
    const n10 = values[perm[perm[X + 1] + Y]]
    const n01 = values[perm[perm[X] + Y + 1]]
    const n11 = values[perm[perm[X + 1] + Y + 1]]

    const nx0 = n00 + u * (n10 - n00)
    const nx1 = n01 + u * (n11 - n01)

    return nx0 + v * (nx1 - nx0)
  }
}

// Fractal Brownian Motion: stacks several octaves of noise into one organic
// field instead of a single flat frequency. Returns roughly -1..1.
export function fbm2D(
  noise: (x: number, y: number) => number,
  x: number,
  y: number,
  octaves: number,
  persistence = 0.5,
): number {
  let total = 0
  let frequency = 1
  let amplitude = 1
  let maxValue = 0

  for (let i = 0; i < octaves; i++) {
    total += noise(x * frequency, y * frequency) * amplitude
    maxValue += amplitude
    amplitude *= persistence
    frequency *= 2
  }

  return total / maxValue
}