import { useRef, useEffect, useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Minimize2, Maximize2 } from 'lucide-react'

interface CanvasViewerProps {
  imageData: ImageData | null
  label?: string
  onCanvasClick?: (x: number, y: number) => void
  collapsible?: boolean
  collapsed?: boolean
  onToggleCollapse?: () => void
}

function useCanvasSize(
  containerRef: React.RefObject<HTMLDivElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
) {
  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const syncSize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
    }

    syncSize()
    const observer = new ResizeObserver(syncSize)
    observer.observe(container)
    return () => observer.disconnect()
  }, [containerRef, canvasRef])
}

export function CanvasViewer({ imageData, label, onCanvasClick, collapsible, onToggleCollapse }: CanvasViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  useCanvasSize(containerRef, canvasRef)

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !imageData) return
    if (imageData.data.buffer.byteLength === 0) return

    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.translate(pan.x, pan.y)
    ctx.scale(zoom, zoom)
    ctx.imageSmoothingEnabled = false

    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = imageData.width
    tempCanvas.height = imageData.height
    tempCanvas.getContext('2d')!.putImageData(imageData, 0, 0)

    ctx.drawImage(tempCanvas, 0, 0)
    ctx.restore()
  }, [imageData, zoom, pan])

  useEffect(() => { render() }, [render])

  const fitToScreen = useCallback(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas || !imageData) return

    const cw = container.clientWidth
    const ch = container.clientHeight
    const newZoom = Math.min((cw - 16) / imageData.width, (ch - 16) / imageData.height, 1)

    setZoom(newZoom)
    setPan({
      x: (cw - imageData.width * newZoom) / 2,
      y: (ch - imageData.height * newZoom) / 2,
    })
  }, [imageData])

  useEffect(() => {
    if (imageData) fitToScreen()
  }, [imageData, fitToScreen])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const observer = new ResizeObserver(() => fitToScreen())
    observer.observe(container)
    return () => observer.disconnect()
  }, [fitToScreen])

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      const newZoom = Math.max(0.1, Math.min(20, zoom * delta))
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      setPan({
        x: mouseX - (mouseX - pan.x) * (newZoom / zoom),
        y: mouseY - (mouseY - pan.y) * (newZoom / zoom),
      })
      setZoom(newZoom)
    },
    [zoom, pan],
  )

  const panStart = useRef({ x: 0, y: 0 })
  const isPanning = useRef(false)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isPanning.current = true
      panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }
    },
    [pan],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isPanning.current) return
      setPan({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y })
    },
    [],
  )

  const handleMouseUp = useCallback(() => { isPanning.current = false }, [])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!onCanvasClick || !imageData) return
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = Math.floor((e.clientX - rect.left - pan.x) / zoom)
      const y = Math.floor((e.clientY - rect.top - pan.y) / zoom)
      if (x >= 0 && x < imageData.width && y >= 0 && y < imageData.height) {
        onCanvasClick(x, y)
      }
    },
    [onCanvasClick, imageData, zoom, pan],
  )

  return (
    <div className="relative flex min-w-0 flex-1 flex-col">
      {label && (
        <div className="flex items-center justify-between px-1 pb-1">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          {collapsible && onToggleCollapse && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-muted-foreground hover:text-foreground"
              onClick={onToggleCollapse}
              title="Collapse panel"
            >
              <Minimize2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden rounded-lg border bg-card"
        style={{ minHeight: 200 }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(45deg, oklch(0.12 0.01 350) 25%, transparent 25%, transparent 75%, oklch(0.12 0.01 350) 75%), linear-gradient(45deg, oklch(0.12 0.01 350) 25%, transparent 25%, transparent 75%, oklch(0.12 0.01 350) 75%)',
            backgroundSize: '16px 16px',
            backgroundPosition: '0 0, 8px 8px',
          }}
        />
        <canvas
          ref={canvasRef}
          className="relative h-full w-full cursor-grab active:cursor-grabbing"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleClick}
        />
      </div>
      <div className="flex items-center justify-between pt-1">
        <span className="font-mono text-[11px] text-muted-foreground">
          {imageData ? `${imageData.width}x${imageData.height} @ ${Math.round(zoom * 100)}%` : ''}
        </span>
        <button
          className="text-[11px] text-muted-foreground transition-colors hover:text-foreground"
          onClick={fitToScreen}
        >
          Fit
        </button>
      </div>
    </div>
  )
}