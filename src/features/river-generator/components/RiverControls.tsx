import { useState, useEffect } from 'react'
import { useBiomeGenerator } from '@/features/biome-generator/context/biome-generator-context'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip'
import { DropletsIcon, XIcon } from 'lucide-react'

export function RiverControls() {
  const {
    biomeMap,
    waterMap,
    waterColor,
    setWaterColor,
    riverParams,
    setRiverParams,
    generateRivers,
    clearRivers,
    isGeneratingRivers,
    isGenerating,
    riverGenerationStatus,
  } = useBiomeGenerator()

  const [hexDraft, setHexDraft] = useState(waterColor)

  useEffect(() => {
    setHexDraft(waterColor)
  }, [waterColor])

  const disabled = !biomeMap || isGenerating || isGeneratingRivers

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
          River Generation
        </Label>

        <div className="space-y-2">
          <Label className="text-[10px] text-muted-foreground">Branches</Label>
          <Input
            type="number"
            min={0}
            max={12}
            value={riverParams.branchCount}
            onChange={(e) => setRiverParams({ branchCount: Math.max(0, Math.min(12, parseInt(e.target.value) || 0)) })}
            className="font-mono text-sm"
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] text-muted-foreground">Main Stem Width</Label>
          <Input
            type="number"
            min={2}
            max={20}
            value={riverParams.mainStemWidth}
            onChange={(e) => setRiverParams({ mainStemWidth: Math.max(2, Math.min(20, parseInt(e.target.value) || 8)) })}
            className="font-mono text-sm"
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] text-muted-foreground">Branch Width</Label>
          <Input
            type="number"
            min={1}
            max={15}
            value={riverParams.branchWidth}
            onChange={(e) => setRiverParams({ branchWidth: Math.max(1, Math.min(15, parseInt(e.target.value) || 4)) })}
            className="font-mono text-sm"
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] text-muted-foreground">Curvature Scale (px)</Label>
          <Input
            type="number"
            min={50}
            max={500}
            value={riverParams.noiseScale}
            onChange={(e) => setRiverParams({ noiseScale: Math.max(50, Math.min(500, parseInt(e.target.value) || 150)) })}
            className="font-mono text-sm"
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] text-muted-foreground">Water Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={waterColor}
              onChange={(e) => setWaterColor(e.target.value)}
              className="h-8 w-12 cursor-pointer p-0.5"
              disabled={disabled}
            />
            <Input
              type="text"
              value={hexDraft}
              onChange={(e) => setHexDraft(e.target.value)}
              onBlur={() => {
                if (/^#[0-9a-fA-F]{6}$/.test(hexDraft)) {
                  setWaterColor(hexDraft)
                } else {
                  setHexDraft(waterColor)
                }
              }}
              className="font-mono text-sm flex-1"
              disabled={disabled}
            />
          </div>
        </div>

        {riverGenerationStatus?.detail && (
          <p className="text-[10px] text-muted-foreground font-mono text-center">
            {riverGenerationStatus.detail}
          </p>
        )}

        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  className="w-full gap-2"
                  onClick={generateRivers}
                  disabled={disabled}
                >
                  <DropletsIcon className="h-4 w-4" />
                  {isGeneratingRivers ? 'Generating...' : waterMap ? 'Regenerate Rivers' : 'Generate Rivers'}
                </Button>
              }
            />
            <TooltipContent>
              {isGeneratingRivers ? 'Generating rivers...' : 'Generate river water overlay'}
            </TooltipContent>
          </Tooltip>

          {waterMap && (
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={clearRivers}
              disabled={isGeneratingRivers}
            >
              <XIcon className="h-4 w-4" />
              Clear Rivers
            </Button>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
