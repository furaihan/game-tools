export function majorityFilter(
  labels: Uint8Array,
  width: number,
  height: number,
  radius: number,
): Uint8Array {
  const result = new Uint8Array(labels)
  if (radius < 1) return result

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const counts = new Map<number, number>()
      const yMin = Math.max(0, y - radius)
      const yMax = Math.min(height - 1, y + radius)
      const xMin = Math.max(0, x - radius)
      const xMax = Math.min(width - 1, x + radius)

      for (let ky = yMin; ky <= yMax; ky++) {
        for (let kx = xMin; kx <= xMax; kx++) {
          const val = labels[ky * width + kx]
          counts.set(val, (counts.get(val) || 0) + 1)
        }
      }

      let maxCount = 0
      let majorityVal = labels[y * width + x]
      for (const [val, count] of counts) {
        if (count > maxCount) {
          maxCount = count
          majorityVal = val
        }
      }

      result[y * width + x] = majorityVal
    }
  }

  return result
}

export function morphOpen(
  labels: Uint8Array,
  width: number,
  height: number,
  radius: number,
): Uint8Array {
  if (radius < 1) return new Uint8Array(labels)

  const eroded = morphErode(labels, width, height, radius)
  return morphDilate(eroded, width, height, radius)
}

export function morphClose(
  labels: Uint8Array,
  width: number,
  height: number,
  radius: number,
): Uint8Array {
  if (radius < 1) return new Uint8Array(labels)

  const dilated = morphDilate(labels, width, height, radius)
  return morphErode(dilated, width, height, radius)
}

function morphErode(
  labels: Uint8Array,
  width: number,
  height: number,
  radius: number,
): Uint8Array {
  const result = new Uint8Array(labels)
  const seSize = 2 * radius + 1
  const seCenter = radius

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let allSame = true
      const centerVal = labels[y * width + x]

      for (let ky = 0; ky < seSize && allSame; ky++) {
        for (let kx = 0; kx < seSize && allSame; kx++) {
          const sy = y + ky - seCenter
          const sx = x + kx - seCenter
          if (sy < 0 || sy >= height || sx < 0 || sx >= width) continue

          if (labels[sy * width + sx] !== centerVal) {
            allSame = false
          }
        }
      }

      if (!allSame) {
      }
    }
  }

  return result
}

function morphDilate(
  labels: Uint8Array,
  width: number,
  height: number,
  radius: number,
): Uint8Array {
  const result = new Uint8Array(labels)
  const seSize = 2 * radius + 1
  const seCenter = radius

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const counts = new Map<number, number>()

      for (let ky = 0; ky < seSize; ky++) {
        for (let kx = 0; kx < seSize; kx++) {
          const sy = y + ky - seCenter
          const sx = x + kx - seCenter
          if (sy < 0 || sy >= height || sx < 0 || sx >= width) continue

          const val = labels[sy * width + sx]
          counts.set(val, (counts.get(val) || 0) + 1)
        }
      }

      let maxCount = 0
      let maxVal = labels[y * width + x]
      for (const [val, count] of counts) {
        if (count > maxCount) {
          maxCount = count
          maxVal = val
        }
      }

      result[y * width + x] = maxVal
    }
  }

  return result
}
