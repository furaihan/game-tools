import { Dialog, DialogContent } from "@/shared/ui/dialog"
import { Progress } from "@/shared/ui/progress"

interface GeneratingState {
  active: boolean
  label: string
  status?: {
    phase: string
    progress: number
  }
}

interface GeneratingOverlayProps {
  states: GeneratingState[]
}

export function GeneratingOverlay({ states }: GeneratingOverlayProps) {
  const active = states.find((s) => s.active)
  if (!active) return null

  return (
    <Dialog open={true} onOpenChange={() => {}} disablePointerDismissal={true}>
      <DialogContent className="sm:max-w-sm bg-card" showCloseButton={false}>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-center gap-3">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="font-mono text-sm font-medium">
              {active.label}
            </span>
          </div>
          {active.status && (
            <div className="space-y-2">
              <Progress value={active.status.progress * 100} />
              <p className="text-xs text-muted-foreground text-center font-mono">
                {active.status.phase}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}