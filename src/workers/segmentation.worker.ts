import { slic } from '../core/slic'
import { OFFICIAL_PALETTE } from '../core/palette'

self.onmessage = (e: MessageEvent) => {
  const { imageData, params } = e.data

  try {
    const totalPixels = imageData.width * imageData.height

    self.postMessage({ type: 'progress', value: 10 })

    const result = slic(
      imageData,
      params.superpixelCount,
      params.compactness,
      10,
      0,
    )

    self.postMessage({ type: 'progress', value: 60 })

    const clusters = []
    for (let c = 0; c < result.clusterCount; c++) {
      const pixelIdx = result.centroids[c * 4]
      const px = pixelIdx % imageData.width
      const py = Math.floor(pixelIdx / imageData.width)
      const dataIdx = py * imageData.width * 4 + px * 4

      const r = imageData.data[dataIdx]
      const g = imageData.data[dataIdx + 1]
      const b = imageData.data[dataIdx + 2]

      const centroidLAB: [number, number, number] = [
        result.centroids[c * 4 + 1],
        result.centroids[c * 4 + 2],
        result.centroids[c * 4 + 3],
      ]

      let pixelCount = 0
      for (let i = 0; i < totalPixels; i++) {
        if (result.labels[i] === c) pixelCount++
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

    self.postMessage({ type: 'progress', value: 90 })

    const transferable = [result.labels.buffer, result.centroids.buffer]

    ;(self as any).postMessage(
      {
        type: 'result',
        payload: {
          labels: result.labels,
          centroids: result.centroids,
          clusters,
          width: imageData.width,
          height: imageData.height,
        },
      },
      transferable,
    )
  } catch (err) {
    self.postMessage({ type: 'error', message: (err as Error).message })
  }
}
