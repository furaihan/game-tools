import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from 'react'
import type { BiomeDef, BiomeMap, AlgorithmName, GenerationStatus } from '@/features/biome-generator/types/biome-generator'
import type { WaterMap } from '@/features/river-generator/types/river-generator'

export type PaintTool = 'pan' | 'erase' | 'add-water'
export type BrushShape = 'circle' | 'square'
export type BrushRect = { x0: number; y0: number; x1: number; y1: number }

export const DEFAULT_BRUSH_SIZE = 4
export const MIN_BRUSH_SIZE = 1
export const MAX_BRUSH_SIZE = 30
const MAX_UNDO_DEPTH = 10

interface BiomeGeneratorState {
  biomes: BiomeDef[]
  seed: number
  resolution: number
  algorithm: AlgorithmName
  biomeMap: BiomeMap | null
  isGenerating: boolean
  isFiltering: boolean
  isFiltered: boolean
  error: string | null
  generationStatus: GenerationStatus | null
  waterMap: WaterMap | null
  waterColor: string
  isGeneratingRivers: boolean
  riverParams: {
    branchCount: number
    mainStemWidth: number
    branchWidth: number
    roughness: number
  }
  riverGenerationStatus: GenerationStatus | null
  paintTool: PaintTool
  brushShape: BrushShape
  brushSize: number
  undoDepth: number
}

interface BiomeGeneratorActions {
  setBiomes: (biomes: BiomeDef[]) => void
  setSeed: (seed: number) => void
  setResolution: (resolution: number) => void
  setAlgorithm: (algorithm: AlgorithmName) => void
  loadPreset: (name: string) => void
  randomizeSeed: () => void
  generate: () => void
  randomizeAndGenerate: () => void
  applyMajorityFilter: () => void
  exportPNG: () => void
  copySeed: () => void
  resetToDefaults: () => void
  setWaterColor: (color: string) => void
  setRiverParams: (params: Partial<{ branchCount: number; mainStemWidth: number; branchWidth: number; roughness: number }>) => void
  generateRivers: () => void
  clearRivers: () => void
  setPaintTool: (tool: PaintTool) => void
  setBrushShape: (shape: BrushShape) => void
  setBrushSize: (size: number) => void
  beginWaterStroke: () => void
  applyBrush: (x: number, y: number, mode: 'erase' | 'add-water') => BrushRect | null
  undoWaterEdit: () => void
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

export const DEFAULT_BIOMES = [
  { id: "7d2d-1", name: "Forest", color: "#004000", weight: 20 },
  { id: "7d2d-2", name: "Burnt Forest", color: "#BA00FF", weight: 15 },
  { id: "7d2d-3", name: "Desert", color: "#FFE477", weight: 20 },
  { id: "7d2d-4", name: "Snow", color: "#FFFFFF", weight: 20 },
  { id: "7d2d-5", name: "Wasteland", color: "#FFA800", weight: 25 },
]

export const DEFAULT_RESOLUTION = 1024
export const DEFAULT_ALGORITHM: AlgorithmName = "Probability Fields"

const BiomeGeneratorContext = createContext<BiomeGeneratorContextValue | null>(null)
BiomeGeneratorContext.displayName = 'BiomeGeneratorContext'
const contextUid = Math.random().toString(36).slice(2, 8)

export function BiomeGeneratorProvider({ children }: { children: ReactNode }) {
  console.log(`[${contextUid}] BiomeGeneratorProvider rendering`)
  const [biomes, setBiomes] = useState<BiomeDef[]>(() =>
    DEFAULT_BIOMES.map(b => ({ ...b }))
  )
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1000000))
  const [resolution, setResolution] = useState(DEFAULT_RESOLUTION)
  const [algorithm, setAlgorithm] = useState<AlgorithmName>(DEFAULT_ALGORITHM)
  const [biomeMap, setBiomeMap] = useState<BiomeMap | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isFiltering, setIsFiltering] = useState(false)
  const [isFiltered, setIsFiltered] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus | null>(null)
  const [waterMap, setWaterMap] = useState<WaterMap | null>(null)
  const [waterColor, setWaterColor] = useState('#001234')
  const [isGeneratingRivers, setIsGeneratingRivers] = useState(false)
  const [riverParams, setRiverParamsState] = useState({
    branchCount: 4,
    mainStemWidth: 8,
    branchWidth: 4,
    roughness: 0.4,
  })
  const [riverGenerationStatus, setRiverGenerationStatus] = useState<GenerationStatus | null>(null)
  const [riverNonce, setRiverNonce] = useState(0)
  const [paintTool, setPaintToolState] = useState<PaintTool>('pan')
  const [brushShape, setBrushShapeState] = useState<BrushShape>('circle')
  const [brushSize, setBrushSizeState] = useState(DEFAULT_BRUSH_SIZE)
  const [undoDepth, setUndoDepth] = useState(0)

  const workerRef = useRef<Worker | null>(null)
  const filterWorkerRef = useRef<Worker | null>(null)
  const riverWorkerRef = useRef<Worker | null>(null)
  const waterMapRef = useRef<WaterMap | null>(null)
  const brushSizeRef = useRef(DEFAULT_BRUSH_SIZE)
  const brushShapeRef = useRef<BrushShape>('circle')
  const undoStackRef = useRef<Uint8Array[]>([])

  useEffect(() => {
    waterMapRef.current = waterMap
  }, [waterMap])

  useEffect(() => {
    brushSizeRef.current = brushSize
  }, [brushSize])

  useEffect(() => {
    brushShapeRef.current = brushShape
  }, [brushShape])

  useEffect(() => {
    if (!waterMap) setPaintToolState('pan')
  }, [waterMap])

  useEffect(() => {
    return () => {
      workerRef.current?.terminate()
      filterWorkerRef.current?.terminate()
      riverWorkerRef.current?.terminate()
    }
  }, [])

  const loadPreset = useCallback((name: string) => {
    const preset = PRESETS[name]
    if (preset) {
      setBiomes(preset.map(b => ({ ...b })))
    }
  }, [])

  const clearUndoStack = useCallback(() => {
    undoStackRef.current = []
    setUndoDepth(0)
  }, [])

  const setPaintTool = useCallback((tool: PaintTool) => {
    setPaintToolState(tool)
  }, [])

  const setBrushShape = useCallback((shape: BrushShape) => {
    setBrushShapeState(shape)
  }, [])

  const setBrushSize = useCallback((size: number) => {
    setBrushSizeState(Math.max(MIN_BRUSH_SIZE, Math.min(MAX_BRUSH_SIZE, size)))
  }, [])

  const beginWaterStroke = useCallback(() => {
    const water = waterMapRef.current
    if (!water) return
    const stack = undoStackRef.current
    stack.push(water.data.slice())
    if (stack.length > MAX_UNDO_DEPTH) stack.shift()
    setUndoDepth(stack.length)
  }, [])

  const applyBrush = useCallback((x: number, y: number, mode: 'erase' | 'add-water'): BrushRect | null => {
    const water = waterMapRef.current
    if (!water) return null
    const radius = brushSizeRef.current
    if (radius <= 0) return null
    const width = water.width
    const height = water.height
    const x0 = Math.max(0, x - radius)
    const x1 = Math.min(width - 1, x + radius)
    const y0 = Math.max(0, y - radius)
    const y1 = Math.min(height - 1, y + radius)
    if (x0 > x1 || y0 > y1) return null
    const value = mode === 'erase' ? 0 : 1
    const isCircle = brushShapeRef.current === 'circle'
    const r2 = radius * radius
    for (let py = y0; py <= y1; py++) {
      for (let px = x0; px <= x1; px++) {
        if (isCircle) {
          const dx = px - x
          const dy = py - y
          if (dx * dx + dy * dy > r2) continue
        }
        water.data[py * width + px] = value
      }
    }
    return { x0, y0, x1, y1 }
  }, [])

  const undoWaterEdit = useCallback(() => {
    const stack = undoStackRef.current
    const snapshot = stack.pop()
    const water = waterMapRef.current
    if (!snapshot || !water) return
    setWaterMap({
      width: water.width,
      height: water.height,
      seed: water.seed,
      data: snapshot,
    })
    setUndoDepth(stack.length)
  }, [])

  const randomizeSeed = useCallback(() => {
    setSeed(Math.floor(Math.random() * 1000000))
  }, [])

  const resetToDefaults = useCallback(() => {
    setBiomes(DEFAULT_BIOMES.map(b => ({ ...b })))
    setSeed(Math.floor(Math.random() * 1000000))
    setResolution(DEFAULT_RESOLUTION)
    setAlgorithm(DEFAULT_ALGORITHM)
    setBiomeMap(null)
    setIsFiltered(false)
    setError(null)
    setWaterMap(null)
    clearUndoStack()
    setWaterColor('#001234')
    setRiverParamsState({ branchCount: 4, mainStemWidth: 8, branchWidth: 4, roughness: 0.4 })
  }, [clearUndoStack])

  const runGeneration = useCallback((seedToUse: number) => {
    if (biomes.length === 0 || biomes.every(b => b.weight <= 0)) {
      setError("Please add at least one biome with a weight > 0.")
      return
    }
    setError(null)
    setIsGenerating(true)
    setIsFiltered(false)
    setGenerationStatus({ phase: "Starting…", progress: 0 })
    setWaterMap(null)
    clearUndoStack()

    riverWorkerRef.current?.terminate()
    filterWorkerRef.current?.terminate()

    if (workerRef.current) {
      workerRef.current.terminate()
    }

    workerRef.current = new Worker(
      new URL('../workers/biome-generator.worker.ts', import.meta.url),
      { type: 'module' }
    )

    workerRef.current.onmessage = (e) => {
      switch (e.data.type) {
        case 'status':
          setGenerationStatus(e.data.status)
          break
        case 'success':
          setBiomeMap(e.data.data)
          setIsGenerating(false)
          setGenerationStatus(null)
          break
        case 'error':
          setError(e.data.error || "Generation failed")
          setIsGenerating(false)
          setGenerationStatus(null)
          break
      }
    }

    workerRef.current.onerror = (err) => {
      setError(err.message || "Worker error")
      setIsGenerating(false)
    }

    workerRef.current.postMessage({
      width: resolution,
      height: resolution,
      seed: seedToUse,
      biomes,
      algorithm,
    })
  }, [biomes, resolution, algorithm, clearUndoStack])

  const generate = useCallback(() => {
    runGeneration(seed)
  }, [runGeneration, seed])

  const randomizeAndGenerate = useCallback(() => {
    const newSeed = Math.floor(Math.random() * 1000000)
    setSeed(newSeed)
    runGeneration(newSeed)
  }, [runGeneration])

  const applyMajorityFilter = useCallback(() => {
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
    const waterRgb = hexToRgb(waterColor)

    for (let i = 0; i < biomeMap.data.length; i++) {
      let color
      if (waterMap && waterMap.data[i] === 1) {
        color = waterRgb
      } else {
        const biomeIdx = biomeMap.data[i]
        color = rgbCache[biomeIdx] || { r: 0, g: 0, b: 0 }
      }
      const idx = i * 4
      imageData.data[idx] = color.r
      imageData.data[idx + 1] = color.g
      imageData.data[idx + 2] = color.b
      imageData.data[idx + 3] = 255
    }

    ctx.putImageData(imageData, 0, 0)

    const link = document.createElement("a")
    const safeAlgo = algorithm.toLowerCase().replace(/\s+/g, '-')
    link.download = `biome_${seed}_${safeAlgo}_${resolution}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }, [biomeMap, biomes, seed, algorithm, resolution, waterMap, waterColor])

  const copySeed = useCallback(() => {
    navigator.clipboard.writeText(seed.toString())
  }, [seed])

  const setRiverParams = useCallback((params: Partial<typeof riverParams>) => {
    setRiverParamsState(prev => ({ ...prev, ...params }))
  }, [])

  const generateRivers = useCallback(() => {
    if (!biomeMap) return

    setError(null)
    setIsGeneratingRivers(true)
    setRiverGenerationStatus({ phase: 'Starting…', progress: 0 })

    if (riverWorkerRef.current) {
      riverWorkerRef.current.terminate()
    }

    riverWorkerRef.current = new Worker(
      new URL('../../river-generator/workers/river-generator.worker.ts', import.meta.url),
      { type: 'module' },
    )

    riverWorkerRef.current.onmessage = (e) => {
      switch (e.data.type) {
        case 'status':
          setRiverGenerationStatus(e.data.status)
          break
        case 'success':
          setWaterMap(e.data.data)
          clearUndoStack()
          setIsGeneratingRivers(false)
          setRiverGenerationStatus(null)
          break
        case 'error':
          setError(e.data.error || 'River generation failed')
          setIsGeneratingRivers(false)
          setRiverGenerationStatus(null)
          break
      }
    }

    riverWorkerRef.current.onerror = (err) => {
      setError(err.message || 'River worker error')
      setIsGeneratingRivers(false)
      setRiverGenerationStatus(null)
    }

    const nonce = riverNonce
    setRiverNonce(prev => prev + 1)

    riverWorkerRef.current.postMessage({
      width: biomeMap.width,
      height: biomeMap.height,
      seed: biomeMap.seed + nonce,
      branchCount: riverParams.branchCount,
      mainStemWidth: riverParams.mainStemWidth,
      branchWidth: riverParams.branchWidth,
      roughness: riverParams.roughness,
    })
  }, [biomeMap, riverParams, riverNonce, clearUndoStack])

  const clearRivers = useCallback(() => {
    setWaterMap(null)
    clearUndoStack()
    setRiverGenerationStatus(null)
  }, [clearUndoStack])

  return (
    <BiomeGeneratorContext.Provider
        value={{
        biomes, setBiomes,
        seed, setSeed,
        resolution, setResolution,
        algorithm, setAlgorithm,
        biomeMap,
        isGenerating, isFiltering, isFiltered,
        error, generationStatus,
        loadPreset, randomizeSeed,
        generate, randomizeAndGenerate,
        applyMajorityFilter, exportPNG, copySeed,
        resetToDefaults,
        waterMap, waterColor, setWaterColor,
        isGeneratingRivers, riverParams, setRiverParams,
        riverGenerationStatus, generateRivers, clearRivers,
        paintTool, setPaintTool,
        brushShape, setBrushShape,
        brushSize, setBrushSize,
        undoDepth,
        beginWaterStroke, applyBrush, undoWaterEdit,
      }}

    >
      {children}
    </BiomeGeneratorContext.Provider>
  )
}

export function useBiomeGenerator() {
  const ctx = useContext(BiomeGeneratorContext)
  if (!ctx) {
    console.warn(`[${contextUid}] useBiomeGenerator: context is null — provider may not be rendered or module duplicated`)
    throw new Error("useBiomeGenerator must be used within BiomeGeneratorProvider")
  }
  return ctx
}
