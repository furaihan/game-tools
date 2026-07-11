import { useRef, useState, useCallback, useLayoutEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { usePipelineContext } from '@/context/pipeline-context'
import { useUIContext } from '@/context/ui-context'
import { cropToSquare, imageDataToBitmap } from '@/lib/canvas'

export function CropTool() {
  const { originalImage, setWorkingImage } = usePipelineContext()
  const { squareAction, setSquareAction, setUploadPhase } = useUIContext()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [cropRect, setCropRect] = useState({ x: 0, y: 0, size: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const rectStart = useRef({ x: 0, y: 0, size: 0 })

  // Initialize crop coordinates centered on the canvas
  const computeRect = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !canvas.width || !canvas.clientWidth) return false
    
    const s = Math.min(canvas.clientWidth, canvas.clientHeight)
    if (s <= 0) return false
    
    setCropRect({
      x: (canvas.clientWidth - s) / 2,
      y: (canvas.clientHeight - s) / 2,
      size: s,
    })
    return true
  }, [])

  // Instantly render image on canvas & observe layout for crop rect
  useLayoutEffect(() => {
    // Defer rendering until DOM is fully ready
    setTimeout(() => {
      const canvas = canvasRef.current
      if (!canvas || !originalImage || squareAction !== 'crop') return

      canvas.width = originalImage.width
      canvas.height = originalImage.height
      const ctx = canvas.getContext('2d')
      if (ctx) {
        imageDataToBitmap(originalImage).then((bitmap) => {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(bitmap, 0, 0)
          bitmap.close()
        }).catch((err) => {
          console.error('CropTool: Rendering failed:', err)
        })
      }

      if (computeRect()) return

      const ro = new ResizeObserver(() => {
        if (computeRect()) ro.disconnect()
      })
      ro.observe(canvas)
    }, 100);
    
    return () => { /* cleanup if needed */ }
  }, [originalImage, squareAction, computeRect])

  const getImgCoords = useCallback((clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    return { x: clientX - rect.left, y: clientY - rect.top }
  }, [])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const pos = getImgCoords(e.clientX, e.clientY)
      const r = cropRect

      const onBottomRight =
        Math.abs(pos.x - (r.x + r.size)) < 8 && Math.abs(pos.y - (r.y + r.size)) < 8

      if (onBottomRight) {
        setIsResizing(true)
        dragStart.current = pos
        rectStart.current = { ...r }
      } else if (
        pos.x >= r.x && pos.x <= r.x + r.size &&
        pos.y >= r.y && pos.y <= r.y + r.size
      ) {
        setIsDragging(true)
        dragStart.current = pos
        rectStart.current = { ...r }
      }
    },
    [cropRect, getImgCoords],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging && !isResizing) return
      const canvas = canvasRef.current
      if (!canvas) return

      const pos = getImgCoords(e.clientX, e.clientY)
      const displayW = canvas.clientWidth
      const displayH = canvas.clientHeight

      if (isResizing) {
        const dx = pos.x - dragStart.current.x
        const dy = pos.y - dragStart.current.y
        
        // Ensure the square remains fully inside bounds during resize
        const maxAllowedSize = Math.min(
          displayW - rectStart.current.x,
          displayH - rectStart.current.y
        )
        const newSize = Math.min(
          maxAllowedSize,
          Math.max(50, rectStart.current.size + Math.max(dx, dy))
        )
        setCropRect((prev) => ({ ...prev, size: newSize }))
      } else if (isDragging) {
        const dx = pos.x - dragStart.current.x
        const dy = pos.y - dragStart.current.y

        // Restrict drag coordinates within canvas limits
        const x = Math.max(0, Math.min(displayW - rectStart.current.size, rectStart.current.x + dx))
        const y = Math.max(0, Math.min(displayH - rectStart.current.size, rectStart.current.y + dy))
        setCropRect((prev) => ({ ...prev, x, y }))
      }
    },
    [isDragging, isResizing, getImgCoords],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
  }, [])

  const handleConfirm = () => {
    const canvas = canvasRef.current
    if (!originalImage || !canvas) return

    const displayW = canvas.clientWidth
    const displayH = canvas.clientHeight
    if (displayW <= 0 || displayH <= 0) {
      console.warn('CropTool: canvas has no layout', { displayW, displayH })
      return
    }

    const scaleX = originalImage.width / displayW
    const scaleY = originalImage.height / displayH

    const imgX = Math.round(cropRect.x * scaleX)
    const imgY = Math.round(cropRect.y * scaleY)
    const imgSize = Math.round(cropRect.size * scaleX)

    if (imgSize <= 0) return

    const cropped = cropToSquare(
      originalImage, 
      Math.max(0, imgX), 
      Math.max(0, imgY), 
      Math.max(1, imgSize)
    )
    setWorkingImage(cropped)
    setSquareAction(null)
    setUploadPhase('processing')
  }

  if (squareAction !== 'crop' || !originalImage) return null

  return (
    <Dialog open onOpenChange={() => setSquareAction(null)}>
      <DialogContent className="max-w-[90vw] sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Crop to Square</DialogTitle>
          <DialogDescription>
            Drag the crop area or resize from the bottom-right corner.
          </DialogDescription>
        </DialogHeader>

        <div
          ref={containerRef}
          className="relative flex items-center justify-center select-none overflow-hidden rounded-lg bg-muted/20 p-4"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="relative inline-block max-w-full leading-none overflow-hidden rounded-lg border bg-background">
            <canvas
              ref={canvasRef}
              className="block max-w-full max-h-[60vh] h-auto w-auto object-contain"
            />
            {cropRect.size > 0 && (
              <div
                className="absolute border-2 border-primary shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] cursor-move pointer-events-auto"
                style={{
                  left: cropRect.x,
                  top: cropRect.y,
                  width: cropRect.size,
                  height: cropRect.size,
                }}
              >
                <div
                  className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize rounded-sm bg-primary pointer-events-auto"
                  style={{ transform: 'translate(50%, 50%)' }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setSquareAction(null)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Crop & Continue</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
