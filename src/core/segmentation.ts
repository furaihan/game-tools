import { slic } from './slic'
import { OFFICIAL_PALETTE } from './palette'
import type { SegmentationResult, ClusterInfo, SegmentationParams } from '@/types'

export function segment(imageData: ImageData, params: SegmentationParams): SegmentationResult {
  const { labels, centroids, clusterCount } = slic(
    imageData,
    params.superpixelCount,
    params.compactness,
    10,
    0,
  )

  const clusters: ClusterInfo[] = []

  for (let c = 0; c < clusterCount; c++) {
    const pixelIdx = centroids[c * 4]
    const px = pixelIdx % imageData.width
    const py = Math.floor(pixelIdx / imageData.width)
    const dataIdx = py * imageData.width * 4 + px * 4

    const r = imageData.data[dataIdx]
    const g = imageData.data[dataIdx + 1]
    const b = imageData.data[dataIdx + 2]

    const centroidLAB: [number, number, number] = [
      centroids[c * 4 + 1],
      centroids[c * 4 + 2],
      centroids[c * 4 + 3],
    ]

    let pixelCount = 0
    for (let i = 0; i < labels.length; i++) {
      if (labels[i] === c) pixelCount++
    }

    let minDist = Infinity
    let assignedBiome = OFFICIAL_PALETTE[0].biome
    for (const p of OFFICIAL_PALETTE) {
      const dl = centroidLAB[0] - p.lab[0]
      const da = centroidLAB[1] - p.lab[1]
      const db = centroidLAB[2] - p.lab[2]
      const d = dl * dl + da * da + db * db
      if (d < minDist) {
        minDist = d
        assignedBiome = p.biome
      }
    }

    clusters.push({
      id: c,
      centroidLAB,
      centroidRGB: [r, g, b],
      pixelCount,
      assignedBiome,
    })
  }

  return { labels, clusters, width: imageData.width, height: imageData.height }
}
