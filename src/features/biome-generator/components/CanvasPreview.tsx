import { useRef, useState, useEffect } from 'react'
import { useBiomeGenerator } from '@/features/biome-generator/context/biome-generator-context'
import { CanvasViewport } from '@/shared/canvas/CanvasViewport'
import { GeneratingOverlay } from '@/shared/canvas/GeneratingOverlay'
import { CanvasStatusBar } from '@/shared/canvas/CanvasStatusBar'

export function CanvasPreview() {
  const { biomeMap, biomes, isGenerating, isFiltering, generationStatus, waterMap, waterColor, isGeneratingRivers, riverGenerationStatus } = useBiomeGenerator()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoverInfo, setHoverInfo] = useState<{ x: number; y: number; name: string } | null>(null)

  const generatingStates = [
    { active: isGenerating, label: 'Generating Biome Layout…', status: generationStatus ? { phase: generationStatus.phase, progress: generationStatus.progress } : undefined },
    { active: isFiltering, label: 'Applying Majority Filter…' },
    { active: isGeneratingRivers, label: 'Generating Rivers…', status: riverGenerationStatus ? { phase: riverGenerationStatus.phase, progress: riverGenerationStatus.progress } : undefined },
  ]

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

    ctx.putImageData(img, 0, 0)
  }, [biomeMap, biomes, waterMap, waterColor])

  return (
    <div className="flex flex-1 flex-col w-full min-h-0">
      <CanvasViewport
        contentWidth={biomeMap?.width ?? 0}
        contentHeight={biomeMap?.height ?? 0}
        showPlaceholder={!biomeMap}
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
          <canvas
            ref={canvasRef}
            className={`shadow-2xl transition-opacity duration-300 ${
              isGenerating || isFiltering || isGeneratingRivers ? 'opacity-50' : 'opacity-100'
            }`}
            style={{ imageRendering: scale >= 1 ? 'pixelated' : 'auto' }}
          />
        )}
      </CanvasViewport>

      <GeneratingOverlay states={generatingStates} />

      <CanvasStatusBar
        cursorPosition={hoverInfo ? { x: hoverInfo.x, y: hoverInfo.y } : null}
        infoSlot={hoverInfo ? `Biome: ${hoverInfo.name}` : ''}
      />
    </div>
  )
}