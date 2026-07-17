import { useRef, useState, useEffect, useCallback } from 'react'
import { useBiomeGenerator } from '@/features/biome-generator/context/biome-generator-context'

function calcFitScale(
  imageW: number,
  imageH: number,
  containerW: number,
  containerH: number,
): number {
  if (imageW === 0 || imageH === 0 || containerW === 0 || containerH === 0) return 1
  const pad = 40
  return Math.min((containerW - pad) / imageW, (containerH - pad) / imageH, 1)
}

export function CanvasPreview() {
  const { biomeMap, biomes, isGenerating, isFiltering } = useBiomeGenerator()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)

  const [hoverInfo, setHoverInfo] = useState<{ x: number; y: number; name: string } | null>(null)
  const [scale, setScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const fit = useCallback(() => {
    if (!biomeMap || !viewportRef.current) return
    const rect = viewportRef.current.getBoundingClientRect()
    const s = calcFitScale(biomeMap.width, biomeMap.height, rect.width, rect.height)
    setScale(s)
    setPan({ x: 0, y: 0 })
  }, [biomeMap])

  useEffect(() => {
    if (!biomeMap || !canvasRef.current || biomes.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = biomeMap.width
    canvas.height = biomeMap.height
    ctx.imageSmoothingEnabled = false

    const img = ctx.createImageData(biomeMap.width, biomeMap.height)
    const hexToRgb = (h: string) => {
      const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h)
      return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : { r: 0, g: 0, b: 0 }
    }
    const cache = biomes.map(b => hexToRgb(b.color))

    for (let i = 0; i < biomeMap.data.length; i++) {
      const biomeIdx = biomeMap.data[i]
      const c = cache[biomeIdx] || { r: 0, g: 0, b: 0 }
      const p = i * 4
      img.data[p] = c.r
      img.data[p + 1] = c.g
      img.data[p + 2] = c.b
      img.data[p + 3] = 255
    }

    ctx.putImageData(img, 0, 0)

    requestAnimationFrame(() => fit())
  }, [biomeMap, biomes, fit])

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const ro = new ResizeObserver(() => { if (biomeMap) fit() })
    ro.observe(el)
    return () => ro.disconnect()
  }, [biomeMap, fit])

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const s = Math.max(0.1, Math.min(10, scale * Math.exp(-e.deltaY * 0.001)))
    setScale(s)
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button === 1 || e.button === 0) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
    }
    if (biomeMap && canvasRef.current) {
      const r = canvasRef.current.getBoundingClientRect()
      const x = Math.floor((e.clientX - r.left) / scale)
      const y = Math.floor((e.clientY - r.top) / scale)
      if (x >= 0 && x < biomeMap.width && y >= 0 && y < biomeMap.height) {
        const b = biomeMap.data[y * biomeMap.width + x]
        setHoverInfo({ x, y, name: biomes[b]?.name || 'Unknown' })
      } else {
        setHoverInfo(null)
      }
    }
  }

  const onPointerUp = () => setIsDragging(false)

  return (
    <div className="flex flex-1 flex-col w-full min-h-0">
      <div
        ref={viewportRef}
        className="relative flex flex-1 items-center justify-center overflow-hidden bg-muted/50"
        style={{
          backgroundImage: 'radial-gradient(oklch(0.2 0.02 350) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      >
        {/* Zoom controls... */}
        <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
          <span className="font-mono text-[10px] text-muted-foreground">
            ZOOM: {Math.round(scale * 100)}%
          </span>
          <button
            onClick={fit}
            className="cursor-pointer rounded border bg-background px-2 py-0.5 font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Fit
          </button>
        </div>

        {!biomeMap ? (
          <div className="text-muted-foreground font-mono text-sm">
            NO_LAYOUT_GENERATED
          </div>
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center cursor-move overflow-hidden"
            onWheel={onWheel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={() => {
              setIsDragging(false)
              setHoverInfo(null)
            }}
          >
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                transformOrigin: '0 0',
                lineHeight: 0,
              }}
            >
              <canvas
                ref={canvasRef}
                className={`shadow-2xl transition-opacity duration-300 ${
                  isGenerating || isFiltering ? 'opacity-50' : 'opacity-100'
                }`}
                style={{ imageRendering: scale >= 1 ? 'pixelated' : 'auto' }}
              />
            </div>
          </div>
        )}

        {(isGenerating || isFiltering) && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <div className="animate-pulse rounded-lg border bg-card px-6 py-3 font-mono text-xs uppercase tracking-widest text-primary shadow-2xl">
              {isGenerating ? 'Generating...' : 'Filtering...'}
            </div>
          </div>
        )}
      </div>

      <div className="flex h-8 shrink-0 items-center justify-between border-t bg-card px-6 font-mono text-[10px] text-muted-foreground">
        <span>CURSOR: {hoverInfo ? `X:${hoverInfo.x} Y:${hoverInfo.y}` : 'NO_ACTIVE_SELECTION'}</span>
        <span className="text-primary">{hoverInfo ? `Biome: ${hoverInfo.name}` : ''}</span>
      </div>
    </div>
  )
}
