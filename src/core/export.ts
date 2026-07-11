/**
 * RGB-only PNG export pipeline.
 *
 * 1. Nearest-neighbor upscale labels to target resolution
 * 2. Map labels → palette RGB values
 * 3. Encode as PNG color type 2 (RGB, no alpha) via upng-js `encodeLL`
 * 4. Validate every pixel before export
 */

import UPNG from 'upng-js'
import { OFFICIAL_PALETTE, isValidBiomePixel } from './palette'

export function exportBiomeMap(
  labels: Uint8Array,
  srcWidth: number,
  srcHeight: number,
  targetSize: number,
): Blob | null {
  const rgb = new Uint8Array(targetSize * targetSize * 3)

  const xScale = srcWidth / targetSize
  const yScale = srcHeight / targetSize

  for (let ty = 0; ty < targetSize; ty++) {
    for (let tx = 0; tx < targetSize; tx++) {
      const sx = Math.min(Math.floor(tx * xScale), srcWidth - 1)
      const sy = Math.min(Math.floor(ty * yScale), srcHeight - 1)

      const labelIdx = sy * srcWidth + sx
      const label = labels[labelIdx]
      const palette = OFFICIAL_PALETTE[label]
      const outIdx = (ty * targetSize + tx) * 3

      if (palette) {
        rgb[outIdx] = palette.rgb[0]
        rgb[outIdx + 1] = palette.rgb[1]
        rgb[outIdx + 2] = palette.rgb[2]
      }
    }
  }

  for (let i = 0; i < rgb.length; i += 3) {
    if (!isValidBiomePixel(rgb[i], rgb[i + 1], rgb[i + 2])) {
      console.error('Invalid pixel found at index', i)
      return null
    }
  }

  const pngData = UPNG.encodeLL([rgb.buffer as ArrayBuffer], targetSize, targetSize, 3, 0, 8)

  return new Blob([pngData], { type: 'image/png' })
}

export function validateExport(
  rgbBuffer: Uint8Array,
): { valid: boolean; invalidCount: number } {
  let invalidCount = 0

  for (let i = 0; i < rgbBuffer.length; i += 3) {
    if (!isValidBiomePixel(rgbBuffer[i], rgbBuffer[i + 1], rgbBuffer[i + 2])) {
      invalidCount++
    }
  }

  return { valid: invalidCount === 0, invalidCount }
}
