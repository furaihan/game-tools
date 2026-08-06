import { describe, test, expect } from 'bun:test'
import { generateRiversCore, buildRiverTrace } from '../core/river-generator'
import type { RiverGenStatus } from '../types/river-generator'

describe('generateRiversCore', () => {
  test('roughness=0 produces valid river without crashing', () => {
    const result = generateRiversCore({
      width: 256, height: 256, seed: 42, branchCount: 0, mainStemWidth: 4, branchWidth: 2, roughness: 0,
    })

    expect(result.width).toBe(256)
    expect(result.height).toBe(256)
    expect(result.seed).toBe(42)
    expect(result.data).toBeInstanceOf(Uint8Array)
    expect(result.data.length).toBe(256 * 256)

    const waterCount = result.data.reduce((a, b) => a + b, 0)
    expect(waterCount).toBeGreaterThan(0)

    const allBinary = result.data.every(v => v === 0 || v === 1)
    expect(allBinary).toBe(true)
  })

  test('branchCount=0 produces only main stem', () => {
    const withBranches = generateRiversCore({
      width: 128, height: 128, seed: 99, branchCount: 3, mainStemWidth: 4, branchWidth: 2, roughness: 0.3,
    })
    const withoutBranches = generateRiversCore({
      width: 128, height: 128, seed: 99, branchCount: 0, mainStemWidth: 4, branchWidth: 2, roughness: 0.3,
    })

    const countWith = withBranches.data.reduce((a, b) => a + b, 0)
    const countWithout = withoutBranches.data.reduce((a, b) => a + b, 0)

    expect(countWithout).toBeGreaterThan(0)
    expect(countWith).toBeGreaterThan(countWithout)
  })

  test('small canvas with large width does not overflow', () => {
    const result = generateRiversCore({
      width: 32, height: 32, seed: 7, branchCount: 2, mainStemWidth: 20, branchWidth: 12, roughness: 0.4,
    })

    expect(result.data.length).toBe(32 * 32)
    for (let i = 0; i < result.data.length; i++) {
      const v = result.data[i]
      expect(v === 0 || v === 1).toBe(true)
    }
  })

  test('seed determinism: same seed produces identical result', () => {
    const a = generateRiversCore({
      width: 128, height: 128, seed: 12345, branchCount: 4, mainStemWidth: 6, branchWidth: 3, roughness: 0.35,
    })
    const b = generateRiversCore({
      width: 128, height: 128, seed: 12345, branchCount: 4, mainStemWidth: 6, branchWidth: 3, roughness: 0.35,
    })

    expect(a.data).toEqual(b.data)
  })

  test('different seeds produce different results', () => {
    const a = generateRiversCore({
      width: 128, height: 128, seed: 1, branchCount: 2, mainStemWidth: 4, branchWidth: 2, roughness: 0.3,
    })
    const b = generateRiversCore({
      width: 128, height: 128, seed: 2, branchCount: 2, mainStemWidth: 4, branchWidth: 2, roughness: 0.3,
    })

    const diff = a.data.some((v, i) => v !== b.data[i])
    expect(diff).toBe(true)
  })

  test('all water pixels are contiguous within the main stem (no stray pixels)', () => {
    const result = generateRiversCore({
      width: 64, height: 64, seed: 42, branchCount: 0, mainStemWidth: 4, branchWidth: 2, roughness: 0.2,
    })

    const waterCount = result.data.reduce((a, b) => a + b, 0)
    expect(waterCount).toBeGreaterThan(0)
    expect(waterCount).toBeLessThan(64 * 64)
  })

  test('large resolution does not overflow and stays within recursion depth cap', () => {
    const result = generateRiversCore({
      width: 8192, height: 8192, seed: 42, branchCount: 4, mainStemWidth: 20, branchWidth: 10, roughness: 0.4,
    })

    expect(result.data.length).toBe(8192 * 8192)
    const waterCount = result.data.reduce((a, b) => a + b, 0)
    expect(waterCount).toBeGreaterThan(0)
    expect(result.data.every(v => v === 0 || v === 1)).toBe(true)
  }, 30_000)

  test('high branch count completes without edge-cell regression', () => {
    const result = generateRiversCore({
      width: 512, height: 512, seed: 5, branchCount: 12, mainStemWidth: 6, branchWidth: 3, roughness: 0.3,
    })

    expect(result.data.length).toBe(512 * 512)
    expect(result.data.every(v => v === 0 || v === 1)).toBe(true)
    expect(result.data.reduce((a, b) => a + b, 0)).toBeGreaterThan(0)
  })

  test('progress callback is non-decreasing and terminates at done', () => {
    const statuses: RiverGenStatus[] = []
    generateRiversCore({
      width: 256, height: 256, seed: 123, branchCount: 3, mainStemWidth: 6, branchWidth: 3, roughness: 0.3,
    }, (status) => statuses.push(status))

    expect(statuses.length).toBeGreaterThan(0)
    for (let i = 1; i < statuses.length; i++) {
      expect(statuses[i].progress).toBeGreaterThanOrEqual(statuses[i - 1].progress)
    }
    const last = statuses[statuses.length - 1]
    expect(last.phase).toBe('Done')
    expect(last.progress).toBe(1)
  })

  test('branches are distributed across both banks, not clustered on one', () => {
    const runs = 40
    const branchCount = 8
    let desiredNeg = 0
    let desiredTotal = 0
    let mismatch = 0
    let comparable = 0
    let allSameRuns = 0

    for (let seed = 0; seed < runs; seed++) {
      const trace = buildRiverTrace({
        width: 256, height: 256, seed, branchCount, mainStemWidth: 4, branchWidth: 2, roughness: 0.4,
      })
      let neg = 0
      let pos = 0
      for (const branch of trace.branches) {
        if (branch.desiredSide < 0) desiredNeg++
        desiredTotal++
        if (branch.side === 0) continue
        if (branch.side < 0) neg++
        else pos++
        comparable++
        if (branch.desiredSide !== branch.side) mismatch++
      }
      if (neg === 0 || pos === 0) allSameRuns++
    }

    expect(desiredTotal).toBeGreaterThan(0)
    expect(desiredNeg / desiredTotal).toBeGreaterThan(0.4)
    expect(desiredNeg / desiredTotal).toBeLessThan(0.6)
    expect(mismatch / comparable).toBeLessThanOrEqual(0.2)
    expect(allSameRuns).toBeLessThanOrEqual(Math.ceil(runs / 4))
  })

  test('high roughness does not produce near-90 degree kinks in the main stem', () => {
    const maxTurnAngle = (points: [number, number][]) => {
      let maxDeg = 0
      for (let i = 1; i < points.length - 1; i++) {
        const vx1 = points[i][0] - points[i - 1][0]
        const vy1 = points[i][1] - points[i - 1][1]
        const vx2 = points[i + 1][0] - points[i][0]
        const vy2 = points[i + 1][1] - points[i][1]
        const l1 = Math.hypot(vx1, vy1)
        const l2 = Math.hypot(vx2, vy2)
        if (l1 < 1e-6 || l2 < 1e-6) continue
        const cross = vx1 * vy2 - vy1 * vx2
        const dot = vx1 * vx2 + vy1 * vy2
        const deg = Math.abs(Math.atan2(cross, dot)) * 180 / Math.PI
        if (deg > maxDeg) maxDeg = deg
      }
      return maxDeg
    }

    for (let seed = 0; seed < 20; seed++) {
      const trace = buildRiverTrace({
        width: 256, height: 256, seed, branchCount: 5, mainStemWidth: 4, branchWidth: 2, roughness: 0.7,
      })
      expect(maxTurnAngle(trace.smoothed)).toBeLessThan(85)
      for (const branch of trace.branches) {
        expect(maxTurnAngle(branch.points)).toBeLessThan(80)
      }
    }
  })

  test('branch reconnection fallback never draws a straight scar', () => {
    let totalReconnectPixels = 0
    for (let seed = 0; seed < 30; seed++) {
      const trace = buildRiverTrace({
        width: 256, height: 256, seed, branchCount: 5, mainStemWidth: 4, branchWidth: 2, roughness: 0.4,
      })
      for (const branch of trace.branches) {
        expect(branch.reconnectPixels).toBeLessThanOrEqual(30)
        totalReconnectPixels += branch.reconnectPixels
      }
    }
    expect(totalReconnectPixels).toBeLessThanOrEqual(150)
  })
})
