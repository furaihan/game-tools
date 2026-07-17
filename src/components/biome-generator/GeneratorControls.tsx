import { useBiomeGenerator } from '@/context/biome-generator-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Dices, Grid3X3, Filter, Download, Copy } from 'lucide-react'
import type { AlgorithmName, NoiseType, BiomeMapping } from '@/types/biome-generator'

const ALGORITHMS: AlgorithmName[] = [
  "Random Seeds",
  "Territory Expansion",
  "Random Walkers",
  "Random Blobs",
  "Cellular Growth",
  "Probability Fields",
  "Recursive Split",
  "Weighted Expansion",
  "Biome Islands",
]

const NOISE_TYPES: NoiseType[] = ["Perlin", "Simplex", "Fractal", "Worley"]
const BIOME_MAPPINGS: BiomeMapping[] = ["Threshold Bands", "Multi-Layer Argmax"]
const RESOLUTIONS = [256, 512, 1024, 2048]

export function GeneratorControls() {
  const {
    mode, setMode,
    biomes,
    loadPreset,
    seed, setSeed, randomizeSeed,
    resolution, setResolution,
    algorithm, setAlgorithm,
    noiseConfig, setNoiseConfig,
    biomeMap,
    isGenerating, isFiltering, isFiltered,
    error,
    generate, applyMajorityFilter, exportPNG, copySeed,
    resetToDefaults,
  } = useBiomeGenerator()

  return (
    <TooltipProvider>
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-6 overflow-y-auto p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Mode</Label>
              <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2" onClick={resetToDefaults}>
                Reset All
              </Button>
            </div>
            <div className="flex rounded-lg bg-muted p-0.5">
              <button
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  mode === "Simple" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setMode("Simple")}
              >
                Simple
              </button>
              <button
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  mode === "Noise" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setMode("Noise")}
              >
                Noise
              </button>
            </div>
          </div>

        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Biome Preset</Label>
          <Select
            defaultValue="7 Days to Die"
            onValueChange={(v) => v && loadPreset(v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7 Days to Die">7 Days to Die</SelectItem>
              <SelectItem value="Minecraft">Minecraft</SelectItem>
              <SelectItem value="Valheim">Valheim</SelectItem>
              <SelectItem value="Standard Earth">Standard Earth</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Seed</Label>
          <div className="flex gap-1">
            <Input
              type="number"
              value={seed}
              onChange={(e) => setSeed(parseInt(e.target.value) || 0)}
              className="font-mono text-sm"
            />
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button variant="outline" size="icon" onClick={randomizeSeed} title="Randomize seed">
                    <Dices className="h-4 w-4" />
                  </Button>
                }
              />
              <TooltipContent>Randomize seed</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Resolution</Label>
          <Select
            value={resolution.toString()}
              onValueChange={(v) => v && setResolution(parseInt(v))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RESOLUTIONS.map(r => (
                <SelectItem key={r} value={r.toString()}>{r} x {r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {mode === "Simple" ? (
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Algorithm</Label>
            <Select
              value={algorithm}
              onValueChange={(v) => v && setAlgorithm(v as AlgorithmName)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALGORITHMS.map(algo => (
                  <SelectItem key={algo} value={algo}>{algo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="space-y-4 border-t border-border pt-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Noise Type</Label>
            <Select
              value={noiseConfig.noiseType}
              onValueChange={(v) => v && setNoiseConfig({ ...noiseConfig, noiseType: v as NoiseType })}
            >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NOISE_TYPES.map(type => (
                    <SelectItem key={type} value={type}>
                      {type === "Worley" ? "Worley / Cellular" : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Scale</Label>
                <Input
                  type="number"
                  value={noiseConfig.scale}
                  onChange={(e) => setNoiseConfig({ ...noiseConfig, scale: parseFloat(e.target.value) || 1 })}
                  className="font-mono text-sm"
                />
              </div>

              {noiseConfig.noiseType === "Fractal" && (
                <>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Octaves</Label>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      value={noiseConfig.octaves}
                      onChange={(e) => setNoiseConfig({ ...noiseConfig, octaves: parseInt(e.target.value) || 1 })}
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Persistence</Label>
                    <Input
                      type="number"
                      step={0.1}
                      value={noiseConfig.persistence}
                      onChange={(e) => setNoiseConfig({ ...noiseConfig, persistence: parseFloat(e.target.value) || 0.5 })}
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Lacunarity</Label>
                    <Input
                      type="number"
                      step={0.1}
                      value={noiseConfig.lacunarity}
                      onChange={(e) => setNoiseConfig({ ...noiseConfig, lacunarity: parseFloat(e.target.value) || 2.0 })}
                      className="font-mono text-sm"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Biome Mapping</Label>
              <Select
                value={noiseConfig.biomeMapping}
                onValueChange={(v) => v && setNoiseConfig({ ...noiseConfig, biomeMapping: v as BiomeMapping })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BIOME_MAPPINGS.map(mapping => (
                    <SelectItem key={mapping} value={mapping}>{mapping}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  className="w-full gap-2"
                  onClick={() => {
                    if (biomeMap) {
                      randomizeSeed()
                    }
                    generate()
                  }}
                  disabled={isGenerating || isFiltering}
                >
                  <Grid3X3 className="h-4 w-4" />
                  {isGenerating
                    ? "Generating..."
                    : biomeMap
                    ? "Regenerate"
                    : "Generate"}
                </Button>
              }
            />
            <TooltipContent>
              {isGenerating
                ? "Generating..."
                : biomeMap
                ? "Regenerate"
                : "Generate"}
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Post-Processing</Label>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={applyMajorityFilter}
                  disabled={!biomeMap || isGenerating || isFiltering || isFiltered}
                >
                  <Filter className="h-4 w-4" />
                  {isFiltering ? "Filtering..." : isFiltered ? "Majority Filter Applied" : "Apply Majority Filter"}
                </Button>
              }
            />
            <TooltipContent>
              {isFiltering ? "Filtering..." : isFiltered ? "Majority Filter Applied" : "Apply Majority Filter"}
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Export</Label>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={exportPNG}
                  disabled={!biomeMap || isGenerating || isFiltering}
                >
                  <Download className="h-4 w-4" />
                  Export PNG
                </Button>
              }
            />
            <TooltipContent>Export to PNG</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={copySeed}
                >
                  <Copy className="h-4 w-4" />
                  Copy Seed
                </Button>
              }
            />
            <TooltipContent>Copy seed to clipboard</TooltipContent>
          </Tooltip>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 font-mono">
            {error}
          </div>
        )}
      </div>
    </div>
    </TooltipProvider>
  )
}
