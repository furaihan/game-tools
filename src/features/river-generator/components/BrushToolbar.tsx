import { useBiomeGenerator } from '@/features/biome-generator/context/biome-generator-context'
import { ToggleGroup, ToggleGroupItem } from '@/shared/ui/toggle-group'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip'
import {
  HandIcon,
  EraserIcon,
  DropletsIcon,
  CircleIcon,
  SquareIcon,
  Undo2Icon,
} from 'lucide-react'
import {
  DEFAULT_BRUSH_SIZE,
  MAX_BRUSH_SIZE,
  MIN_BRUSH_SIZE,
  type BrushShape,
  type PaintTool,
} from '@/features/biome-generator/context/biome-generator-context'
import { Label } from '@/shared/ui/label';

export function BrushToolbar() {
  const {
    waterMap,
    isGenerating,
    isGeneratingRivers,
    paintTool,
    setPaintTool,
    brushShape,
    setBrushShape,
    brushSize,
    setBrushSize,
    undoDepth,
    undoWaterEdit,
  } = useBiomeGenerator()

  const disabled = !waterMap || isGenerating || isGeneratingRivers

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <ToggleGroup
          size="sm"
          value={[paintTool]}
          onValueChange={(v) => {
            if (v[0]) setPaintTool(v[0] as PaintTool)
          }}
        >
          <ToggleGroupItem value="pan" aria-label="Pan">
            <Tooltip>
              <TooltipTrigger>
                <HandIcon />
              </TooltipTrigger>
              <TooltipContent>
                <Label>
                  Pan
                </Label>
              </TooltipContent>
            </Tooltip>
          </ToggleGroupItem>
          <ToggleGroupItem value="erase" aria-label="Erase water" disabled={disabled}>
            <Tooltip>
              <TooltipTrigger>
                <EraserIcon />
              </TooltipTrigger>
              <TooltipContent>
                <Label>
                  Erase water
                </Label>
              </TooltipContent>
            </Tooltip>
          </ToggleGroupItem>
          <ToggleGroupItem value="add-water" aria-label="Add water" disabled={disabled}>
            <Tooltip>
              <TooltipTrigger>
                <DropletsIcon />
              </TooltipTrigger>
              <TooltipContent>
                <Label>
                  Add water
                </Label>
              </TooltipContent>
            </Tooltip>
          </ToggleGroupItem>
        </ToggleGroup>

        {paintTool !== 'pan' && (
          <>
            <div className="mx-1 h-4 w-px bg-border" />
            <ToggleGroup
              size="sm"
              value={[brushShape]}
              onValueChange={(v) => {
                if (v[0]) setBrushShape(v[0] as BrushShape)
              }}
            >
              <ToggleGroupItem value="circle" aria-label="Circle brush" disabled={disabled}>
                <CircleIcon />
              </ToggleGroupItem>
              <ToggleGroupItem value="square" aria-label="Square brush" disabled={disabled}>
                <SquareIcon />
              </ToggleGroupItem>
            </ToggleGroup>
            <Input
              type="number"
              min={MIN_BRUSH_SIZE}
              max={MAX_BRUSH_SIZE}
              value={brushSize}
              onChange={(e) =>
                setBrushSize(
                  Math.max(
                    MIN_BRUSH_SIZE,
                    Math.min(MAX_BRUSH_SIZE, parseInt(e.target.value) || DEFAULT_BRUSH_SIZE)
                  )
                )
              }
              className="h-7 w-14 font-mono text-sm"
              disabled={disabled}
              aria-label="Brush size (radius in tiles)"
            />
          </>
        )}

        <div className="mx-1 h-4 w-px bg-border" />

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2"
                onClick={undoWaterEdit}
                disabled={disabled || undoDepth === 0}
              >
                <Undo2Icon className="h-3.5 w-3.5" />
              </Button>
            }
          />
          <TooltipContent>Undo last stroke</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
