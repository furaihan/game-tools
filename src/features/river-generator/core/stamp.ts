export function stampCircle(
  data: Uint8Array,
  width: number,
  height: number,
  cx: number,
  cy: number,
  radius: number,
  value: number,
): void {
  const rSq = radius * radius
  const x0 = Math.max(0, Math.floor(cx - radius))
  const x1 = Math.min(width - 1, Math.ceil(cx + radius))
  const y0 = Math.max(0, Math.floor(cy - radius))
  const y1 = Math.min(height - 1, Math.ceil(cy + radius))

  for (let y = y0; y <= y1; y++) {
    const rowOffset = y * width
    const dy = y - cy
    const dySq = dy * dy
    for (let x = x0; x <= x1; x++) {
      const dx = x - cx
      if (dx * dx + dySq <= rSq) {
        data[rowOffset + x] = value
      }
    }
  }
}

export function strokeLineTapered(
  data: Uint8Array,
  width: number,
  height: number,
  points: [number, number][],
  startRadius: number,
  endRadius: number,
  value: number,
): void {
  const len = points.length
  if (len === 0) return
  if (len === 1) {
    stampCircle(data, width, height, points[0][0], points[0][1], endRadius, value)
    return
  }

  const segmentLengths: number[] = []
  let totalLen = 0
  for (let i = 0; i < len - 1; i++) {
    const dx = points[i + 1][0] - points[i][0]
    const dy = points[i + 1][1] - points[i][1]
    const segLen = Math.hypot(dx, dy)
    segmentLengths.push(segLen)
    totalLen += segLen
  }

  if (totalLen < 0.001) {
    stampCircle(data, width, height, points[0][0], points[0][1], endRadius, value)
    return
  }

  let cursor = 0
  for (let i = 0; i < len - 1; i++) {
    const [x0, y0] = points[i]
    const [x1, y1] = points[i + 1]
    const segLen = segmentLengths[i]
    const r0 = startRadius + (endRadius - startRadius) * (cursor / totalLen)
    const r1 = startRadius + (endRadius - startRadius) * ((cursor + segLen) / totalLen)
    const avgR = (r0 + r1) / 2
    const step = Math.max(0.5, avgR * 0.5)
    const steps = Math.max(1, Math.ceil(segLen / step))

    for (let j = 0; j <= steps; j++) {
      const t = j / steps
      const px = x0 + (x1 - x0) * t
      const py = y0 + (y1 - y0) * t
      const r = r0 + (r1 - r0) * t
      stampCircle(data, width, height, px, py, r, value)
    }

    cursor += segLen
  }
}
