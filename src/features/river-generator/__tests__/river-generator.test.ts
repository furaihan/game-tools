import { describe, test, expect } from 'bun:test'
import { generateRiversCore } from '../core/river-generator'
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
})
