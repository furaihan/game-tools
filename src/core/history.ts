/**
 * Diff-based command history for the manual edit mask.
 *
 * Each EditAction records:
 * - bbox: [x, y, w, h] bounding box of the changed region
 * - before: label values before the edit (for the bbox area)
 * - after: label values after the edit (for the bbox area)
 *
 * This avoids storing full-canvas snapshots (infeasible at 4K–16K).
 * History is capped at MAX_HISTORY actions, pruning oldest first.
 */

import type { EditAction } from '@/types'

export const MAX_HISTORY = 50

export class HistoryStack {
  private actions: EditAction[] = []
  private position: number = -1

  push(action: EditAction): void {
    this.actions = this.actions.slice(0, this.position + 1)
    this.actions.push(action)

    if (this.actions.length > MAX_HISTORY) {
      this.actions.shift()
    } else {
      this.position++
    }
  }

  undo(): EditAction | null {
    if (this.position < 0) return null
    const action = this.actions[this.position]
    this.position--
    return action
  }

  redo(): EditAction | null {
    if (this.position >= this.actions.length - 1) return null
    this.position++
    return this.actions[this.position]
  }

  canUndo(): boolean {
    return this.position >= 0
  }

  canRedo(): boolean {
    return this.position < this.actions.length - 1
  }

  reset(): void {
    this.actions = []
    this.position = -1
  }

  get size(): number {
    return this.actions.length
  }
}

export function extractRegion(
  labels: Uint8Array,
  width: number,
  bbox: [number, number, number, number],
): Uint8Array {
  const [x, y, w, h] = bbox
  const region = new Uint8Array(w * h)

  for (let row = 0; row < h; row++) {
    for (let col = 0; col < w; col++) {
      const srcIdx = (y + row) * width + (x + col)
      region[row * w + col] = labels[srcIdx]
    }
  }

  return region
}

export function applyRegion(
  labels: Uint8Array,
  width: number,
  bbox: [number, number, number, number],
  region: Uint8Array,
): void {
  const [x, y, w, h] = bbox

  for (let row = 0; row < h; row++) {
    for (let col = 0; col < w; col++) {
      const dstIdx = (y + row) * width + (x + col)
      labels[dstIdx] = region[row * w + col]
    }
  }
}
