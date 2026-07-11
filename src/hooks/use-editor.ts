import { useCallback } from 'react'
import { usePipelineContext } from '@/context/pipeline-context'
import { useEditorContext } from '@/context/editor-context'
import { HistoryStack, extractRegion, applyRegion } from '@/core/history'

const history = new HistoryStack()

export function useEditor() {
  const { editMask, setEditMask, editedLabels, setEditedLabels, classificationResult } = usePipelineContext()
  const { activeBiomeIndex, brushSize } = useEditorContext()

  const paintPixels = useCallback(
    (
      x: number,
      y: number,
      width: number,
      height: number,
    ) => {
      if (!editedLabels && !classificationResult) return

      const labels = editedLabels || classificationResult!.labels
      const newLabels = new Uint8Array(labels)

      const halfSize = Math.floor(brushSize / 2)
      const xMin = Math.max(0, x - halfSize)
      const xMax = Math.min(width - 1, x + halfSize)
      const yMin = Math.max(0, y - halfSize)
      const yMax = Math.min(height - 1, y + halfSize)

      const bbox: [number, number, number, number] = [
        xMin,
        yMin,
        xMax - xMin + 1,
        yMax - yMin + 1,
      ]
      const before = extractRegion(labels, width, bbox)

      for (let py = yMin; py <= yMax; py++) {
        for (let px = xMin; px <= xMax; px++) {
          newLabels[py * width + px] = activeBiomeIndex
        }
      }

      const after = extractRegion(newLabels, width, bbox)
      history.push({ bbox, before, after })

      setEditedLabels(newLabels)

      const newMask = new Map(editMask)
      for (let py = yMin; py <= yMax; py++) {
        for (let px = xMin; px <= xMax; px++) {
          newMask.set(py * width + px, activeBiomeIndex)
        }
      }
      setEditMask(newMask)
    },
    [editedLabels, classificationResult, brushSize, activeBiomeIndex, editMask, setEditMask, setEditedLabels],
  )

  const fillRegion = useCallback(
    (x: number, y: number, width: number, height: number) => {
      if (!editedLabels && !classificationResult) return

      const labels = editedLabels || classificationResult!.labels
      const targetLabel = labels[y * width + x]
      const newLabels = new Uint8Array(labels)

      const visited = new Uint8Array(width * height)
      const queue: number[] = [y * width + x]
      visited[y * width + x] = 1
      const affected: number[] = []

      while (queue.length > 0) {
        const idx = queue.shift()!
        affected.push(idx)

        const px = idx % width
        const py = Math.floor(idx / width)

        const neighbors = []
        if (px > 0) neighbors.push(idx - 1)
        if (px < width - 1) neighbors.push(idx + 1)
        if (py > 0) neighbors.push(idx - width)
        if (py < height - 1) neighbors.push(idx + width)

        for (const n of neighbors) {
          if (!visited[n] && labels[n] === targetLabel && newLabels[n] !== activeBiomeIndex) {
            visited[n] = 1
            queue.push(n)
          }
        }
      }

      if (affected.length === 0) return

      let minX = width,
        minY = height,
        maxX = 0,
        maxY = 0
      const before = new Uint8Array(affected.length)

      affected.forEach((idx, i) => {
        const px = idx % width
        const py = Math.floor(idx / width)
        before[i] = labels[idx]
        newLabels[idx] = activeBiomeIndex
        minX = Math.min(minX, px)
        maxX = Math.max(maxX, px)
        minY = Math.min(minY, py)
        maxY = Math.max(maxY, py)
      })

      const bbox: [number, number, number, number] = [
        minX,
        minY,
        maxX - minX + 1,
        maxY - minY + 1,
      ]
      const after = extractRegion(newLabels, width, bbox)
      history.push({ bbox, before: extractRegion(labels, width, bbox), after })

      setEditedLabels(newLabels)

      const newMask = new Map(editMask)
      for (const idx of affected) {
        newMask.set(idx, activeBiomeIndex)
      }
      setEditMask(newMask)
    },
    [editedLabels, classificationResult, activeBiomeIndex, editMask, setEditMask, setEditedLabels],
  )

  const eyedropper = useCallback(
    (x: number, y: number, width: number): number | null => {
      if (!editedLabels && !classificationResult) return null
      const labels = editedLabels || classificationResult!.labels
      return labels[y * width + x]
    },
    [editedLabels, classificationResult],
  )

  const undo = useCallback(() => {
    const action = history.undo()
    if (!action || !editedLabels) return

    const labels = new Uint8Array(editedLabels)
    applyRegion(labels, classificationResult?.width || 0, action.bbox, action.before)
    setEditedLabels(labels)
  }, [editedLabels, classificationResult, setEditedLabels])

  const redo = useCallback(() => {
    const action = history.redo()
    if (!action || !editedLabels) return

    const labels = new Uint8Array(editedLabels)
    applyRegion(labels, classificationResult?.width || 0, action.bbox, action.after)
    setEditedLabels(labels)
  }, [editedLabels, classificationResult, setEditedLabels])

  const resetEdits = useCallback(() => {
    history.reset()
    setEditMask(new Map())
    setEditedLabels(null as unknown as Uint8Array)
  }, [setEditMask, setEditedLabels])

  return {
    paintPixels,
    fillRegion,
    eyedropper,
    undo,
    redo,
    resetEdits,
    canUndo: history.canUndo.bind(history),
    canRedo: history.canRedo.bind(history),
  }
}
