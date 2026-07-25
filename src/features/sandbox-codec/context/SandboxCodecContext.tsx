import { createContext, use, useState, useMemo, useCallback, useEffect, useRef, type ReactNode } from 'react'
import { decodeSandboxCode, encodeSandboxCode, getDisabledOptionIds } from '@/features/sandbox-codec/core/codec'
import { sandboxOptions, optionsById, getDisplayName } from '@/features/sandbox-codec/core/sandboxOptions'
import type { SandboxOption } from '@/features/sandbox-codec/core/sandboxOptions'
import { valueSets } from '@/features/sandbox-codec/core/valueSets'
import { toast } from 'sonner'

const defaultValues = sandboxOptions.reduce((acc, opt) => {
  acc[opt.id] = opt.defaultValueIndex
  return acc
}, {} as Record<number, number>)

function getValueSetLength(option: SandboxOption): number {
  const vs = valueSets[option.valueSetName]
  if (!vs) return 0
  return (vs.floatValues ?? vs.intValues ?? vs.boolValues ?? []).length
}

/* ------------------------------------------------------------------ *
 * Contexts are split by "how often they change" / "who needs them", so
 * a component that only needs e.g. actions never re-renders when
 * `values` changes, and vice-versa. Each slice gets its own
 * useMemo'd value so updating one can't invalidate another.
 * ------------------------------------------------------------------ */

// Stable across (almost) every render — safe for any component to
// consume without incurring re-renders when unrelated state changes.
interface SandboxActionsContextValue {
  setValue: (optionId: number, valueIndex: number) => void
  setDecodeInput: (value: string) => void
  setSearchQuery: (value: string) => void
  setActiveTab: (value: string) => void
  handleDecode: () => void
  resetAll: () => void
  handleRandomizeAll: () => void
  copyToClipboard: (text: string) => void
}

// Changes on every single option edit — the "hot" data. Keep this as
// rarely-consumed-directly as possible (per-row components should get
// their own single value as a prop instead, see EncodePanel/DecodePanel).
interface SandboxValuesContextValue {
  values: Record<number, number>
  disabledOptionIds: Set<number>
}

// Changes on decode/search/tab interactions.
interface SandboxUIContextValue {
  decodeInput: string
  decodeWarnings: string[]
  searchQuery: string
  activeTab: string
  currentCode: string
}

// Recomputed whenever values or searchQuery change.
interface SandboxDerivedContextValue {
  groupedOptions: Record<string, SandboxOption[]>
  changedOptions: SandboxOption[]
  filteredGroups: Record<string, SandboxOption[]>
  filteredChangedGroups: Record<string, SandboxOption[]>
}

const SandboxActionsContext = createContext<SandboxActionsContextValue | null>(null)
const SandboxValuesContext = createContext<SandboxValuesContextValue | null>(null)
const SandboxUIContext = createContext<SandboxUIContextValue | null>(null)
const SandboxDerivedContext = createContext<SandboxDerivedContextValue | null>(null)

interface SandboxCodecProviderProps {
  urlCode?: string
  // URL-syncing is the route's job, not this context's — see routes/7dtd/sandbox-codec/index.tsx
  onCodeChange?: (code: string | undefined) => void
  children: ReactNode
}

export function SandboxCodecProvider({ urlCode, onCodeChange, children }: SandboxCodecProviderProps) {
  const [values, setValues] = useState<Record<number, number>>(defaultValues)
  const [decodeInput, setDecodeInput] = useState('')
  const [decodeWarnings, setDecodeWarnings] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('decode')

  const currentCode = useMemo(() => encodeSandboxCode(values), [values])
  const disabledOptionIds = useMemo(() => getDisabledOptionIds(values), [values])

  const initializedFromUrl = useRef(false)

  // Initialize from URL on first mount only
  useEffect(() => {
    if (urlCode && !initializedFromUrl.current) {
      const { values: decoded } = decodeSandboxCode(urlCode)
      setValues(decoded)
      setDecodeInput(urlCode)
      initializedFromUrl.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync currentCode back out (after init). Purely a notification —
  // this context has no idea it's feeding a router search param.
  useEffect(() => {
    if (!onCodeChange) return
    if (initializedFromUrl.current || !urlCode) {
      const codeToSet = currentCode.length > 1 ? currentCode : undefined
      if (codeToSet !== urlCode) {
        onCodeChange(codeToSet)
      }
    }
  }, [currentCode, urlCode, onCodeChange])

  // Mirror decodeInput into a ref so handleDecode can stay referentially
  // stable (empty dep array) without reading stale state. Using a
  // functional setState updater here instead would run twice under
  // StrictMode and double-fire the toast/decode side effects.
  const decodeInputRef = useRef(decodeInput)
  useEffect(() => {
    decodeInputRef.current = decodeInput
  }, [decodeInput])

  const setValue = useCallback((optionId: number, valueIndex: number) => {
    setValues((prev) => ({ ...prev, [optionId]: valueIndex }))
  }, [])

  const handleDecode = useCallback(() => {
    const trimmed = decodeInputRef.current.trim()
    if (!trimmed) {
      toast.error('Please enter a code to decode.')
      return
    }
    const { values: decodedValues, warnings } = decodeSandboxCode(trimmed)
    setValues(decodedValues)
    setDecodeWarnings(warnings)
    if (warnings.length > 0) {
      toast.warning('Decoded with warnings. See alerts below.')
    } else {
      toast.success('Successfully decoded Sandbox Code.')
    }
  }, [])

  const resetAll = useCallback(() => {
    setValues(defaultValues)
    setDecodeInput('')
    setDecodeWarnings([])
    setSearchQuery('')
    toast.info('Reset to default values.')
  }, [])

  const handleRandomizeAll = useCallback(() => {
    const newValues: Record<number, number> = {}

    for (const opt of sandboxOptions) {
      const len = getValueSetLength(opt)
      newValues[opt.id] = len > 0 ? Math.floor(Math.random() * len) : opt.defaultValueIndex
    }

    let disabled = getDisabledOptionIds(newValues)
    for (const id of disabled) {
      const opt = optionsById.get(id)
      if (opt) newValues[id] = opt.defaultValueIndex
    }

    disabled = getDisabledOptionIds(newValues)
    for (const id of disabled) {
      const opt = optionsById.get(id)
      if (opt) newValues[id] = opt.defaultValueIndex
    }

    setValues(newValues)
    toast.info('Randomized all options.')
  }, [])

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }, [])

  const groupedOptions = useMemo(() => {
    const groups: Record<string, SandboxOption[]> = {}
    for (const opt of sandboxOptions) {
      if (!groups[opt.category]) groups[opt.category] = []
      groups[opt.category].push(opt)
    }
    return groups
  }, [])

  const changedOptions = useMemo(() => {
    return sandboxOptions.filter((opt) => values[opt.id] !== opt.defaultValueIndex)
  }, [values])

  const groupedChangedOptions = useMemo(() => {
    const groups: Record<string, SandboxOption[]> = {}
    for (const opt of changedOptions) {
      if (!groups[opt.category]) groups[opt.category] = []
      groups[opt.category].push(opt)
    }
    return groups
  }, [changedOptions])

  const filteredGroups = useMemo(() => {
    if (!searchQuery) return groupedOptions
    const lowerQuery = searchQuery.toLowerCase()
    const groups: Record<string, SandboxOption[]> = {}
    for (const [cat, opts] of Object.entries(groupedOptions)) {
      const filtered = opts.filter(
        (opt) =>
          getDisplayName(opt.enumName).toLowerCase().includes(lowerQuery) ||
          opt.enumName.toLowerCase().includes(lowerQuery)
      )
      if (filtered.length > 0) groups[cat] = filtered
    }
    return groups
  }, [searchQuery, groupedOptions])

  const filteredChangedGroups = useMemo(() => {
    if (!searchQuery) return groupedChangedOptions
    const lowerQuery = searchQuery.toLowerCase()
    const groups: Record<string, SandboxOption[]> = {}
    for (const [cat, opts] of Object.entries(groupedChangedOptions)) {
      const filtered = opts.filter(
        (opt) =>
          getDisplayName(opt.enumName).toLowerCase().includes(lowerQuery) ||
          opt.enumName.toLowerCase().includes(lowerQuery)
      )
      if (filtered.length > 0) groups[cat] = filtered
    }
    return groups
  }, [searchQuery, groupedChangedOptions])

  const actionsValue = useMemo<SandboxActionsContextValue>(() => ({
    setValue,
    setDecodeInput,
    setSearchQuery,
    setActiveTab,
    handleDecode,
    resetAll,
    handleRandomizeAll,
    copyToClipboard,
  }), [setValue, handleDecode, resetAll, handleRandomizeAll, copyToClipboard])

  const valuesValue = useMemo<SandboxValuesContextValue>(() => ({
    values,
    disabledOptionIds,
  }), [values, disabledOptionIds])

  const uiValue = useMemo<SandboxUIContextValue>(() => ({
    decodeInput,
    decodeWarnings,
    searchQuery,
    activeTab,
    currentCode,
  }), [decodeInput, decodeWarnings, searchQuery, activeTab, currentCode])

  const derivedValue = useMemo<SandboxDerivedContextValue>(() => ({
    groupedOptions,
    changedOptions,
    filteredGroups,
    filteredChangedGroups,
  }), [groupedOptions, changedOptions, filteredGroups, filteredChangedGroups])

  return (
    <SandboxActionsContext value={actionsValue}>
      <SandboxValuesContext value={valuesValue}>
        <SandboxUIContext value={uiValue}>
          <SandboxDerivedContext value={derivedValue}>
            {children}
          </SandboxDerivedContext>
        </SandboxUIContext>
      </SandboxValuesContext>
    </SandboxActionsContext>
  )
}

export function useSandboxActions() {
  const ctx = use(SandboxActionsContext)
  if (!ctx) throw new Error('useSandboxActions must be used within a SandboxCodecProvider')
  return ctx
}

export function useSandboxValues() {
  const ctx = use(SandboxValuesContext)
  if (!ctx) throw new Error('useSandboxValues must be used within a SandboxCodecProvider')
  return ctx
}

export function useSandboxUI() {
  const ctx = use(SandboxUIContext)
  if (!ctx) throw new Error('useSandboxUI must be used within a SandboxCodecProvider')
  return ctx
}

export function useSandboxDerived() {
  const ctx = use(SandboxDerivedContext)
  if (!ctx) throw new Error('useSandboxDerived must be used within a SandboxCodecProvider')
  return ctx
}

// Convenience hook for components that genuinely need "a bit of
// everything" (e.g. the top-level view). Fine to use here because it
// only wraps layout — the heavy per-option lists use the granular
// hooks above plus React.memo instead.
export function useSandboxCodec() {
  return {
    ...useSandboxActions(),
    ...useSandboxValues(),
    ...useSandboxUI(),
    ...useSandboxDerived(),
  }
}
