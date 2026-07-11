import type { BiomeMap } from '../types/biome-generator'

self.onmessage = (e: MessageEvent<{ biomeMap: BiomeMap; radius: number }>) => {
  const { biomeMap, radius } = e.data
  const { width, height, seed, data } = biomeMap

  try {
    const start = performance.now()
    const nextData = new Uint8Array(width * height)

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const counts: Record<number, number> = {}
        let maxCount = 0
        let bestBiome = data[y * width + x]

        const yMin = Math.max(0, y - radius)
        const yMax = Math.min(height - 1, y + radius)
        const xMin = Math.max(0, x - radius)
        const xMax = Math.min(width - 1, x + radius)

        for (let ny = yMin; ny <= yMax; ny++) {
          for (let nx = xMin; nx <= xMax; nx++) {
            const b = data[ny * width + nx]
            counts[b] = (counts[b] || 0) + 1
            if (counts[b] > maxCount) {
              maxCount = counts[b]
              bestBiome = b
            }
          }
        }
        nextData[y * width + x] = bestBiome
      }
    }

    console.log(`Median blur took ${performance.now() - start}ms`)

    self.postMessage({
      type: 'success',
      data: { width, height, seed, data: nextData },
    })
  } catch (err: any) {
    self.postMessage({ type: 'error', error: err.message })
  }
}
