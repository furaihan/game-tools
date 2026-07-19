import { useBiomeGenerator } from "@/features/biome-generator/context/biome-generator-context";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import { Progress } from "@/shared/ui/progress";
import { Dices, Grid3X3, Filter, Download, Copy, Shuffle } from "lucide-react";
import type { AlgorithmName } from "@/features/biome-generator/types/biome-generator";

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
];

const RESOLUTIONS = [256, 512, 1024, 2048];

export function GeneratorControls() {
  const {
    loadPreset,
    seed,
    setSeed,
    randomizeSeed,
    resolution,
    setResolution,
    algorithm,
    setAlgorithm,
    biomeMap,
    isGenerating,
    isFiltering,
    isFiltered,
    error,
    generationStatus,
    generate,
    randomizeAndGenerate,
    applyMajorityFilter,
    exportPNG,
    copySeed,
    resetToDefaults,
  } = useBiomeGenerator();

  return (
    <TooltipProvider>
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-6 overflow-y-auto p-4">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Controls
            </Label>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[10px] px-2"
              onClick={resetToDefaults}
            >
              Reset All
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Biome Preset
            </Label>
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
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Seed
            </Label>
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
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={randomizeSeed}
                      title="Randomize seed"
                    >
                      <Dices className="h-4 w-4" />
                    </Button>
                  }
                />
                <TooltipContent>Randomize seed</TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Resolution
            </Label>
            <Select
              value={resolution.toString()}
              onValueChange={(v) => v && setResolution(parseInt(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RESOLUTIONS.map((r) => (
                  <SelectItem key={r} value={r.toString()}>
                    {r} x {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Algorithm
            </Label>
            <Select
              value={algorithm}
              onValueChange={(v) => v && setAlgorithm(v as AlgorithmName)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALGORITHMS.map((algo) => (
                  <SelectItem key={algo} value={algo}>
                    {algo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    className="w-full gap-2"
                    onClick={() => {
                      generate();
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
            {/* Add Randomize & Regenerate Buttons */}
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => {
                if (biomeMap) {
                  randomizeAndGenerate();
                } else {
                  generate();
                }
              }}
              disabled={isGenerating || isFiltering}
            >
              <Shuffle className="h-4 w-4" />
              {isGenerating ? "Generating..." : "Randomize & Regenerate"}
            </Button>
          </div>

          {isGenerating && generationStatus && (
            <div className="space-y-1">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Progress
              </Label>
              <Progress value={generationStatus.progress * 100} />
              <p className="text-[10px] text-muted-foreground text-center">
                {generationStatus.phase}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Post-Processing
            </Label>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={applyMajorityFilter}
                    disabled={
                      !biomeMap || isGenerating || isFiltering || isFiltered
                    }
                  >
                    <Filter className="h-4 w-4" />
                    {isFiltering
                      ? "Filtering..."
                      : isFiltered
                        ? "Majority Filter Applied"
                        : "Apply Majority Filter"}
                  </Button>
                }
              />
              <TooltipContent>
                {isFiltering
                  ? "Filtering..."
                  : isFiltered
                    ? "Majority Filter Applied"
                    : "Apply Majority Filter"}
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Export
            </Label>
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
  );
}
