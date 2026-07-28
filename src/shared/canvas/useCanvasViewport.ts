import React, { useRef, useState, useEffect, useCallback } from "react"

export function useCanvasViewport({
  contentWidth,
  contentHeight,
}: {
  contentWidth: number
  contentHeight: number
}) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const fit = useCallback(() => {
    const el = viewportRef.current
    if (!el || contentWidth === 0 || contentHeight === 0) return
    const rect = el.getBoundingClientRect()
    const pad = 40
    const s = Math.max(
      0.05,
      Math.min(
        (rect.width - pad) / contentWidth,
        (rect.height - pad) / contentHeight,
        1
      )
    )
    setScale(s)
    setPan({ x: 0, y: 0 })
  }, [contentWidth, contentHeight])

  useEffect(() => {
    if (contentWidth > 0 && contentHeight > 0) {
      fit()
    }
  }, [contentWidth, contentHeight, fit])

  useEffect(() => {
    const el = viewportRef.current
    if (!el || contentWidth === 0 || contentHeight === 0) return
    const ro = new ResizeObserver(() => fit())
    ro.observe(el)
    return () => ro.disconnect()
  }, [contentWidth, contentHeight, fit])

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    setScale((s) => Math.max(0.1, Math.min(10, s * Math.exp(-e.deltaY * 0.001))))
  }, [])

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button === 0 || e.button === 1) {
        setIsDragging(true)
        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
      }
    },
    [pan]
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (isDragging) {
        setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
      }
    },
    [isDragging, dragStart]
  )

  const onPointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const onPointerLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  return {
    scale,
    pan,
    isDragging,
    viewportRef,
    fit,
    onWheel,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerLeave,
  }
}

export function screenToContent(
  clientX: number,
  clientY: number,
  viewportRef: React.RefObject<HTMLDivElement | null>,
  scale: number,
  pan: { x: number; y: number },
  contentWidth: number,
  contentHeight: number
): { x: number; y: number } | null {
  const viewport = viewportRef.current
  if (!viewport) return null
  const rect = viewport.getBoundingClientRect()
  const x = (clientX - rect.left) / scale
  const y = (clientY - rect.top) / scale
  const centerX = (rect.width - contentWidth * scale) / 2
  const centerY = (rect.height - contentHeight * scale) / 2
  const contentX = Math.floor(x - centerX / scale - pan.x / scale)
  const contentY = Math.floor(y - centerY / scale - pan.y / scale)
  if (
    contentX < 0 ||
    contentX >= contentWidth ||
    contentY < 0 ||
    contentY >= contentHeight
  ) {
    return null
  }
  return { x: contentX, y: contentY }
}