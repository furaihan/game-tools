import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { SquareAction } from '@/types'

interface UIState {
  activeTab: string
  showClusterPanel: boolean
  showStatistics: boolean
  squareAction: SquareAction
  showExportDialog: boolean
  uploadPhase: 'upload' | 'processing' | 'editing' | 'export'

  setActiveTab: (tab: string) => void
  setShowClusterPanel: (show: boolean) => void
  setShowStatistics: (show: boolean) => void
  setSquareAction: (action: SquareAction) => void
  setShowExportDialog: (show: boolean) => void
  setUploadPhase: (phase: UIState['uploadPhase']) => void
}

const UIContext = createContext<UIState | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState('segmentation')
  const [showClusterPanel, setShowClusterPanel] = useState(true)
  const [showStatistics, setShowStatistics] = useState(true)
  const [squareAction, setSquareAction] = useState<SquareAction>(null)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [uploadPhase, setUploadPhase] = useState<'upload' | 'processing' | 'editing' | 'export'>('upload')

  return (
    <UIContext.Provider
      value={{
        activeTab,
        showClusterPanel,
        showStatistics,
        squareAction,
        showExportDialog,
        uploadPhase,
        setActiveTab,
        setShowClusterPanel,
        setShowStatistics,
        setSquareAction,
        setShowExportDialog,
        setUploadPhase,
      }}
    >
      {children}
    </UIContext.Provider>
  )
}

export function useUIContext() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUIContext must be used within a UIProvider')
  return ctx
}