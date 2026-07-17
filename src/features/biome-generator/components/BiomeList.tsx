import { useMemo } from 'react'
import { useBiomeGenerator } from '@/features/biome-generator/context/biome-generator-context'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/tooltip'

export function BiomeList() {
  const { biomes, setBiomes, biomeMap, mode, noiseConfig } = useBiomeGenerator()

  const totalWeight = biomes.reduce((acc, b) => acc + Math.max(0, b.weight), 0)

  const actualCounts = useMemo(() => {
    const counts = new Map<number, number>()
    if (!biomeMap) return counts
    for (let i = 0; i < biomeMap.data.length; i++) {
      const idx = biomeMap.data[i]
      counts.set(idx, (counts.get(idx) || 0) + 1)
    }
    return counts
  }, [biomeMap])

  const totalPixels = biomeMap ? biomeMap.width * biomeMap.height : 0

  const updateBiome = (index: number, updates: Partial<typeof biomes[number]>) => {
    const newBiomes = [...biomes]
    newBiomes[index] = { ...newBiomes[index], ...updates }
    setBiomes(newBiomes)
  }

  const removeBiome = (index: number) => {
    setBiomes(biomes.filter((_, i) => i !== index))
  }

  const addBiome = () => {
    const newId = Math.random().toString(36).substr(2, 9)
    setBiomes([...biomes, { id: newId, name: "New Biome", color: "#808080", weight: 10 }])
  }

  return (
    <TooltipProvider>
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 items-center justify-between border-b px-4 py-2.5">
          <h2 className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Active Biomes</h2>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={addBiome}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              }
            />
            <TooltipContent>Add Biome</TooltipContent>
          </Tooltip>
        </div>

        <div className="flex-1 overflow-y-auto py-1">
          {biomes.map((biome, i) => {
            const w = Math.max(0, biome.weight)
            const prob = totalWeight > 0 ? (w / totalWeight) * 100 : 0

            return (
              <div key={biome.id} className="group flex flex-col gap-1 px-4 py-1.5 hover:bg-muted/50">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={biome.color}
                    onChange={(e) => updateBiome(i, { color: e.target.value })}
                    className="h-3 w-3 cursor-pointer rounded-none border-0 bg-transparent p-0"
                  />
                  <input
                    value={biome.name}
                    onChange={(e) => updateBiome(i, { name: e.target.value })}
                    className="flex-1 bg-transparent text-xs font-medium text-foreground placeholder-muted-foreground focus:outline-none"
                    placeholder="Name"
                  />
                  <span className="font-mono text-[10px] text-muted-foreground" title="Target probability (weight)">
                    {prob.toFixed(1)}%
                  </span>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"
                          onClick={() => removeBiome(i)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <TooltipContent>Remove Biome</TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={biome.weight}
                    onChange={(e) => updateBiome(i, { weight: parseFloat(e.target.value) || 0 })}
                    className="h-1 w-full cursor-pointer accent-primary bg-muted"
                  />
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={biome.weight}
                    onChange={(e) => updateBiome(i, { weight: parseFloat(e.target.value) || 0 })}
                    className="w-8 bg-transparent text-right font-mono text-[9px] text-muted-foreground focus:outline-none"
                  />
                </div>
              </div>
            )
          })}
          {biomes.length === 0 && (
            <div className="p-4 text-sm italic text-muted-foreground">No biomes defined.</div>
          )}
        </div>

        <div className="flex max-h-[40%] shrink-0 flex-col border-t">
          <div className="flex shrink-0 items-center justify-between border-b px-4 py-2.5">
            <h2 className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Result Distribution</h2>
          </div>
          <div className="overflow-y-auto py-1">
            {biomes.map((biome, i) => {
              const actualCount = actualCounts.get(i) || 0
              const actualProb = totalPixels > 0 ? (actualCount / totalPixels) * 100 : 0

              return (
                <div key={`res-${biome.id}`} className="flex items-center gap-3 px-4 py-1">
                  <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: biome.color }} />
                  <span className="flex-1 truncate text-[11px] font-medium text-foreground">{biome.name}</span>
                  <span className="font-mono text-[10px] text-primary">{actualProb.toFixed(1)}%</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="shrink-0 border-t px-4 py-3 text-[10px] italic text-muted-foreground/60 leading-relaxed">
          {mode === "Noise"
            ? noiseConfig.biomeMapping === "Threshold Bands"
              ? "Threshold Bands yields coverage roughly proportional to weights."
              : "Multi-Layer Argmax weights affect odds organically, not directly proportionally."
            : "Distribution based on the active map generation."}
        </div>
      </div>
    </TooltipProvider>
  )
}
