import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from 'react'
import type { BiomeDef, BiomeMap, GenerationMode, AlgorithmName, NoiseConfig, NoiseType, BiomeMapping } from '@/types/biome-generator'

interface BiomeGeneratorState {
  biomes: BiomeDef[]
  seed: number
  resolution: number
  mode: GenerationMode
  algorithm: AlgorithmName
  noiseConfig: NoiseConfig
  biomeMap: BiomeMap | null
  isGenerating: boolean
  isFiltering: boolean
  isFiltered: boolean
  error: string | null
}

interface BiomeGeneratorActions {
  setBiomes: (biomes: BiomeDef[]) => void
  setSeed: (seed: number) => void
  setResolution: (resolution: number) => void
  setMode: (mode: GenerationMode) => void
  setAlgorithm: (algorithm: AlgorithmName) => void
  setNoiseConfig: (config: NoiseConfig) => void
  loadPreset: (name: string) => void
  randomizeSeed: () => void
  generate: () => void
  applyMedianBlur: () => void
  exportPNG: () => void
  copySeed: () => void
  resetToDefaults: () => void
}

type BiomeGeneratorContextValue = BiomeGeneratorState & BiomeGeneratorActions

const PRESETS: Record<string, BiomeDef[]> = {
  "7 Days to Die": [
    { id: "7d2d-1", name: "Forest", color: "#004000", weight: 20 },
    { id: "7d2d-2", name: "Burnt Forest", color: "#BA00FF", weight: 15 },
    { id: "7d2d-3", name: "Desert", color: "#FFE477", weight: 20 },
    { id: "7d2d-4", name: "Snow", color: "#FFFFFF", weight: 20 },
    { id: "7d2d-5", name: "Wasteland", color: "#FFA800", weight: 25 },
  ],
  "Minecraft": [
    { id: "mc-1", name: "Plains", color: "#8DB360", weight: 20 },
    { id: "mc-2", name: "Forest", color: "#366121", weight: 15 },
    { id: "mc-3", name: "Desert", color: "#E0C870", weight: 15 },
    { id: "mc-4", name: "Ocean", color: "#2D58A3", weight: 15 },
    { id: "mc-5", name: "Mountains", color: "#808080", weight: 10 },
    { id: "mc-6", name: "Taiga", color: "#4A6E46", weight: 15 },
    { id: "mc-7", name: "Swamp", color: "#4C5D36", weight: 10 },
  ],
  "Valheim": [
    { id: "vh-1", name: "Meadows", color: "#558B2F", weight: 20 },
    { id: "vh-2", name: "Black Forest", color: "#1B5E20", weight: 20 },
    { id: "vh-3", name: "Swamp", color: "#3E2723", weight: 10 },
    { id: "vh-4", name: "Mountain", color: "#CFD8DC", weight: 10 },
    { id: "vh-5", name: "Plains", color: "#FBC02D", weight: 15 },
    { id: "vh-6", name: "Mistlands", color: "#455A64", weight: 10 },
    { id: "vh-7", name: "Ashlands", color: "#BF360C", weight: 5 },
    { id: "vh-8", name: "Deep North", color: "#ECEFF1", weight: 5 },
    { id: "vh-9", name: "Ocean", color: "#2D58A3", weight: 5 },
  ],
  "Standard Earth": [
    { id: "se-1", name: "Forest", color: "#2e7d32", weight: 10 },
    { id: "se-2", name: "Grassland", color: "#8bc34a", weight: 15 },
    { id: "se-3", name: "Desert", color: "#ffb300", weight: 10 },
    { id: "se-4", name: "Swamp", color: "#4b5320", weight: 5 },
    { id: "se-5", name: "Mountain", color: "#757575", weight: 8 },
    { id: "se-6", name: "Snow", color: "#ffffff", weight: 5 },
    { id: "se-7", name: "Jungle", color: "#1b5e20", weight: 8 },
    { id: "se-8", name: "Savanna", color: "#fbc02d", weight: 8 },
    { id: "se-9", name: "Badlands", color: "#d84315", weight: 5 },
  ],
}

export const DEFAULT_NOISE: NoiseConfig = {
  noiseType: "Simplex",
  scale: 256,
  octaves: 4,
  persistence: 0.5,
  lacunarity: 2.0,
  biomeMapping: "Threshold Bands",
}

export const DEFAULT_BIOMES = [
  { id: "7d2d-1", name: "Forest", color: "#004000", weight: 20 },
  { id: "7d2d-2", name: "Burnt Forest", color: "#BA00FF", weight: 15 },
  { id: "7d2d-3", name: "Desert", color: "#FFE477", weight: 20 },
  { id: "7d2d-4", name: "Snow", color: "#FFFFFF", weight: 20 },
  { id: "7d2d-5", name: "Wasteland", color: "#FFA800", weight: 25 },
]

export const DEFAULT_RESOLUTION = 1024
export const DEFAULT_MODE: GenerationMode = "Simple"
export const DEFAULT_ALGORITHM: AlgorithmName = "Probability Fields"

const BiomeGeneratorContext = createContext<BiomeGeneratorContextValue | null>(null)

export function BiomeGeneratorProvider({ children }: { children: ReactNode }) {
  const [biomes, setBiomes] = useState<BiomeDef[]>(() =>
    DEFAULT_BIOMES.map(b => ({ ...b }))
  )
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1000000))
  const [resolution, setResolution] = useState(DEFAULT_RESOLUTION)
  const [mode, setMode] = useState<GenerationMode>(DEFAULT_MODE)
  const [algorithm, setAlgorithm] = useState<AlgorithmName>(DEFAULT_ALGORITHM)
  const [noiseConfig, setNoiseConfig] = useState<NoiseConfig>({ ...DEFAULT_NOISE })
  const [biomeMap, setBiomeMap] = useState<BiomeMap | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isFiltering, setIsFiltering] = useState(false)
  const [isFiltered, setIsFiltered] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const workerRef = useRef<Worker | null>(null)
  const filterWorkerRef = useRef<Worker | null>(null)

  useEffect(() => {
    return () => {
      workerRef.current?.terminate()
      filterWorkerRef.current?.terminate()
    }
  }, [])

  const loadPreset = useCallback((name: string) => {
    const preset = PRESETS[name]
    if (preset) {
      setBiomes(preset.map(b => ({ ...b })))
    }
  }, [])

  const randomizeSeed = useCallback(() => {
    setSeed(Math.floor(Math.random() * 1000000))
  }, [])

  const resetToDefaults = useCallback(() => {
    setBiomes(DEFAULT_BIOMES.map(b => ({ ...b })))
    setSeed(Math.floor(Math.random() * 1000000))
    setResolution(DEFAULT_RESOLUTION)
    setMode(DEFAULT_MODE)
    setAlgorithm(DEFAULT_ALGORITHM)
    setNoiseConfig({ ...DEFAULT_NOISE })
    setBiomeMap(null)
    setIsFiltered(false)
    setError(null)
  }, [])

  const generate = useCallback(() => {
    if (biomes.length === 0 || biomes.every(b => b.weight <= 0)) {
      setError("Please add at least one biome with a weight > 0.")
      return
    }
    setError(null)
    setIsGenerating(true)
    setIsFiltered(false)

    if (workerRef.current) {
      workerRef.current.terminate()
    }

    workerRef.current = new Worker(
      new URL('../workers/biome-generator.worker.ts', import.meta.url),
      { type: 'module' }
    )

    workerRef.current.onmessage = (e) => {
      if (e.data.type === 'success') {
        setBiomeMap(e.data.data)
      } else {
        setError(e.data.error || "Generation failed")
      }
      setIsGenerating(false)
    }

    workerRef.current.onerror = (err) => {
      setError(err.message || "Worker error")
      setIsGenerating(false)
    }

    const currentNoiseConfig = mode === "Noise" ? noiseConfig : undefined
    workerRef.current.postMessage({
      width: resolution,
      height: resolution,
      seed,
      biomes,
      mode,
      algorithm,
      noiseConfig: currentNoiseConfig,
    })
  }, [biomes, seed, resolution, algorithm, mode, noiseConfig])

  const applyMedianBlur = useCallback(() => {
    if (!biomeMap) return
    setIsFiltering(true)

    if (filterWorkerRef.current) {
      filterWorkerRef.current.terminate()
    }

    filterWorkerRef.current = new Worker(
      new URL('../workers/biome-generator-filter.worker.ts', import.meta.url),
      { type: 'module' }
    )

    filterWorkerRef.current.onmessage = (e) => {
      if (e.data.type === 'success') {
        setBiomeMap(e.data.data)
        setIsFiltered(true)
      } else {
        setError(e.data.error || "Filter failed")
      }
      setIsFiltering(false)
    }

    filterWorkerRef.current.onerror = (err) => {
      setError(err.message || "Filter worker error")
      setIsFiltering(false)
    }

    filterWorkerRef.current.postMessage({
      biomeMap,
      radius: 2,
    })
  }, [biomeMap])

  const exportPNG = useCallback(() => {
    if (!biomeMap) return

    const canvas = document.createElement("canvas")
    canvas.width = biomeMap.width
    canvas.height = biomeMap.height
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.imageSmoothingEnabled = false

    const imageData = ctx.createImageData(biomeMap.width, biomeMap.height)
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
        : { r: 0, g: 0, b: 0 }
    }
    const rgbCache = biomes.map(b => hexToRgb(b.color))

    for (let i = 0; i < biomeMap.data.length; i++) {
      const biomeIdx = biomeMap.data[i]
      const color = rgbCache[biomeIdx] || { r: 0, g: 0, b: 0 }
      const idx = i * 4
      imageData.data[idx] = color.r
      imageData.data[idx + 1] = color.g
      imageData.data[idx + 2] = color.b
      imageData.data[idx + 3] = 255
    }

    ctx.putImageData(imageData, 0, 0)

    const link = document.createElement("a")
    const safeAlgo = mode === "Noise"
      ? `noise-${noiseConfig.noiseType.toLowerCase()}`
      : algorithm.toLowerCase().replace(/\s+/g, '-')
    link.download = `biome_${seed}_${safeAlgo}_${resolution}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }, [biomeMap, biomes, seed, algorithm, mode, noiseConfig, resolution])

  const copySeed = useCallback(() => {
    navigator.clipboard.writeText(seed.toString())
  }, [seed])

  return (
    <BiomeGeneratorContext.Provider
        value={{
        biomes, setBiomes,
        seed, setSeed,
        resolution, setResolution,
        mode, setMode,
        algorithm, setAlgorithm,
        noiseConfig, setNoiseConfig,
        biomeMap,
        isGenerating, isFiltering, isFiltered,
        error,
        loadPreset, randomizeSeed,
        generate, applyMedianBlur, exportPNG, copySeed,
        resetToDefaults,
      }}

    >
      {children}
    </BiomeGeneratorContext.Provider>
  )
}

export function useBiomeGenerator() {
  const ctx = useContext(BiomeGeneratorContext)
  if (!ctx) throw new Error("useBiomeGenerator must be used within BiomeGeneratorProvider")
  return ctx
}
