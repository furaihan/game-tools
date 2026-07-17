import type { BiomeMap } from '../types/biome-generator'
import { majorityFilter } from '../core/biome-generator/cleanup'

self.onmessage = (e: MessageEvent<{ biomeMap: BiomeMap; radius: number }>) => {
  const { biomeMap, radius } = e.data
  const { width, height, seed, data } = biomeMap

  try {
    const start = performance.now()
    const nextData = majorityFilter(data, width, height, radius)

    console.log(`Majority filter took ${performance.now() - start}ms`)

    self.postMessage({
      type: 'success',
      data: { width, height, seed, data: nextData },
    })
  } catch (err: any) {
    self.postMessage({ type: 'error', error: err.message })
  }
}
