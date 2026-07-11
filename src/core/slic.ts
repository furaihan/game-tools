/**
 * Hand-implemented SLIC (Simple Linear Iterative Clustering) superpixel segmentation.
 *
 * This is a documented fallback for OpenCV.js's cv.ximgproc.createSuperpixelSLIC,
 * which requires a custom WASM build and is not available in the standard OpenCV.js distribution.
 *
 * Algorithm:
 * 1. Initialize K cluster centers on a regular grid
 * 2. Perturb centers to the lowest gradient position in a 3x3 neighborhood
 * 3. For each pixel, compute LAB + spatial distance to nearby cluster centers
 * 4. Assign each pixel to the nearest cluster
 * 5. Update cluster centers to the mean of assigned pixels
 * 6. Iterate until convergence or max iterations
 * 7. Enforce minimum region connectivity
 */

import { imageDataToLAB } from './colorspace'

export interface SLICResult {
  labels: Int32Array
  centroids: Float64Array
  clusterCount: number
}

export function slic(
  imageData: ImageData,
  k: number,
  m: number = 10,
  maxIterations: number = 10,
  minRegionSize: number = 0,
): SLICResult {
  const { width, height } = imageData
  const totalPixels = width * height
  const labData = imageDataToLAB(imageData.data)
  const labels = new Int32Array(totalPixels).fill(-1)
  const distances = new Float64Array(totalPixels).fill(Infinity)

  const S = Math.sqrt(totalPixels / k)
  const gridStep = Math.max(1, Math.round(S))
  const actualK = Math.floor(width / gridStep) * Math.floor(height / gridStep)

  const centroids: number[] = []

  for (let y = gridStep / 2; y < height; y += gridStep) {
    for (let x = gridStep / 2; x < width; x += gridStep) {
      const cx = Math.min(Math.round(x), width - 1)
      const cy = Math.min(Math.round(y), height - 1)

      const perturbed = findLowestGradient(cx, cy, labData, width, height)
      const pi = perturbed[1] * width + perturbed[0]

      centroids.push(pi, labData[pi * 3], labData[pi * 3 + 1], labData[pi * 3 + 2])
    }
  }

  const clusterCount = centroids.length / 4
  const centroidsArr = new Float64Array(centroids)

  for (let iter = 0; iter < maxIterations; iter++) {
    distances.fill(Infinity)

    for (let c = 0; c < clusterCount; c++) {
      const cx = centroidsArr[c * 4] % width
      const cy = Math.floor(centroidsArr[c * 4] / width)
      const cL = centroidsArr[c * 4 + 1]
      const cA = centroidsArr[c * 4 + 2]
      const cB = centroidsArr[c * 4 + 3]

      const xStart = Math.max(0, Math.round(cx - S))
      const xEnd = Math.min(width, Math.round(cx + S))
      const yStart = Math.max(0, Math.round(cy - S))
      const yEnd = Math.min(height, Math.round(cy + S))

      for (let y = yStart; y < yEnd; y++) {
        for (let x = xStart; x < xEnd; x++) {
          const idx = y * width + x
          const pL = labData[idx * 3]
          const pA = labData[idx * 3 + 1]
          const pB = labData[idx * 3 + 2]

          const dL = pL - cL
          const dA = pA - cA
          const dB = pB - cB
          const dLab = dL * dL + dA * dA + dB * dB

          const dx = x - cx
          const dy = y - cy
          const dxy = dx * dx + dy * dy

          const invS = 1 / S
          const d = dLab + (m * m * invS * invS) * dxy

          if (d < distances[idx]) {
            distances[idx] = d
            labels[idx] = c
          }
        }
      }
    }

    centroidsArr.fill(0)
    const counts = new Int32Array(clusterCount)

    for (let i = 0; i < totalPixels; i++) {
      const c = labels[i]
      if (c >= 0) {
        centroidsArr[c * 4] += i
        centroidsArr[c * 4 + 1] += labData[i * 3]
        centroidsArr[c * 4 + 2] += labData[i * 3 + 1]
        centroidsArr[c * 4 + 3] += labData[i * 3 + 2]
        counts[c]++
      }
    }

    for (let c = 0; c < clusterCount; c++) {
      if (counts[c] > 0) {
        centroidsArr[c * 4] = Math.round(centroidsArr[c * 4] / counts[c])
        centroidsArr[c * 4 + 1] /= counts[c]
        centroidsArr[c * 4 + 2] /= counts[c]
        centroidsArr[c * 4 + 3] /= counts[c]
      }
    }
  }

  enforceConnectivity(labels, width, height, Math.max(minRegionSize, S * S * 0.25))

  const uniqueClusters = new Set(labels)
  const remap = new Int32Array(clusterCount)
  let newId = 0
  for (const c of uniqueClusters) {
    if (c >= 0) remap[c] = newId++
  }

  const finalCentroids = new Float64Array(newId * 4)
  const centroidSums = new Float64Array(newId * 4)
  const centroidCounts = new Int32Array(newId)

  for (let i = 0; i < totalPixels; i++) {
    const c = remap[labels[i]]
    labels[i] = c
    centroidSums[c * 4] += i
    centroidSums[c * 4 + 1] += labData[i * 3]
    centroidSums[c * 4 + 2] += labData[i * 3 + 1]
    centroidSums[c * 4 + 3] += labData[i * 3 + 2]
    centroidCounts[c]++
  }

  for (let c = 0; c < newId; c++) {
    finalCentroids[c * 4] = Math.round(centroidSums[c * 4] / centroidCounts[c])
    finalCentroids[c * 4 + 1] = centroidSums[c * 4 + 1] / centroidCounts[c]
    finalCentroids[c * 4 + 2] = centroidSums[c * 4 + 2] / centroidCounts[c]
    finalCentroids[c * 4 + 3] = centroidSums[c * 4 + 3] / centroidCounts[c]
  }

  return { labels, centroids: finalCentroids, clusterCount: newId }
}

function findLowestGradient(
  x: number,
  y: number,
  labData: Float64Array,
  width: number,
  height: number,
): [number, number] {
  let minGrad = Infinity
  let bestX = x
  let bestY = y

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const nx = x + dx
      const ny = y + dy
      if (nx < 1 || nx >= width - 1 || ny < 1 || ny >= height - 1) continue

      const idx = ny * width + nx
      const grad =
        Math.abs(labData[(idx + 1) * 3] - labData[(idx - 1) * 3]) +
        Math.abs(labData[(idx + width) * 3 + 1] - labData[(idx - width) * 3 + 1])

      if (grad < minGrad) {
        minGrad = grad
        bestX = nx
        bestY = ny
      }
    }
  }

  return [bestX, bestY]
}

function enforceConnectivity(
  labels: Int32Array,
  width: number,
  height: number,
  minSize: number,
): void {
  const totalPixels = width * height
  const newLabels = new Int32Array(totalPixels).fill(-1)
  const visited = new Uint8Array(totalPixels)
  let nextLabel = 0

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x
      if (visited[idx]) continue

      const region: number[] = []
      const queue: number[] = [idx]
      visited[idx] = 1
      const targetLabel = labels[idx]

      while (queue.length > 0) {
        const p = queue.shift()!
        region.push(p)

        const px = p % width
        const py = Math.floor(p / width)

        const neighbors = []
        if (px > 0) neighbors.push(p - 1)
        if (px < width - 1) neighbors.push(p + 1)
        if (py > 0) neighbors.push(p - width)
        if (py < height - 1) neighbors.push(p + width)

        for (const n of neighbors) {
          if (!visited[n] && labels[n] === targetLabel) {
            visited[n] = 1
            queue.push(n)
          }
        }
      }

      const regionSize = region.length
      const label = regionSize >= minSize ? nextLabel++ : -1

      for (const p of region) {
        newLabels[p] = label
      }
    }
  }

  for (let i = 0; i < totalPixels; i++) {
    if (newLabels[i] < 0) {
    }
  }

  for (let i = 0; i < totalPixels; i++) {
    labels[i] = newLabels[i]
  }
}
