import type { ReactNode } from "react"
import { useCanvasViewport, screenToContent } from "./useCanvasViewport"

interface CanvasViewportProps {
  contentWidth: number
  contentHeight: number
  children: (helpers: { scale: number }) => ReactNode
  showPlaceholder?: boolean
  onContentPointerMove?: (
    contentPos: { x: number; y: number } | null
  ) => void
}

export function CanvasViewport({
  contentWidth,
  contentHeight,
  children,
  showPlaceholder = false,
  onContentPointerMove,
}: CanvasViewportProps) {
  const {
    scale,
    pan,
    viewportRef,
    fit,
    onWheel,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerLeave,
  } = useCanvasViewport({ contentWidth, contentHeight })

  const handlePointerMove = (e: React.PointerEvent) => {
    onPointerMove(e)
    if (onContentPointerMove) {
      onContentPointerMove(
        screenToContent(
          e.clientX,
          e.clientY,
          viewportRef,
          scale,
          pan,
          contentWidth,
          contentHeight
        )
      )
    }
  }

  const handlePointerLeave = (_e: React.PointerEvent) => {
    onPointerLeave()
    onContentPointerMove?.(null)
  }

  return (
    <div
      ref={viewportRef}
      className="relative flex flex-1 items-center justify-center overflow-hidden bg-muted/50"
      style={{
        backgroundImage: "radial-gradient(oklch(0.2 0.02 350) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }}
    >
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

      {showPlaceholder ? (
        <div className="text-muted-foreground font-mono text-sm">
          NO_LAYOUT_GENERATED
        </div>
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-move overflow-hidden"
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={handlePointerLeave}
        >
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
              transformOrigin: "center center",
              lineHeight: 0,
            }}
          >
            {children({ scale })}
          </div>
        </div>
      )}
    </div>
  )
}