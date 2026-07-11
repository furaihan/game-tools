import { OFFICIAL_PALETTE } from './palette'
import type { Biome, ClassificationResult } from '@/types'

export function classifyRegions(
  labels: Int32Array,
  mapping: Map<number, Biome>,
  width: number,
  height: number,
): ClassificationResult {
  const result = new Uint8Array(width * height)

  for (let i = 0; i < labels.length; i++) {
    const clusterId = labels[i]
    const biome = mapping.get(clusterId)
    const biomeIndex = biome ? OFFICIAL_PALETTE.findIndex((p) => p.biome === biome) : 0
    result[i] = biomeIndex
  }

  return { labels: result, width, height }
}

export function applyManualEdits(
  classification: Uint8Array,
  editMask: Map<number, number>,
): Uint8Array {
  const result = new Uint8Array(classification)

  for (const [pixelIndex, biomeIndex] of editMask) {
    result[pixelIndex] = biomeIndex
  }

  return result
}

export function labelsToImageData(
  labels: Uint8Array,
  width: number,
  height: number,
): ImageData {
  const imageData = new Uint8ClampedArray(width * height * 4)

  for (let i = 0; i < labels.length; i++) {
    const biome = OFFICIAL_PALETTE[labels[i]]
    if (!biome) continue
    const off = i * 4
    imageData[off] = biome.rgb[0]
    imageData[off + 1] = biome.rgb[1]
    imageData[off + 2] = biome.rgb[2]
    imageData[off + 3] = 255
  }

  return new ImageData(imageData, width, height)
}
