import { useEditorContext } from '@/context/editor-context'
import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Slider } from '@/components/ui/slider'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { OFFICIAL_PALETTE } from '@/core/palette'
import { Paintbrush, PaintBucket, Square, Pipette, Hand } from 'lucide-react'
import type { EditorTool } from '@/types'

const tools: { id: string; label: string; icon: React.ReactNode }[] = [
  { id: 'brush', label: 'Brush (B)', icon: <Paintbrush className="h-3.5 w-3.5" /> },
  { id: 'fill', label: 'Fill (G)', icon: <PaintBucket className="h-3.5 w-3.5" /> },
  { id: 'rect', label: 'Rect (R)', icon: <Square className="h-3.5 w-3.5" /> },
  { id: 'eyedropper', label: 'Pick (E)', icon: <Pipette className="h-3.5 w-3.5" /> },
  { id: 'pan', label: 'Pan (P)', icon: <Hand className="h-3.5 w-3.5" /> },
]

export function Toolbar() {
  const { activeTool, brushSize, activeBiomeIndex, setActiveTool, setBrushSize, setActiveBiomeIndex } = useEditorContext()

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Tools
        </label>
        <ToggleGroup
          value={[activeTool]}
          onValueChange={(val) => {
            if (val && val[0]) setActiveTool(val[0] as EditorTool)
          }}
          className="flex gap-1"
        >
          {tools.map((tool) => (
            <Tooltip key={tool.id}>
              <TooltipTrigger
                render={
                  <ToggleGroupItem
                    value={tool.id}
                    className="h-8 w-8 rounded-md p-0 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                  >
                    {tool.icon}
                  </ToggleGroupItem>
                }
              />
              <TooltipContent side="bottom" className="text-[11px]">
                {tool.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </ToggleGroup>
      </div>

      {(activeTool === 'brush' || activeTool === 'fill' || activeTool === 'rect') && (
        <>
          <Separator />

          <div>
            <p className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Color
            </p>
            <div className="flex gap-1">
              {OFFICIAL_PALETTE.map((p, i) => (
                <Tooltip key={p.biome}>
                  <TooltipTrigger
                    render={
                      <button
                        className={`h-6 w-6 rounded border-2 transition-all duration-150 ${
                          activeBiomeIndex === i
                            ? 'scale-110 border-foreground'
                            : 'border-transparent hover:border-border'
                        }`}
                        style={{
                          backgroundColor: `rgb(${p.rgb[0]},${p.rgb[1]},${p.rgb[2]})`,
                        }}
                        onClick={() => setActiveBiomeIndex(i)}
                      />
                    }
                  />
                  <TooltipContent side="bottom" className="text-[11px]">
                    {p.biome.replace(/([A-Z])/g, ' $1').trim()}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Brush Size
              </p>
              <span className="font-mono text-[11px] text-muted-foreground">{brushSize}</span>
            </div>
            <Slider
              min={1}
              max={64}
              step={1}
              value={[brushSize]}
              onValueChange={(v) => setBrushSize(Array.isArray(v) ? v[0] : v)}
              className="mt-1.5"
            />
          </div>
        </>
      )}
    </div>
  )
}