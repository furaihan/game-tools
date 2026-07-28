import type { WaterMap, RiverGenParams, RiverGenStatus } from '../types/river-generator'
import { createPRNG } from '@/features/biome-generator/core/prng'
import { createNoise2D } from './noise'
import { stampCircle, strokeLineTapered } from './stamp'

const MIN_SEGMENT_LENGTH = 4
const DISPLACEMENT_DECAY = 0.55

function distSq(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x1 - x2
  const dy = y1 - y2
  return dx * dx + dy * dy
}

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

  const displacement = (prng() * 2 - 1) * roughness * d
  let mpx = mx + pdx * displacement
  let mpy = my + pdy * displacement
  mpx = Math.max(0, Math.min(width - 1, mpx))
  mpy = Math.max(0, Math.min(height - 1, mpy))

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
  const maxDepth = Math.ceil(Math.log2(Math.max(d, 1) / MIN_SEGMENT_LENGTH))
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

function findNearestValidEdgePoint(
  prng: () => number,
  width: number,
  height: number,
  fromX: number,
  fromY: number,
  mainRiverDirX: number,
  mainRiverDirY: number,
  data: Uint8Array,
): [number, number] {
  const marginY = Math.max(1, Math.floor(height * 0.1))
  const marginX = Math.max(1, Math.floor(width * 0.1))

  const candidates: { x: number; y: number; distSq: number }[] = []

  for (let y = marginY; y < height - marginY; y++) {
    const idx = y * width
    if (data[idx] === 0) {
      candidates.push({ x: 0, y, distSq: (0 - fromX) ** 2 + (y - fromY) ** 2 })
    }
    if (data[idx + width - 1] === 0) {
      candidates.push({ x: width - 1, y, distSq: (width - 1 - fromX) ** 2 + (y - fromY) ** 2 })
    }
  }
  for (let x = marginX; x < width - marginX; x++) {
    const idxTop = x
    if (data[idxTop] === 0) {
      candidates.push({ x, y: 0, distSq: (x - fromX) ** 2 + (0 - fromY) ** 2 })
    }
    const idxBottom = (height - 1) * width + x
    if (data[idxBottom] === 0) {
      candidates.push({ x, y: height - 1, distSq: (x - fromX) ** 2 + (height - 1 - fromY) ** 2 })
    }
  }

  if (candidates.length === 0) {
    return [Math.floor(prng() * width), Math.floor(prng() * height)]
  }

  const dirLen = Math.hypot(mainRiverDirX, mainRiverDirY)
  const ndx = dirLen > 0 ? mainRiverDirX / dirLen : 0
  const ndy = dirLen > 0 ? mainRiverDirY / dirLen : 0

  const awayCandidates = candidates.filter(c => {
    const ex = c.x - fromX
    const ey = c.y - fromY
    const elen = Math.hypot(ex, ey)
    if (elen < 1) return false
    const dot = (ex / elen) * ndx + (ey / elen) * ndy
    return dot < 0.5
  })

  const pool = awayCandidates.length > 0 ? awayCandidates : candidates
  pool.sort((a, b) => a.distSq - b.distSq)

  const best = pool[0]
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

function stampRiver(
  data: Uint8Array,
  width: number,
  height: number,
  points: [number, number][],
  baseWidth: number,
  startTaper: number,
  endTaper: number,
  noise2D: (x: number, y: number) => number,
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
  }
}

function ensureBranchConnects(
  data: Uint8Array,
  width: number,
  height: number,
  branch: [number, number][],
  targetX: number,
  targetY: number,
): void {
  if (branch.length === 0) return

  const lastX = branch[branch.length - 1][0]
  const lastY = branch[branch.length - 1][1]
  const lx = Math.round(lastX)
  const ly = Math.round(lastY)
  if (lx < 0 || lx >= width || ly < 0 || ly >= height) return

  const totalPixels = width * height
  const visited = new Uint8Array(totalPixels)
  const queue = new Int32Array(256)
  let qHead = 0
  let qTail = 0

  const startIdx = ly * width + lx
  if (startIdx < 0 || startIdx >= totalPixels) return
  visited[startIdx] = 1
  queue[qTail++] = startIdx

  let foundMainStem = false

  while (qHead < qTail && qTail < 250) {
    const idx = queue[qHead++]
    const x = idx % width
    const y = Math.floor(idx / width)

    if (distSq(x, y, targetX, targetY) < 4) {
      foundMainStem = true
      break
    }

    for (const d of [-width, width, -1, 1]) {
      const nIdx = idx + d
      if (nIdx < 0 || nIdx >= totalPixels) continue
      if (Math.abs((nIdx % width) - x) > 1) continue
      if (data[nIdx] !== 1 || visited[nIdx]) continue
      visited[nIdx] = 1
      queue[qTail++] = nIdx
    }
  }

  if (foundMainStem) return

  const dx = targetX - lastX
  const dy = targetY - lastY
  const dist = Math.hypot(dx, dy)
  if (dist < 0.5) return

  const steps = Math.max(1, Math.ceil(dist))
  const connector: [number, number][] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const px = Math.round(lastX + dx * t)
    const py = Math.round(lastY + dy * t)
    if (px >= 0 && px < width && py >= 0 && py < height) {
      connector.push([px, py])
      if (data[py * width + px] === 1) break
    }
  }

  if (connector.length > 1) {
    strokeLineTapered(data, width, height, connector, 1, 1, 1)
  }
}

function smoothGrid(data: Uint8Array, width: number, height: number, iterations: number): void {
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

export function generateRiversCore(
  params: RiverGenParams,
  onStatus?: (status: RiverGenStatus) => void,
): WaterMap {
  const { width, height, seed, branchCount, mainStemWidth, branchWidth, roughness } = params

  const data = new Uint8Array(width * height)
  const prng = createPRNG(seed)
  const noise2D = createNoise2D(seed + 1)

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
  const smoothed = smoothPath(centerline, 2)

  onStatus?.({ phase: 'Stamping main stem', progress: 0.35 })

  stampRiver(data, width, height, smoothed, mainStemWidth, 0.5, 1.0, noise2D)

  onStatus?.({ phase: 'Selecting branch points', progress: 0.5 })

  const branchIndices = selectBranchPoints(smoothed, branchCount, prng)

  onStatus?.({
    phase: 'Walking tributaries',
    progress: 0.55,
    detail: `0 of ${branchIndices.length} branches placed`,
  })

  for (let b = 0; b < branchIndices.length; b++) {
    onStatus?.({
      phase: 'Walking tributaries',
      progress: 0.55 + (b / branchIndices.length) * 0.4,
      detail: `${b + 1} of ${branchIndices.length} branches placed`,
    })

    const bpIdx = branchIndices[b]
    const [branchPointX, branchPointY] = smoothed[bpIdx]

    const prevIdx = Math.max(0, bpIdx - 1)
    const nextIdx = Math.min(smoothed.length - 1, bpIdx + 1)
    const dirX = smoothed[nextIdx][0] - smoothed[prevIdx][0]
    const dirY = smoothed[nextIdx][1] - smoothed[prevIdx][1]

    const [edgeX, edgeY] = findNearestValidEdgePoint(
      prng, width, height,
      branchPointX, branchPointY,
      dirX, dirY,
      data,
    )

    const branch = midpointDisplace(
      branchPointX, branchPointY,
      edgeX, edgeY,
      prng, roughness * 1.2, DISPLACEMENT_DECAY,
      width, height,
    )
    const smoothedBranch = smoothPath(branch, 2)

    stampRiver(data, width, height, smoothedBranch, branchWidth, 1.0, 0.3, noise2D)

    ensureBranchConnects(data, width, height, smoothedBranch, branchPointX, branchPointY)
  }

  onStatus?.({ phase: 'Smoothing river edges', progress: 0.95 })

  smoothGrid(data, width, height, 1)

  onStatus?.({ phase: 'Done', progress: 1 })

  return { width, height, seed, data }
}
