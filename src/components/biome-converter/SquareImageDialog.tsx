import { useState } from 'react'
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
import { padToSquare, stretchToSquare } from '@/lib/canvas'
import type { SquareChoice } from '@/types'
import { Crop, Expand, MoveDiagonal } from 'lucide-react'

const options: { value: SquareChoice; label: string; desc: string; icon: React.ReactNode }[] = [
  { value: 'crop', label: 'Crop to Square', desc: 'Select the area to keep', icon: <Crop className="h-4 w-4" /> },
  { value: 'pad', label: 'Pad to Square', desc: 'Add padding to make it square', icon: <Expand className="h-4 w-4" /> },
  { value: 'stretch', label: 'Stretch to Square', desc: 'Distort to fit (advanced)', icon: <MoveDiagonal className="h-4 w-4" /> },
]

export function SquareImageDialog() {
  const { originalImage, setWorkingImage } = usePipelineContext()
  const { squareAction, setSquareAction, setUploadPhase } = useUIContext()

  const [choice, setChoice] = useState<SquareChoice | null>(null)

  if (!originalImage) return null

  const handleConfirm = () => {
    if (!choice || !originalImage) return
    switch (choice) {
      case 'pad': {
        const squared = padToSquare(originalImage)
        setWorkingImage(squared)
        setSquareAction(null)
        setUploadPhase('processing')
        return
      }
      case 'stretch': {
        const squared = stretchToSquare(originalImage)
        setWorkingImage(squared)
        setSquareAction(null)
        setUploadPhase('processing')
        return
      }
      case 'crop':
        setSquareAction('crop')
        return
    }
  }

  return (
    <Dialog open={squareAction === 'dialog'} onOpenChange={(open) => !open && setSquareAction(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Image is not square</DialogTitle>
          <DialogDescription>
            {originalImage.width}&times;{originalImage.height}. 7DTD biome maps must be square. Choose how to proceed:
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 py-2">
          {options.map(({ value, label, desc, icon }) => (
            <Button
              key={value}
              variant={choice === value ? 'default' : 'outline'}
              className="justify-start gap-3 h-auto py-2.5"
              onClick={() => setChoice(value)}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-background/10">
                {icon}
              </span>
              <div className="text-left">
                <div className="text-sm font-medium">{label}</div>
                <div className="text-xs text-muted-foreground">{desc}</div>
              </div>
            </Button>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setSquareAction(null)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!choice}>
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}