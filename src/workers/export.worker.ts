import UPNG from 'upng-js'
import { OFFICIAL_PALETTE, isValidBiomePixel } from '../core/palette'

self.onmessage = (e: MessageEvent) => {
  const { labels, srcWidth, srcHeight, targetSize } = e.data

  try {
    self.postMessage({ type: 'progress', value: 10 })

    const rgb = new Uint8Array(targetSize * targetSize * 3)
    const xScale = srcWidth / targetSize
    const yScale = srcHeight / targetSize

    for (let ty = 0; ty < targetSize; ty++) {
      const sy = Math.min(Math.floor(ty * yScale), srcHeight - 1)

      for (let tx = 0; tx < targetSize; tx++) {
        const sx = Math.min(Math.floor(tx * xScale), srcWidth - 1)
        const labelIdx = sy * srcWidth + sx
        const label = labels[labelIdx]
        const palette = OFFICIAL_PALETTE[label]
        const outIdx = (ty * targetSize + tx) * 3

        if (palette) {
          rgb[outIdx] = palette.rgb[0]
          rgb[outIdx + 1] = palette.rgb[1]
          rgb[outIdx + 2] = palette.rgb[2]
        }
        
        if (ty % 100 === 0) {

        const progress = Math.round(10 + (ty / targetSize) * 40)
        self.postMessage({ type: 'progress', value: progress })
      }
    }

    self.postMessage({ type: 'progress', value: 60 })

    for (let i = 0; i < rgb.length; i += 3) {
      if (!isValidBiomePixel(rgb[i], rgb[i + 1], rgb[i + 2])) {
        self.postMessage({
          type: 'error',
          message: 'Invalid pixel found during export validation',
        })
        return
      }
    }

    self.postMessage({ type: 'progress', value: 80 })

    const pngData = UPNG.encodeLL(
      [rgb.buffer as ArrayBuffer],
      targetSize,
      targetSize,
      3,
      0,
      8,
    )

    self.postMessage({ type: 'progress', value: 100 })

    ;(self as any).postMessage(
      {
        type: 'result',
        payload: pngData,
      },
      [pngData],
    )
  }
  } catch (err) {
    self.postMessage({ type: 'error', message: (err as Error).message })
  }
}
