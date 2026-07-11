import { OFFICIAL_PALETTE } from '../core/palette'
import type { Biome } from '@/types'

self.onmessage = (e: MessageEvent) => {
  const { labels, mapping, width, height } = e.data

  try {
    const mappingArr: Biome[] = []
    if (mapping instanceof Array) {
      mappingArr.push(...mapping)
    } else if (mapping instanceof Map) {
      for (const [key, val] of mapping) {
        mappingArr[key] = val
      }
    }

    const result = new Uint8Array(width * height)

    for (let i = 0; i < labels.length; i++) {
      const clusterId = labels[i]
      const biome = mappingArr[clusterId]
      const biomeIndex = biome
        ? OFFICIAL_PALETTE.findIndex((p) => p.biome === biome)
        : 0
      if (biomeIndex >= 0) result[i] = biomeIndex
    }

    ;(self as any).postMessage(
      { type: 'result', payload: { labels: result, width, height } },
      [result.buffer],
    )
  } catch (err) {
    self.postMessage({ type: 'error', message: (err as Error).message })
  }
}
