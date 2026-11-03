import { CellularGrowthGenerator } from '@/features/biome-generator/core/cellular-growth'
import { DEFAULT_BIOMES } from '@/features/biome-generator/context/biome-generator-context'
import { createValueNoise2D, fbm2D } from '@/shared/utils/noise'

/**
 * The landing atlas is a real survey: it runs the same Cellular Growth generator
 * the Biome Layout Generator ships, at a small grid, then traces the resulting
 * biome boundaries with marching squares. Nothing here is drawn by hand, so the
 * contours on the page are literally what that tool produces.
 */
export const ATLAS_GRID = 96

export type AtlasRegion = {
  /** Index into the biome array the field was generated from. */
  index: number
  name: string
  /** Share of the map this biome occupies, 0..1. */
  coverage: number
  /** Normalised point inside the region, or null when it has no pixels. */
  label: { x: number; y: number } | null
}

/** A single marching-squares segment in grid coordinates: x1, y1, x2, y2. */
export type AtlasSegment = [number, number, number, number]

export type AtlasLevel = { level: number; segments: AtlasSegment[] }

export type AtlasContour = { biomeIndex: number; levels: AtlasLevel[] }

export type Atlas = {
  seed: number
  grid: number
  /** Biome index per cell, row-major. */
  field: Uint8Array
  regions: AtlasRegion[]
  contours: AtlasContour[]
  /** Faint elevation rings that give the plate its relief. */
  relief: AtlasLevel[]
}

const BOUNDARY_LEVELS = [0.5, 0.4, 0.3]
const RELIEF_LEVELS = [-0.34, -0.14, 0.14, 0.34]

/** Separable box blur, three passes — a cheap gaussian on the indicator mask. */
function blurMask(mask: Float32Array, w: number, h: number, radius: number): Float32Array {
  let src: Float32Array = mask
  let dst: Float32Array = new Float32Array(mask.length)
  const span = radius * 2 + 1

  for (let pass = 0; pass < 3; pass++) {
    // horizontal
    for (let y = 0; y < h; y++) {
      const row = y * w
      let sum = 0
      for (let x = -radius; x <= radius; x++) sum += src[row + Math.min(w - 1, Math.max(0, x))]
      for (let x = 0; x < w; x++) {
        dst[row + x] = sum / span
        const out = row + Math.min(w - 1, Math.max(0, x - radius))
        const inn = row + Math.min(w - 1, Math.max(0, x + radius + 1))
        sum += src[inn] - src[out]
      }
    }
    // vertical
    const tmp = src
    src = dst
    dst = tmp
    for (let x = 0; x < w; x++) {
      let sum = 0
      for (let y = -radius; y <= radius; y++) sum += src[Math.min(h - 1, Math.max(0, y)) * w + x]
      for (let y = 0; y < h; y++) {
        dst[y * w + x] = sum / span
        const out = Math.min(h - 1, Math.max(0, y - radius)) * w + x
        const inn = Math.min(h - 1, Math.max(0, y + radius + 1)) * w + x
        sum += src[inn] - src[out]
      }
    }
    const tmp2 = src
    src = dst
    dst = tmp2
  }

  return src
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Marching squares over a scalar field. Emits line segments in grid coordinates. */
function marchingSquares(field: Float32Array, w: number, h: number, level: number): AtlasSegment[] {
  const segments: AtlasSegment[] = []
  const at = (x: number, y: number) => field[y * w + x]

  for (let y = 0; y < h - 1; y++) {
    for (let x = 0; x < w - 1; x++) {
      const a = at(x, y)
      const b = at(x + 1, y)
      const c = at(x + 1, y + 1)
      const d = at(x, y + 1)

      const idx = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0)
      if (idx === 0 || idx === 15) continue

      const top = () => [x + lerp(0, 1, (level - a) / (b - a || 1e-6)), y] as const
      const bottom = () => [x + lerp(0, 1, (level - d) / (c - d || 1e-6)), y + 1] as const
      const left = () => [x, y + lerp(0, 1, (level - a) / (d - a || 1e-6))] as const
      const right = () => [x + 1, y + lerp(0, 1, (level - b) / (c - b || 1e-6))] as const

      const push = (p: readonly [number, number], q: readonly [number, number]) => {
        segments.push([p[0], p[1], q[0], q[1]])
      }

      switch (idx) {
        case 1: case 14: push(left(), bottom()); break
        case 2: case 13: push(bottom(), right()); break
        case 3: case 12: push(left(), right()); break
        case 4: case 11: push(top(), right()); break
        case 6: case 9: push(top(), bottom()); break
        case 7: case 8: push(left(), top()); break
        case 5: push(left(), top()); push(bottom(), right()); break
        case 10: push(top(), right()); push(left(), bottom()); break
        default: break
      }
    }
  }

  return segments
}

/** Point inside the region closest to its centroid — labels never drift into a neighbour. */
function labelPoint(mask: Uint8Array, w: number, h: number): { x: number; y: number } | null {
  let sx = 0
  let sy = 0
  let count = 0
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (mask[y * w + x]) { sx += x; sy += y; count++ }
    }
  }
  if (!count) return null

  const cx = sx / count
  const cy = sy / count
  let best: { x: number; y: number } | null = null
  let bestDist = Infinity
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!mask[y * w + x]) continue
      const dist = (x - cx) ** 2 + (y - cy) ** 2
      if (dist < bestDist) { bestDist = dist; best = { x, y } }
    }
  }
  if (!best) return null
  return { x: (best.x + 0.5) / w, y: (best.y + 0.5) / h }
}

export function buildAtlas(seed: number, grid = ATLAS_GRID): Atlas {
  const generator = new CellularGrowthGenerator()
  const biomes = DEFAULT_BIOMES.map((b) => ({ ...b }))
  const map = generator.generate(grid, grid, seed, biomes)
  const field = map.data
  const total = grid * grid

  const counts = new Array(biomes.length).fill(0)
  for (let i = 0; i < total; i++) {
    const idx = field[i]
    if (idx < counts.length) counts[idx]++
  }

  const regions: AtlasRegion[] = []
  const contours: AtlasContour[] = []

  for (let b = 0; b < biomes.length; b++) {
    const mask = new Uint8Array(total)
    let filled = 0
    for (let i = 0; i < total; i++) {
      if (field[i] === b) { mask[i] = 1; filled++ }
    }
    if (!filled) {
      regions.push({ index: b, name: biomes[b].name, coverage: 0, label: null })
      continue
    }

    regions.push({
      index: b,
      name: biomes[b].name,
      coverage: filled / total,
      label: labelPoint(mask, grid, grid),
    })

    const floatMask = new Float32Array(total)
    for (let i = 0; i < total; i++) floatMask[i] = mask[i]
    const soft = blurMask(floatMask, grid, grid, 2)

    contours.push({
      biomeIndex: b,
      levels: BOUNDARY_LEVELS.map((level) => ({
        level,
        segments: marchingSquares(soft, grid, grid, level),
      })),
    })
  }

  const noise = createValueNoise2D(seed ^ 0x5f3759df)
  const reliefField = new Float32Array(total)
  for (let y = 0; y < grid; y++) {
    for (let x = 0; x < grid; x++) {
      reliefField[y * grid + x] = fbm2D(noise, x / 11, y / 11, 4, 0.55)
    }
  }

  return {
    seed,
    grid,
    field,
    regions,
    contours,
    relief: RELIEF_LEVELS.map((level) => ({
      level,
      segments: marchingSquares(reliefField, grid, grid, level),
    })),
  }
}

/**
 * Where the two probes sit, as fractions of the visible frame. Each one stays in
 * open terrain just left of the callout that points at it, so the leader is a
 * short honest run rather than a line dragged across the whole sheet.
 */
export const PROBE_POINTS = {
  biome: { u: 0.575, v: 0.4 },
  codec: { u: 0.655, v: 0.655 },
} as const

/** The single square sheet the plate is drawn on, larger than its frame. */
export function plateGeometry(w: number, h: number) {
  const side = Math.max(w, h) * 1.02
  return { side, originX: w * 0.63 - side / 2, originY: h * 0.5 - side / 2 }
}

/** Probe fractions → percentages of the frame, for DOM survey marks. */
export function probePercent(u: number, v: number) {
  return { x: u * 100, y: v * 100 }
}

/**
 * Sheet coordinates (0..1 across the whole plotted sheet) → percentages of the
 * visible frame. The sheet is larger than the frame, so a good number of points
 * fall outside it; callers check before rendering.
 */
export function sheetPercent(u: number, v: number, w: number, h: number) {
  const { side, originX, originY } = plateGeometry(w, h)
  return { x: ((originX + u * side) / w) * 100, y: ((originY + v * side) / h) * 100 }
}
