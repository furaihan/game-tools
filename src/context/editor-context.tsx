import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { EditorTool } from '@/types'

interface EditorState {
  activeTool: EditorTool
  brushSize: number
  activeBiomeIndex: number

  setActiveTool: (tool: EditorTool) => void
  setBrushSize: (size: number) => void
  setActiveBiomeIndex: (index: number) => void
}

const EditorContext = createContext<EditorState | null>(null)

export function EditorProvider({ children }: { children: ReactNode }) {
  const [activeTool, setActiveTool] = useState<EditorTool>('pan')
  const [brushSize, setBrushSize] = useState(4)
  const [activeBiomeIndex, setActiveBiomeIndex] = useState(0)

  return (
    <EditorContext.Provider
      value={{
        activeTool,
        brushSize,
        activeBiomeIndex,
        setActiveTool,
        setBrushSize,
        setActiveBiomeIndex,
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}

export function useEditorContext() {
  const ctx = useContext(EditorContext)
  if (!ctx) throw new Error('useEditorContext must be used within an EditorProvider')
  return ctx
}