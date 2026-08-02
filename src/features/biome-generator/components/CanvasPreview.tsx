import { useRef, useState, useEffect, useCallback } from 'react'
import { useBiomeGenerator, type BrushRect } from '@/features/biome-generator/context/biome-generator-context'
import { CanvasViewport } from '@/shared/canvas/CanvasViewport'
import { GeneratingOverlay } from '@/shared/canvas/GeneratingOverlay'
import { CanvasStatusBar } from '@/shared/canvas/CanvasStatusBar'
import { BrushToolbar } from '@/features/river-generator/components/BrushToolbar'

const hexToRgb = (h: string) => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h)
  return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : { r: 0, g: 0, b: 0 }
}

export function CanvasPreview() {
  const {
    biomeMap,
    biomes,
    isGenerating,
    isFiltering,
    generationStatus,
    waterMap,
    waterColor,
    isGeneratingRivers,
    riverGenerationStatus,
    paintTool,
    brushShape,
    brushSize,
    beginWaterStroke,
    applyBrush,
  } = useBiomeGenerator()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<ImageData | null>(null)
  const [hoverInfo, setHoverInfo] = useState<{ x: number; y: number; name: string } | null>(null)

  const generatingStates = [
    { active: isGenerating, label: 'Generating Biome Layout…', status: generationStatus ? { phase: generationStatus.phase, progress: generationStatus.progress } : undefined },
    { active: isFiltering, label: 'Applying Majority Filter…' },
    { active: isGeneratingRivers, label: 'Generating Rivers…', status: riverGenerationStatus ? { phase: riverGenerationStatus.phase, progress: riverGenerationStatus.progress } : undefined },
  ]

  // Full rebuild only on discrete changes (generation, filter, color, undo/new WaterMap).
  // NOTE: brush strokes mutate waterMap.data in place and repaint only their dirty rect
  // in `paintDirtyRect` — do not add any per-stroke version/state here, that would force
  // an O(N^2) rebuild (or a full context re-render) on every pointermove.
  useEffect(() => {
    if (!biomeMap || !canvasRef.current || biomes.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = biomeMap.width
    canvas.height = biomeMap.height
    ctx.imageSmoothingEnabled = false

    const img = ctx.createImageData(biomeMap.width, biomeMap.height)
    const cache = biomes.map((b) => hexToRgb(b.color))
    const waterRgb = hexToRgb(waterColor)

    for (let i = 0; i < biomeMap.data.length; i++) {
      let c
      if (waterMap && waterMap.data[i] === 1) {
        c = waterRgb
      } else {
        const biomeIdx = biomeMap.data[i]
        c = cache[biomeIdx] || { r: 0, g: 0, b: 0 }
      }
      const p = i * 4
      img.data[p] = c.r
      img.data[p + 1] = c.g
      img.data[p + 2] = c.b
      img.data[p + 3] = 255
    }

    imgRef.current = img
    ctx.putImageData(img, 0, 0)
  }, [biomeMap, biomes, waterMap, waterColor])

  const paintDirtyRect = useCallback(
    (rect: BrushRect) => {
      const img = imgRef.current
      const canvas = canvasRef.current
      if (!img || !canvas || !biomeMap) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const cache = biomes.map((b) => hexToRgb(b.color))
      const waterRgb = hexToRgb(waterColor)
      for (let y = rect.y0; y <= rect.y1; y++) {
        for (let x = rect.x0; x <= rect.x1; x++) {
          const i = y * biomeMap.width + x
          const c = waterMap && waterMap.data[i] === 1
            ? waterRgb
            : cache[biomeMap.data[i]] || { r: 0, g: 0, b: 0 }
          const p = i * 4
          img.data[p] = c.r
          img.data[p + 1] = c.g
          img.data[p + 2] = c.b
          img.data[p + 3] = 255
        }
      }
      ctx.putImageData(
        img,
        0,
        0,
        rect.x0,
        rect.y0,
        rect.x1 - rect.x0 + 1,
        rect.y1 - rect.y0 + 1
      )
    },
    [biomeMap, biomes, waterMap, waterColor]
  )

  const handleContentPaint = useCallback(
    (pos: { x: number; y: number } | null, phase: 'start' | 'move' | 'end') => {
      if (!pos || !waterMap) return
      if (phase === 'start') beginWaterStroke()
      if (phase === 'end') return
      const rect = applyBrush(pos.x, pos.y, paintTool === 'erase' ? 'erase' : 'add-water')
      if (rect) paintDirtyRect(rect)
    },
    [waterMap, paintTool, beginWaterStroke, applyBrush, paintDirtyRect]
  )

  const statusTool = paintTool !== 'pan'
    ? ` | TOOL: ${paintTool.toUpperCase()} ${brushShape.toUpperCase()} r=${brushSize}`
    : ''

  return (
    <div className="flex flex-1 flex-col w-full min-h-0">
      <CanvasViewport
        contentWidth={biomeMap?.width ?? 0}
        contentHeight={biomeMap?.height ?? 0}
        showPlaceholder={!biomeMap}
        interactionMode={paintTool !== 'pan' ? 'paint' : 'pan'}
        toolbarSlot={<BrushToolbar />}
        onContentPaint={handleContentPaint}
        onContentPointerMove={(pos) => {
          if (!pos || !biomeMap || biomes.length === 0) {
            setHoverInfo(null)
            return
          }
          const idx = pos.y * biomeMap.width + pos.x
          let name: string
          if (waterMap && waterMap.data[idx] === 1) {
            name = 'Water (River)'
          } else {
            const b = biomeMap.data[pos.y * biomeMap.width + pos.x]
            name = biomes[b]?.name || 'Unknown'
          }
          setHoverInfo({ x: pos.x, y: pos.y, name })
        }}
      >
        {({ scale }) => (
          <div
            className="relative"
            style={{ width: biomeMap?.width, height: biomeMap?.height, lineHeight: 0 }}
          >
            <canvas
              ref={canvasRef}
              className={`block shadow-2xl transition-opacity duration-300 ${
                isGenerating || isFiltering || isGeneratingRivers ? 'opacity-50' : 'opacity-100'
              }`}
              style={{ imageRendering: scale >= 1 ? 'pixelated' : 'auto' }}
            />
            {paintTool !== 'pan' && hoverInfo && (
              <div
                className="pointer-events-none absolute border-2 border-white/80 bg-white/10"
                style={{
                  left: hoverInfo.x,
                  top: hoverInfo.y,
                  width: brushSize * 2,
                  height: brushSize * 2,
                  transform: 'translate(-50%, -50%)',
                  borderRadius: brushShape === 'circle' ? '9999px' : '0',
                }}
              />
            )}
          </div>
        )}
      </CanvasViewport>

      <GeneratingOverlay states={generatingStates} />

      <CanvasStatusBar
        cursorPosition={hoverInfo ? { x: hoverInfo.x, y: hoverInfo.y } : null}
        infoSlot={hoverInfo ? `Biome: ${hoverInfo.name}${statusTool}` : ''}
      />
    </div>
  )
}
