import type { WaterMap, RiverGenParams, RiverGenStatus } from '../types/river-generator'
import { createPRNG } from '@/features/biome-generator/core/prng'
import { createNoise2D } from './noise'
import { stampCircle } from './stamp'

const STEP_SIZE = 3
const SAFE_DISTANCE = 15
const TARGET_REACH_DIST = 12
const MAX_WANDER = 0.9
const MAIN_STEM_MAX_STEPS = 3000
const BRANCH_MAX_STEPS = 1500

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

function walkPath(
  sx: number,
  sy: number,
  tx: number,
  ty: number,
  noise2D: (x: number, y: number) => number,
  noiseScale: number,
  maxSteps: number,
): [number, number][] {
  const points: [number, number][] = []
  let x = sx
  let y = sy
  const startDistSq = distSq(sx, sy, tx, ty)

  for (let i = 0; i < maxSteps; i++) {
    points.push([x, y])

    const dSq = distSq(x, y, tx, ty)
    if (dSq < TARGET_REACH_DIST * TARGET_REACH_DIST) break

    const dx = tx - x
    const dy = ty - y
    const targetAngle = Math.atan2(dy, dx)

    const noiseVal = noise2D(x / noiseScale, y / noiseScale)
    const wanderAngle = noiseVal * MAX_WANDER

    const angle = targetAngle + wanderAngle
    x += STEP_SIZE * Math.cos(angle)
    y += STEP_SIZE * Math.sin(angle)
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

    const dx = tx - x
    const dy = ty - y
    const targetAngle = Math.atan2(dy, dx)

    const noiseVal = noise2D(x / noiseScale, y / noiseScale)
    const wanderAngle = noiseVal * MAX_WANDER

    const angle = targetAngle + wanderAngle
    x += STEP_SIZE * Math.cos(angle)
    y += STEP_SIZE * Math.sin(angle)
  }

  return points
}

function strokeLine(
  data: Uint8Array,
  width: number,
  height: number,
  points: [number, number][],
  radius: number,
  value: number,
): void {
  for (const [px, py] of points) {
    stampCircle(data, width, height, px, py, radius, value)
  }
}

export function generateRiversCore(
  params: RiverGenParams,
  onStatus?: (status: RiverGenStatus) => void,
): WaterMap {
  const { width, height, seed, branchCount, mainStemWidth, branchWidth, noiseScale } = params

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

  const mainStem = walkPath(sx, sy, tx, ty, noise2D, noiseScale, MAIN_STEM_MAX_STEPS)

  strokeLine(data, width, height, mainStem, mainStemWidth, 1)

  onStatus?.({ phase: 'Stamping main stem', progress: 0.5 })

  const branchTotal = Math.min(branchCount, Math.floor(mainStem.length / 10))
  const branches: [number, number][][] = []

  onStatus?.({ phase: 'Walking tributaries', progress: 0.55, detail: `0 of ${branchTotal} branches placed` })

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

    const branchEdge = Math.floor(prng() * 4)
    const [branchSx, branchSy] = pickEdgePoint(prng, width, height, branchEdge)

    const branch = walkBranch(
      branchSx, branchSy,
      targetX, targetY,
      noise2D, noiseScale,
      BRANCH_MAX_STEPS,
      data, width, height,
    )

    branches.push(branch)
    strokeLine(data, width, height, branch, branchWidth, 1)
  }

  onStatus?.({ phase: 'Done', progress: 1 })

  return { width, height, seed, data }
}
