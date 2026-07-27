import type { WaterMap, RiverGenParams, RiverGenStatus } from '../types/river-generator'
import { createPRNG } from '@/features/biome-generator/core/prng'
import { createNoise2D } from './noise'
import { strokeLineTapered } from './stamp'
import { applyLandBridges } from './land-bridge'

const STEP_SIZE = 3
const SAFE_DISTANCE = 15
const TARGET_REACH_DIST = 12
const MAX_WANDER = 0.9
const MAIN_STEM_MAX_STEPS = 3000
const BRANCH_MAX_STEPS = 1500
const MAX_TURN_RATE = 0.15
const GRID_CELL = 16
const AVOID_LOOKBACK = 30
const FALLBACK_MAX_STEPS = 500
const REPULSION_STRENGTH = 0.6

function pickEdgePoint(prng: () => number, width: number, height: number, edge: number): [number, number] {
  switch (edge) {
    case 0: return [0, Math.floor(prng() * height)]
    case 1: return [width - 1, Math.floor(prng() * height)]
    case 2: return [Math.floor(prng() * width), 0]
    default: return [Math.floor(prng() * width), height - 1]
  }
}

function distSq(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x1 - x2
  const dy = y1 - y2
  return dx * dx + dy * dy
}

function pickEdgePointNear(
  prng: () => number,
  width: number,
  height: number,
  tx: number,
  ty: number,
  maxDist: number,
): [number, number] {
  for (let attempt = 0; attempt < 30; attempt++) {
    const edge = Math.floor(prng() * 4)
    const [x, y] = pickEdgePoint(prng, width, height, edge)
    if (distSq(x, y, tx, ty) <= maxDist * maxDist) return [x, y]
  }
  let best: [number, number] = [0, 0]
  let bestDist = Infinity
  for (let edge = 0; edge < 4; edge++) {
    const [x, y] = pickEdgePoint(prng, width, height, edge)
    const d = distSq(x, y, tx, ty)
    if (d < bestDist) {
      bestDist = d
      best = [x, y]
    }
  }
  return best
}

function walkPath(
  sx: number,
  sy: number,
  tx: number,
  ty: number,
  noise2D: (x: number, y: number) => number,
  noiseScale: number,
  maxSteps: number,
  mapWidth: number,
  mapHeight: number,
): [number, number][] {
  const points: [number, number][] = []
  let x = sx
  let y = sy
  const startDistSq = distSq(sx, sy, tx, ty)
  let heading = Math.atan2(ty - sy, tx - sx)

  const gridW = Math.ceil(Math.max(mapWidth, 1) / GRID_CELL) + 2
  const gridH = Math.ceil(Math.max(mapHeight, 1) / GRID_CELL) + 2
  const grid = new Int32Array(gridW * gridH)

  function gridMark(gx: number, gy: number, step: number) {
    if (gx >= 0 && gx < gridW && gy >= 0 && gy < gridH) {
      grid[gy * gridW + gx] = step + 1
    }
  }

  function gridRepulsion(x: number, y: number, step: number): number {
    const gx = Math.floor(x / GRID_CELL)
    const gy = Math.floor(y / GRID_CELL)
    let rx = 0
    let ry = 0
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const cx = gx + dx
        const cy = gy + dy
        if (cx < 0 || cx >= gridW || cy < 0 || cy >= gridH) continue
        const visited = grid[cy * gridW + cx]
        if (visited === 0) continue
        if (step + 1 - visited <= AVOID_LOOKBACK) continue
        const ccx = cx * GRID_CELL + GRID_CELL / 2
        const ccy = cy * GRID_CELL + GRID_CELL / 2
        const dx2 = x - ccx
        const dy2 = y - ccy
        const d2 = dx2 * dx2 + dy2 * dy2
        if (d2 < 1) continue
        const d = Math.sqrt(d2)
        rx += dx2 / d
        ry += dy2 / d
      }
    }
    if (rx === 0 && ry === 0) return 0
    return Math.atan2(ry, rx)
  }

  for (let i = 0; i < maxSteps; i++) {
    points.push([x, y])
    gridMark(Math.floor(x / GRID_CELL), Math.floor(y / GRID_CELL), i)

    const dSq = distSq(x, y, tx, ty)
    if (dSq < TARGET_REACH_DIST * TARGET_REACH_DIST) break

    const targetAngle = Math.atan2(ty - y, tx - x)
    const noiseVal = noise2D(x / noiseScale, y / noiseScale)

    const distRatio = Math.sqrt(dSq / startDistSq)
    const stepRatio = 1 - i / maxSteps
    const damping = Math.min(distRatio, Math.min(1.0, 2.0 * stepRatio))

    const wanderAngle = noiseVal * MAX_WANDER * damping
    const repulsionAngle = gridRepulsion(x, y, i)

    const desired = targetAngle + wanderAngle + repulsionAngle * REPULSION_STRENGTH
    let diff = desired - heading
    diff = Math.atan2(Math.sin(diff), Math.cos(diff))
    const maxTurn = MAX_TURN_RATE * Math.max(0.05, damping)
    heading += Math.max(-maxTurn, Math.min(maxTurn, diff))
    x += STEP_SIZE * Math.cos(heading)
    y += STEP_SIZE * Math.sin(heading)
  }

  if (distSq(x, y, tx, ty) >= TARGET_REACH_DIST * TARGET_REACH_DIST) {
    for (let j = 0; j < FALLBACK_MAX_STEPS; j++) {
      const dx = tx - x
      const dy = ty - y
      const d2 = dx * dx + dy * dy
      if (d2 < TARGET_REACH_DIST * TARGET_REACH_DIST) break
      const a = Math.atan2(dy, dx)
      x += STEP_SIZE * Math.cos(a)
      y += STEP_SIZE * Math.sin(a)
      points.push([x, y])
    }
  }

  return points
}

function walkBranch(
  sx: number,
  sy: number,
  tx: number,
  ty: number,
  noise2D: (x: number, y: number) => number,
  noiseScale: number,
  maxSteps: number,
  data: Uint8Array,
  width: number,
  height: number,
): [number, number][] {
  const points: [number, number][] = []
  let x = sx
  let y = sy
  let safeDistance = false
  const startDistSq = distSq(sx, sy, tx, ty)
  let heading = Math.atan2(ty - sy, tx - sx)

  for (let i = 0; i < maxSteps; i++) {
    const px = Math.round(x)
    const py = Math.round(y)

    if (safeDistance && px >= 0 && px < width && py >= 0 && py < height) {
      if (data[py * width + px] === 1) break
    }

    points.push([x, y])

    if (!safeDistance && distSq(sx, sy, x, y) > SAFE_DISTANCE * SAFE_DISTANCE) {
      safeDistance = true
    }

    const dSq = distSq(x, y, tx, ty)
    if (dSq < TARGET_REACH_DIST * TARGET_REACH_DIST) break

    const targetAngle = Math.atan2(ty - y, tx - x)
    const noiseVal = noise2D(x / noiseScale, y / noiseScale)

    const distRatio = Math.sqrt(dSq / startDistSq)
    const stepRatio = 1 - i / maxSteps
    const damping = Math.min(distRatio, Math.min(1.0, 2.0 * stepRatio))

    const wanderAngle = noiseVal * MAX_WANDER * damping

    const desired = targetAngle + wanderAngle
    let diff = desired - heading
    diff = Math.atan2(Math.sin(diff), Math.cos(diff))
    const maxTurn = MAX_TURN_RATE * Math.max(0.05, damping)
    heading += Math.max(-maxTurn, Math.min(maxTurn, diff))
    x += STEP_SIZE * Math.cos(heading)
    y += STEP_SIZE * Math.sin(heading)
  }

  return points
}


export function generateRiversCore(
  params: RiverGenParams,
  onStatus?: (status: RiverGenStatus) => void,
): WaterMap {
  const { width, height, seed, branchCount, mainStemWidth, branchWidth, noiseScale, createLandBridge } = params

  const data = new Uint8Array(width * height)
  const prng = createPRNG(seed)
  const noise2D = createNoise2D(seed + 1)

  onStatus?.({ phase: 'Picking river source', progress: 0 })

  const startEdge = Math.floor(prng() * 4)
  const oppositeEdge = startEdge % 2 === 0 ? startEdge + 1 : startEdge - 1
  let targetEdge: number
  if (prng() < 0.7) {
    targetEdge = oppositeEdge
  } else {
    const adjacents = [0, 1, 2, 3].filter(e => e !== startEdge && e !== oppositeEdge)
    targetEdge = adjacents[Math.floor(prng() * adjacents.length)]
  }

  const [sx, sy] = pickEdgePoint(prng, width, height, startEdge)
  const [tx, ty] = pickEdgePoint(prng, width, height, targetEdge)

  onStatus?.({ phase: 'Walking main stem', progress: 0.1 })

  const mainStem = walkPath(sx, sy, tx, ty, noise2D, noiseScale, MAIN_STEM_MAX_STEPS, width, height)

  strokeLineTapered(data, width, height, mainStem, mainStemWidth * 0.5, mainStemWidth, 1)

  onStatus?.({ phase: 'Stamping main stem', progress: 0.5 })

  const branchTotal = Math.min(branchCount, Math.floor(mainStem.length / 10))
  const maxBranchDist = Math.max(width, height) * 0.55

  onStatus?.({ phase: 'Walking tributaries', progress: 0.55, detail: `0 of ${branchTotal} branches placed` })

  const branchPaths: [number, number][][] = []

  for (let b = 0; b < branchTotal; b++) {
    if (b % 2 === 0 || b === branchTotal - 1) {
      onStatus?.({
        phase: 'Walking tributaries',
        progress: 0.55 + (b / branchTotal) * 0.4,
        detail: `${b + 1} of ${branchTotal} branches placed`,
      })
    }

    const mainIdx = Math.floor(prng() * mainStem.length)
    const [targetX, targetY] = mainStem[mainIdx]

    const [branchSx, branchSy] = pickEdgePointNear(prng, width, height, targetX, targetY, maxBranchDist)

    const branch = walkBranch(
      branchSx, branchSy,
      targetX, targetY,
      noise2D, noiseScale,
      BRANCH_MAX_STEPS,
      data, width, height,
    )

    branchPaths.push(branch)
    strokeLineTapered(data, width, height, branch, branchWidth * 0.4, branchWidth * 0.9, 1)
  }

  if (createLandBridge) {
    applyLandBridges(data, width, height, mainStem, branchPaths, mainStemWidth, branchWidth, prng, onStatus)
  }

  onStatus?.({ phase: 'Done', progress: 1 })

  return { width, height, seed, data }
}
