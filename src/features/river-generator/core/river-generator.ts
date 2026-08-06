import type { WaterMap, RiverGenParams, RiverGenStatus } from '../types/river-generator'
import { createPRNG } from '@/features/biome-generator/core/prng'
import { createValueNoise2D } from './noise'
import { stampCircle } from './stamp'

const MIN_SEGMENT_LENGTH = 4
// <= 0.5 keeps relative displacement bounded at fine scales (displacement/d scales as (2*decay)^n).
const DISPLACEMENT_DECAY = 0.5
// Caps a single split's perpendicular offset so a segment can never reverse on itself.
const MAX_DISPLACEMENT_RATIO = 0.3
// Caps midpoint displacement tree size (~2^depth leaves); 14 covers resolution up to ~8192.
const MAX_RECURSION_DEPTH = 14
// Derived seed for the value-noise generator; keep offsets distinct per generator.
const NOISE_SEED_OFFSET = 1

function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.hypot(x2 - x1, y2 - y1)
}

function midpointDisplaceRecursive(
  ax: number, ay: number,
  bx: number, by: number,
  prng: () => number,
  roughness: number,
  displacementDecay: number,
  maxDepth: number,
  width: number,
  height: number,
): [number, number][] {
  const d = distance(ax, ay, bx, by)
  if (d < MIN_SEGMENT_LENGTH || maxDepth <= 0) {
    return [[ax, ay], [bx, by]]
  }

  const mx = (ax + bx) / 2
  const my = (ay + by) / 2

  const pdx = -(by - ay) / d
  const pdy = (bx - ax) / d

  const maxDisp = MAX_DISPLACEMENT_RATIO * d
  const displacement = Math.max(-maxDisp, Math.min(maxDisp, (prng() * 2 - 1) * roughness * d))
  let mpx = mx + pdx * displacement
  let mpy = my + pdy * displacement

  let scale = 1
  if (mpx < 0) {
    scale = Math.min(scale, mx / (mx - mpx))
  } else if (mpx > width - 1) {
    scale = Math.min(scale, (width - 1 - mx) / (mpx - mx))
  }
  if (mpy < 0) {
    scale = Math.min(scale, my / (my - mpy))
  } else if (mpy > height - 1) {
    scale = Math.min(scale, (height - 1 - my) / (mpy - my))
  }
  mpx = mx + (mpx - mx) * scale
  mpy = my + (mpy - my) * scale

  const nextRoughness = roughness * displacementDecay
  const nextDepth = maxDepth - 1

  const left = midpointDisplaceRecursive(ax, ay, mpx, mpy, prng, nextRoughness, displacementDecay, nextDepth, width, height)
  const right = midpointDisplaceRecursive(mpx, mpy, bx, by, prng, nextRoughness, displacementDecay, nextDepth, width, height)

  return [...left, ...right.slice(1)]
}

function midpointDisplace(
  ax: number, ay: number,
  bx: number, by: number,
  prng: () => number,
  roughness: number,
  displacementDecay: number,
  width: number,
  height: number,
): [number, number][] {
  const d = distance(ax, ay, bx, by)
  const maxDepth = Math.min(
    MAX_RECURSION_DEPTH,
    Math.ceil(Math.log2(Math.max(d, 1) / MIN_SEGMENT_LENGTH)),
  )
  return midpointDisplaceRecursive(ax, ay, bx, by, prng, roughness, displacementDecay, maxDepth, width, height)
}

function smoothPath(points: [number, number][], iterations: number): [number, number][] {
  if (points.length <= 2) return points

  let result = points
  for (let iter = 0; iter < iterations; iter++) {
    const smoothed: [number, number][] = [result[0]]
    for (let i = 1; i < result.length - 1; i++) {
      const avgX = (result[i - 1][0] + result[i][0] + result[i + 1][0]) / 3
      const avgY = (result[i - 1][1] + result[i][1] + result[i + 1][1]) / 3
      smoothed.push([avgX, avgY])
    }
    smoothed.push(result[result.length - 1])
    result = smoothed
  }
  return result
}

function pickEdgePoint(prng: () => number, width: number, height: number, edge: number): [number, number] {
  const marginY = Math.max(1, Math.floor(height * 0.1))
  const marginX = Math.max(1, Math.floor(width * 0.1))
  switch (edge) {
    case 0: return [0, marginY + Math.floor(prng() * Math.max(1, height - 2 * marginY))]
    case 1: return [width - 1, marginY + Math.floor(prng() * Math.max(1, height - 2 * marginY))]
    case 2: return [marginX + Math.floor(prng() * Math.max(1, width - 2 * marginX)), 0]
    default: return [marginX + Math.floor(prng() * Math.max(1, width - 2 * marginX)), height - 1]
  }
}

function collectEdgeCells(width: number, height: number): { x: number; y: number }[] {
  const marginY = Math.max(1, Math.floor(height * 0.1))
  const marginX = Math.max(1, Math.floor(width * 0.1))

  const cells: { x: number; y: number }[] = []
  for (let y = marginY; y < height - marginY; y++) {
    cells.push({ x: 0, y })
    cells.push({ x: width - 1, y })
  }
  for (let x = marginX; x < width - marginX; x++) {
    cells.push({ x, y: 0 })
    cells.push({ x, y: height - 1 })
  }
  return cells
}

function findNearestValidEdgePoint(
  prng: () => number,
  width: number,
  height: number,
  fromX: number,
  fromY: number,
  mainRiverDirX: number,
  mainRiverDirY: number,
  desiredSide: number,
  data: Uint8Array,
  edgeCells: { x: number; y: number }[],
): [number, number] {
  const candidates: { x: number; y: number; distSq: number; side: number }[] = []

  for (const cell of edgeCells) {
    if (data[cell.y * width + cell.x] !== 0) continue
    const dx = cell.x - fromX
    const dy = cell.y - fromY
    const cross = mainRiverDirX * dy - mainRiverDirY * dx
    candidates.push({ x: cell.x, y: cell.y, distSq: dx * dx + dy * dy, side: Math.sign(cross) })
  }

  if (candidates.length === 0) {
    return [Math.floor(prng() * width), Math.floor(prng() * height)]
  }

  const dirLen = Math.hypot(mainRiverDirX, mainRiverDirY)
  const ndx = dirLen > 0 ? mainRiverDirX / dirLen : 0
  const ndy = dirLen > 0 ? mainRiverDirY / dirLen : 0

  const isAway = (c: { x: number; y: number }) => {
    const ex = c.x - fromX
    const ey = c.y - fromY
    const elen = Math.hypot(ex, ey)
    if (elen < 1) return false
    const dot = (ex / elen) * ndx + (ey / elen) * ndy
    return dot < 0.5
  }

  const nearest = (pool: { x: number; y: number; distSq: number }[]) => {
    pool.sort((a, b) => a.distSq - b.distSq)
    return pool[0]
  }

  const onSide = candidates.filter(c => c.side === desiredSide)
  const onSideAway = onSide.filter(isAway)
  const otherAway = candidates.filter(c => c.side !== desiredSide && isAway(c))

  const pool = onSideAway.length > 0
    ? onSideAway
    : onSide.length > 0
      ? onSide
      : otherAway.length > 0
        ? otherAway
        : candidates

  const best = nearest(pool)
  const jx = best.x + Math.floor(prng() * 5) - 2
  const jy = best.y + Math.floor(prng() * 5) - 2
  return [Math.max(0, Math.min(width - 1, jx)), Math.max(0, Math.min(height - 1, jy))]
}

function selectBranchPoints(
  centerline: [number, number][],
  branchCount: number,
  prng: () => number,
): number[] {
  if (branchCount <= 0 || centerline.length < 4) return []

  const startIdx = Math.max(0, Math.floor(centerline.length * 0.1))
  const endIdx = Math.min(centerline.length - 1, Math.ceil(centerline.length * 0.9))

  if (endIdx - startIdx < branchCount) {
    return Array.from({ length: Math.min(branchCount, endIdx - startIdx + 1) }, (_, i) =>
      startIdx + Math.floor((i / branchCount) * (endIdx - startIdx)),
    )
  }

  const selected: number[] = []
  const minSpacing = Math.max(2, Math.floor(centerline.length * 0.08))

  for (let attempt = 0; attempt < 50 && selected.length < branchCount; attempt++) {
    const r1 = prng()
    const r2 = prng()
    const gaussian = Math.max(-1, Math.min(1, r1 + r2 - 1))
    const t = 0.5 + gaussian * 0.35
    const idx = startIdx + Math.floor(t * (endIdx - startIdx))
    const clampedIdx = Math.max(startIdx, Math.min(endIdx, idx))

    const tooClose = selected.some(s => Math.abs(s - clampedIdx) < minSpacing)
    if (!tooClose) {
      selected.push(clampedIdx)
    }
  }

  return selected
}

function throttle(fn: (t: number) => void, step = 0.05): (t: number) => void {
  let lastT = -1
  return (t: number) => {
    if (t - lastT >= step || t >= 1) {
      lastT = t
      fn(t)
    }
  }
}

function stampRiver(
  data: Uint8Array,
  width: number,
  height: number,
  points: [number, number][],
  baseWidth: number,
  startTaper: number,
  endTaper: number,
  noise2D: (x: number, y: number) => number,
  onProgress?: (t: number) => void,
): void {
  const len = points.length
  if (len === 0) return

  const segLengths: number[] = []
  let totalLen = 0
  for (let i = 0; i < len - 1; i++) {
    const dx = points[i + 1][0] - points[i][0]
    const dy = points[i + 1][1] - points[i][1]
    const sl = Math.hypot(dx, dy)
    segLengths.push(sl)
    totalLen += sl
  }

  if (totalLen < 0.001) {
    const noise = 1.0 + noise2D(points[0][0] * 0.1, points[0][1] * 0.1) * 0.15
    const radius = (baseWidth * startTaper * noise) / 2
    stampCircle(data, width, height, points[0][0], points[0][1], radius, 1)
    onProgress?.(1)
    return
  }

  let cursor = 0
  for (let i = 0; i < len - 1; i++) {
    const [x0, y0] = points[i]
    const [x1, y1] = points[i + 1]
    const segLen = segLengths[i]
    const t0 = cursor / totalLen
    const t1 = (cursor + segLen) / totalLen
    const r0 = (baseWidth * (startTaper + (endTaper - startTaper) * t0)) / 2
    const r1 = (baseWidth * (startTaper + (endTaper - startTaper) * t1)) / 2
    const avgR = (r0 + r1) / 2
    const step = Math.max(0.5, avgR * 0.5)
    const steps = Math.max(1, Math.ceil(segLen / step))

    for (let j = 0; j <= steps; j++) {
      const t = j / steps
      const px = x0 + (x1 - x0) * t
      const py = y0 + (y1 - y0) * t
      const base = r0 + (r1 - r0) * t
      const noise = 1.0 + noise2D(px * 0.1, py * 0.1) * 0.15
      stampCircle(data, width, height, px, py, base * noise, 1)
    }

    cursor += segLen
    onProgress?.(i / (len - 1))
  }
}

function ensureBranchConnects(
  data: Uint8Array,
  width: number,
  height: number,
  branch: [number, number][],
): number {
  if (branch.length === 0) return 0

  const originX = Math.round(branch[0][0])
  const originY = Math.round(branch[0][1])
  if (originX < 0 || originX >= width || originY < 0 || originY >= height) return 0

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const nx = originX + dx
      const ny = originY + dy
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue
      if (data[ny * width + nx] === 1) return 0
    }
  }

  const painted: number[] = []
  for (let dy = -3; dy <= 3; dy++) {
    for (let dx = -3; dx <= 3; dx++) {
      const nx = originX + dx
      const ny = originY + dy
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue
      if (data[ny * width + nx] === 0) painted.push(ny * width + nx)
    }
  }

  stampCircle(data, width, height, originX, originY, 2, 1)

  return painted.filter(idx => data[idx] === 1).length
}

function smoothGrid(data: Uint8Array, width: number, height: number, iterations: number): void {
  // Cellular-automata cleanup: erode water with <3 wet neighbors, dilate land with >=6.
  // Aggressive rules; thin rivers (branchWidth 2-3px) get eaten if iterations rise — keep at 1.
  const totalPixels = width * height
  const temp = new Uint8Array(totalPixels)

  for (let iter = 0; iter < iterations; iter++) {
    temp.set(data)

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let count = 0
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue
            const nx = x + dx
            const ny = y + dy
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              if (data[ny * width + nx] === 1) count++
            }
          }
        }

        const idx = y * width + x
        if (data[idx] === 1 && count < 3) {
          temp[idx] = 0
        } else if (data[idx] === 0 && count >= 6) {
          temp[idx] = 1
        }
      }
    }

    data.set(temp)
  }
}

export interface RiverBranchTrace {
  origin: [number, number]
  points: [number, number][]
  side: number
  desiredSide: number
  reconnectPixels: number
}

export interface RiverTrace {
  width: number
  height: number
  seed: number
  centerline: [number, number][]
  smoothed: [number, number][]
  branches: RiverBranchTrace[]
  waterMap: Uint8Array
}

export function buildRiverTrace(
  params: RiverGenParams,
  onStatus?: (status: RiverGenStatus) => void,
): RiverTrace {
  const { width, height, seed, branchCount, mainStemWidth, branchWidth, roughness } = params

  const data = new Uint8Array(width * height)
  const prng = createPRNG(seed)
  const noise2D = createValueNoise2D(seed + NOISE_SEED_OFFSET)

  onStatus?.({ phase: 'Picking river source', progress: 0 })

  const startEdge = Math.floor(prng() * 4)
  const oppositeEdge = startEdge % 2 === 0 ? startEdge + 1 : startEdge - 1
  const targetEdge = prng() < 0.85
    ? oppositeEdge
    : [0, 1, 2, 3].filter(e => e !== startEdge && e !== oppositeEdge)[Math.floor(prng() * 2)]

  const [sx, sy] = pickEdgePoint(prng, width, height, startEdge)
  const [tx, ty] = pickEdgePoint(prng, width, height, targetEdge)

  onStatus?.({ phase: 'Generating main stem centerline', progress: 0.1 })

  const centerline = midpointDisplace(sx, sy, tx, ty, prng, roughness, DISPLACEMENT_DECAY, width, height)
  const smoothed = smoothPath(centerline, 2 + Math.round(roughness * 4))

  onStatus?.({ phase: 'Stamping main stem', progress: 0.35 })

  stampRiver(
    data, width, height, smoothed, mainStemWidth, 0.5, 1.0, noise2D,
    throttle((t) => onStatus?.({ phase: 'Stamping main stem', progress: 0.35 + t * 0.15 })),
  )

  const branchSmoothIter = 2 + Math.round(roughness * 1.2 * 4)

  onStatus?.({ phase: 'Selecting branch points', progress: 0.5 })

  const branchIndices = selectBranchPoints(smoothed, branchCount, prng)

  const edgeCells = collectEdgeCells(width, height).filter(c => data[c.y * width + c.x] === 0)
  const branches: RiverBranchTrace[] = []

  onStatus?.({
    phase: 'Walking tributaries',
    progress: 0.55,
    detail: `0 of ${branchIndices.length} branches placed`,
  })

  for (let b = 0; b < branchIndices.length; b++) {
    const branchProgress = 0.55 + (b / branchIndices.length) * 0.4
    onStatus?.({
      phase: 'Walking tributaries',
      progress: branchProgress,
      detail: `${b + 1} of ${branchIndices.length} branches placed`,
    })

    const bpIdx = branchIndices[b]
    const [branchPointX, branchPointY] = smoothed[bpIdx]

    const prevIdx = Math.max(0, bpIdx - 1)
    const nextIdx = Math.min(smoothed.length - 1, bpIdx + 1)
    const dirX = smoothed[nextIdx][0] - smoothed[prevIdx][0]
    const dirY = smoothed[nextIdx][1] - smoothed[prevIdx][1]

    const desiredSide = prng() < 0.5 ? -1 : 1
    const [edgeX, edgeY] = findNearestValidEdgePoint(
      prng, width, height,
      branchPointX, branchPointY,
      dirX, dirY,
      desiredSide,
      data,
      edgeCells,
    )

    const branch = midpointDisplace(
      branchPointX, branchPointY,
      edgeX, edgeY,
      prng, roughness * 1.2, DISPLACEMENT_DECAY,
      width, height,
    )
    const smoothedBranch = smoothPath(branch, branchSmoothIter)

    const side = Math.sign(dirX * (edgeY - branchPointY) - dirY * (edgeX - branchPointX))

    const nextBranchProgress = 0.55 + ((b + 1) / branchIndices.length) * 0.4
    stampRiver(
      data, width, height, smoothedBranch, branchWidth, 1.0, 0.3, noise2D,
      throttle((t) => onStatus?.({
        phase: 'Walking tributaries',
        progress: branchProgress + t * (nextBranchProgress - branchProgress),
        detail: `${b + 1} of ${branchIndices.length} branches placed`,
      })),
    )

    const reconnectPixels = ensureBranchConnects(data, width, height, smoothedBranch)
    branches.push({ origin: [branchPointX, branchPointY], points: smoothedBranch, side, desiredSide, reconnectPixels })
  }

  onStatus?.({ phase: 'Smoothing river edges', progress: 0.95 })

  smoothGrid(data, width, height, 1)

  onStatus?.({ phase: 'Done', progress: 1 })

  return { width, height, seed, centerline, smoothed, branches, waterMap: data }
}

export function generateRiversCore(
  params: RiverGenParams,
  onStatus?: (status: RiverGenStatus) => void,
): WaterMap {
  const trace = buildRiverTrace(params, onStatus)
  return { width: trace.width, height: trace.height, seed: trace.seed, data: trace.waterMap }
}
