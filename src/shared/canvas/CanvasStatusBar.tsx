import type { ReactNode } from "react"

interface CanvasStatusBarProps {
  cursorPosition: { x: number; y: number } | null
  infoSlot: ReactNode
}

export function CanvasStatusBar({
  cursorPosition,
  infoSlot,
}: CanvasStatusBarProps) {
  return (
    <div className="flex h-8 shrink-0 items-center justify-between border-t bg-card px-6 font-mono text-[10px] text-muted-foreground" data-testid="canvas-status-bar">
      <span data-testid="canvas-cursor">
        CURSOR:{" "}
        {cursorPosition
          ? `X:${cursorPosition.x} Y:${cursorPosition.y}`
          : "NO_ACTIVE_SELECTION"}
      </span>
      <span className="text-primary" data-testid="canvas-info">{infoSlot}</span>
    </div>
  )
}