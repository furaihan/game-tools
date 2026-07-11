/**
 * Error diffusion dithering using Floyd–Steinberg in LAB space.
 *
 * For each pixel (left→right, top→bottom):
 * 1. Find the nearest official-palette color in LAB space (quantization step)
 * 2. Compute quantization error = original LAB − chosen palette LAB
 * 3. Diffuse error to unprocessed neighbors (Floyd–Steinberg weights)
 * 4. The output pixel is always exactly one of the 5 official palette RGB values
 *
 * Never introduces intermediate/blended colors.
 */

import { rgbToLab } from './colorspace'
import { OFFICIAL_PALETTE } from './palette'
import type { Biome } from '@/types'

export function errorDiffuse(
  imageData: ImageData,
  palette: readonly Biome[],
): ImageData {
  const { width, height } = imageData
  const src = imageData.data
  const totalPixels = width * height

  const labBuffer = new Float64Array(totalPixels * 3)
  for (let i = 0; i < totalPixels; i++) {
    const off = i * 4
    const [L, a, b] = rgbToLab(src[off], src[off + 1], src[off + 2])
    labBuffer[i * 3] = L
    labBuffer[i * 3 + 1] = a
    labBuffer[i * 3 + 2] = b
  }

  const out = new Uint8ClampedArray(totalPixels * 4)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x
      const L = labBuffer[idx * 3]
      const a = labBuffer[idx * 3 + 1]
      const b = labBuffer[idx * 3 + 2]

      const nearest = findNearestPalette([L, a, b], palette)
      const outOff = idx * 4
      out[outOff] = nearest.rgb[0]
      out[outOff + 1] = nearest.rgb[1]
      out[outOff + 2] = nearest.rgb[2]
      out[outOff + 3] = 255

      const errL = L - nearest.lab[0]
      const errA = a - nearest.lab[1]
      const errB = b - nearest.lab[2]

      const neighbors: [number, number, number][] = [
        [0, 1, 7 / 16],
        [1, -1, 3 / 16],
        [1, 0, 5 / 16],
        [1, 1, 1 / 16],
      ]

      for (const [dy, dx, w] of neighbors) {
        const nx = x + dx
        const ny = y + dy
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue

        const ni = ny * width + nx
        labBuffer[ni * 3] += errL * w
        labBuffer[ni * 3 + 1] += errA * w
        labBuffer[ni * 3 + 2] += errB * w
      }
    }
  }

  return new ImageData(out, width, height)
}

export function errorDiffuseLabels(
  labels: Uint8Array,
  width: number,
  height: number,
): Uint8ClampedArray {
  const out = new Uint8ClampedArray(width * height * 4)

  for (let i = 0; i < labels.length; i++) {
    const p = OFFICIAL_PALETTE[labels[i]]
    if (!p) continue
    const off = i * 4
    out[off] = p.rgb[0]
    out[off + 1] = p.rgb[1]
    out[off + 2] = p.rgb[2]
    out[off + 3] = 255
  }

  return out
}

function findNearestPalette(
  lab: [number, number, number],
  palette: readonly Biome[],
): (typeof OFFICIAL_PALETTE)[number] {
  let minDist = Infinity
  let closest = OFFICIAL_PALETTE[0]

  for (const color of OFFICIAL_PALETTE) {
    if (palette.length > 0 && !palette.includes(color.biome)) continue
    const dl = lab[0] - color.lab[0]
    const da = lab[1] - color.lab[1]
    const db = lab[2] - color.lab[2]
    const d = dl * dl + da * da + db * db
    if (d < minDist) {
      minDist = d
      closest = color
    }
  }

  return closest
}
