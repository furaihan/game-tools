import type { RiverGenStatus } from '../types/river-generator'
import { strokeLineTapered } from './stamp'

function distSq(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x1 - x2
  const dy = y1 - y2
  return dx * dx + dy * dy
}

function straightenPath(path: [number, number][]): [number, number][] {
  if (path.length < 2) return path
  const [x0, y0] = path[0]
  const [x1, y1] = path[path.length - 1]
  const dist = Math.hypot(x1 - x0, y1 - y0)
  const steps = Math.max(1, Math.ceil(dist))
  const result: [number, number][] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    result.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t])
  }
  return result
}

interface CandidateEdge {
  labelA: number
  labelB: number
  cellA: number
  cellB: number
  totalDist: number
}

function isCloserToMainStem(
  cellA: number,
  cellB: number,
  mainStem: [number, number][],
  branchPaths: [number, number][][],
  width: number,
): boolean {
  const mx = (cellA % width + cellB % width) / 2
  const my = (Math.floor(cellA / width) + Math.floor(cellB / width)) / 2

  let minDistMainSq = Infinity
  for (let i = 0; i < mainStem.length; i++) {
    const d = distSq(mx, my, mainStem[i][0], mainStem[i][1])
    if (d < minDistMainSq) minDistMainSq = d
  }

  let minDistBranchSq = Infinity
  for (const bp of branchPaths) {
    for (let i = 0; i < bp.length; i++) {
      const d = distSq(mx, my, bp[i][0], bp[i][1])
      if (d < minDistBranchSq) minDistBranchSq = d
    }
  }

  return minDistMainSq <= minDistBranchSq
}

export function applyLandBridges(
  data: Uint8Array,
  width: number,
  height: number,
  mainStem: [number, number][],
  branchPaths: [number, number][][],
  mainStemWidth: number,
  branchWidth: number,
  prng: () => number,
  onStatus?: (status: RiverGenStatus) => void,
): void {
  const totalPixels = width * height

  onStatus?.({ phase: 'Analyzing land connectivity', progress: 0.92 })

  const landLabel = new Int32Array(totalPixels).fill(-1)
  let componentCount = 0
  const queue = new Int32Array(totalPixels)
  const dirs = [-width, width, -1, 1]

  for (let i = 0; i < totalPixels; i++) {
    if (data[i] !== 1 && landLabel[i] === -1) {
      const currentComp = componentCount++
      let qHead = 0
      let qTail = 0
      queue[qTail++] = i
      landLabel[i] = currentComp

      while (qHead < qTail) {
        const idx = queue[qHead++]
        const x = idx % width
        for (const d of dirs) {
          const nIdx = idx + d
          if (nIdx < 0 || nIdx >= totalPixels) continue
          if (Math.abs((nIdx % width) - x) > 1) continue
          if (data[nIdx] !== 1 && landLabel[nIdx] === -1) {
            landLabel[nIdx] = currentComp
            queue[qTail++] = nIdx
          }
        }
      }
    }
  }

  if (componentCount > 1) {
    onStatus?.({ phase: 'Building land bridges', progress: 0.95 })

    const waterLabel = new Int32Array(totalPixels).fill(-1)
    const waterParent = new Int32Array(totalPixels).fill(-1)
    const waterDist = new Int32Array(totalPixels).fill(0)
    let qHead = 0
    let qTail = 0

    for (let i = 0; i < totalPixels; i++) {
      if (data[i] === 1) {
        let adjacentLandComp = -1
        const x = i % width
        for (const d of dirs) {
          const nIdx = i + d
          if (nIdx < 0 || nIdx >= totalPixels) continue
          if (Math.abs((nIdx % width) - x) > 1) continue
          if (data[nIdx] !== 1) {
            adjacentLandComp = landLabel[nIdx]
            break
          }
        }
        if (adjacentLandComp !== -1) {
          waterLabel[i] = adjacentLandComp
          waterDist[i] = 1
          waterParent[i] = -1
          queue[qTail++] = i
        }
      }
    }

    const candidateEdges = new Map<string, CandidateEdge>()

    while (qHead < qTail) {
      const idx = queue[qHead++]
      const curLabel = waterLabel[idx]
      const curDist = waterDist[idx]
      const x = idx % width

      for (const d of dirs) {
        const nIdx = idx + d
        if (nIdx < 0 || nIdx >= totalPixels) continue
        if (Math.abs((nIdx % width) - x) > 1) continue
        if (data[nIdx] === 1) {
          const neighborLabel = waterLabel[nIdx]
          if (neighborLabel === -1) {
            waterLabel[nIdx] = curLabel
            waterDist[nIdx] = curDist + 1
            waterParent[nIdx] = idx
            queue[qTail++] = nIdx
          } else if (neighborLabel !== curLabel) {
            const labelA = Math.min(curLabel, neighborLabel)
            const labelB = Math.max(curLabel, neighborLabel)
            const key = `${labelA}_${labelB}`
            const totalDist = curDist + waterDist[nIdx]

            const existing = candidateEdges.get(key)
            if (!existing || totalDist < existing.totalDist) {
              candidateEdges.set(key, {
                labelA,
                labelB,
                cellA: idx,
                cellB: nIdx,
                totalDist,
              })
            }
          }
        }
      }
    }

    const edges = Array.from(candidateEdges.values()).sort((a, b) => a.totalDist - b.totalDist)
    const ufParent = new Int32Array(componentCount)
    for (let i = 0; i < componentCount; i++) ufParent[i] = i

      const find = (i: number): number => {
        let root = i
        while (ufParent[root] !== root) root = ufParent[root]
        let curr = i
        while (curr !== root) {
          const nxt = ufParent[curr]
          ufParent[curr] = root
          curr = nxt
        }
        return root
      }

      const union = (i: number, j: number): boolean => {
        const rootI = find(i)
        const rootJ = find(j)
        if (rootI !== rootJ) {
          ufParent[rootI] = rootJ
          return true
        }
        return false
      }

    const chosenEdges: CandidateEdge[] = []
    let setsCount = componentCount
    for (const edge of edges) {
      if (union(edge.labelA, edge.labelB)) {
        chosenEdges.push(edge)
        setsCount--
        if (setsCount === 1) break
      }
    }

    for (const edge of chosenEdges) {
      const pathA: [number, number][] = []
      let curr = edge.cellA
      while (curr !== -1 && data[curr] === 1) {
        pathA.push([curr % width, Math.floor(curr / width)])
        curr = waterParent[curr]
      }

      const pathB: [number, number][] = []
      curr = edge.cellB
      while (curr !== -1 && data[curr] === 1) {
        pathB.push([curr % width, Math.floor(curr / width)])
        curr = waterParent[curr]
      }

      const fullPath: [number, number][] = []
      for (let i = pathA.length - 1; i >= 0; i--) {
        fullPath.push(pathA[i])
      }
      for (let i = 0; i < pathB.length; i++) {
        fullPath.push(pathB[i])
      }

      if (fullPath.length > 0) {
        const isMain = isCloserToMainStem(edge.cellA, edge.cellB, mainStem, branchPaths, width)
        const refWidth = isMain ? mainStemWidth : branchWidth
        const minW = Math.max(1, refWidth - 1)
        const maxW = refWidth * 2
        let bridgeRadius = minW + prng() * (maxW - minW)

        const straightPath = straightenPath(fullPath)
        const maxAllowedRadius = straightPath.length * 0.35
        bridgeRadius = Math.min(bridgeRadius, Math.max(1, maxAllowedRadius))

        strokeLineTapered(data, width, height, straightPath, bridgeRadius, bridgeRadius, 0)
      }
    }
  }
}
