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
  for (let i = 0; i < len; i++) {
    const t = i / (len - 1)
    const r = startRadius + (endRadius - startRadius) * t
    const [px, py] = points[i]
    stampCircle(data, width, height, px, py, r, value)
  }
}
