import { createContext, use, useState, useMemo, useCallback, useEffect, useRef, type ReactNode } from 'react'
import { SandboxOption } from '@/features/sandbox-codec/core/sandbox-option.enum'
import type { SandboxOptionDefinition, SandboxOptionState } from '@/features/sandbox-codec/core/sandbox-option-definition.types'
import { SANDBOX_OPTION_DEFINITIONS } from '@/features/sandbox-codec/core/sandbox-option-definitions.data'
import { optionsByCategory, getDefinition, getValueSet, getDefaultIndex, createDefaultState, createStateFromValues } from '@/features/sandbox-codec/core/sandbox-option-registry'
import { encodePresetToCode, decodeCodeToPreset } from '@/features/sandbox-codec/core/sandbox-option-codec'
import { getSandboxPreset, getPresetName, findPresetByCode } from '@/features/sandbox-codec/core/sandbox-presets.data'
import { getDisplayName, getEnumName } from '@/features/sandbox-codec/core/localization'
import { toast } from 'sonner'

function applyCascade(
  state: Map<SandboxOption, SandboxOptionState>,
  option: SandboxOption,
  newIndex: number,
): void {
  const definition = getDefinition(option)
  const disabled = definition?.disabledOptions
  if (!disabled) return

  const valueSet = definition ? getValueSet(definition) : undefined
  const newValue = valueSet?.values[newIndex]

  const matches = disabled.inverted ? newValue === disabled.value : newValue !== disabled.value

  for (const target of disabled.disabledOptions) {
    const targetState = state.get(target)
    if (!targetState) continue
    state.set(target, { ...targetState, isEnabled: matches })
  }
}

/* ------------------------------------------------------------------ *
 * Contexts are split by "how often they change" / "who needs them", so
 * a component that only needs e.g. actions never re-renders when
 * `state` changes, and vice-versa. Each slice gets its own
 * useMemo'd value so updating one can't invalidate another.
 * ------------------------------------------------------------------ */

interface SandboxActionsContextValue {
  setValue: (option: SandboxOption, valueIndex: number) => void
  setDecodeInput: (value: string) => void
  setSearchQuery: (value: string) => void
  setActiveTab: (value: string) => void
  handleDecode: () => void
  applyPreset: (id: string) => void
  resetAll: () => void
  handleRandomizeAll: () => void
  copyToClipboard: (text: string) => void
}

interface SandboxValuesContextValue {
  state: Map<SandboxOption, SandboxOptionState>
  disabledOptionIds: Set<SandboxOption>
}

interface SandboxUIContextValue {
  decodeInput: string
  searchQuery: string
  activeTab: string
  currentCode: string
  activePresetId: string | null
}

interface SandboxDerivedContextValue {
  groupedOptions: Record<string, SandboxOptionDefinition[]>
  changedOptions: SandboxOptionDefinition[]
  filteredGroups: Record<string, SandboxOptionDefinition[]>
  filteredChangedGroups: Record<string, SandboxOptionDefinition[]>
}

const SandboxActionsContext = createContext<SandboxActionsContextValue | null>(null)
const SandboxValuesContext = createContext<SandboxValuesContextValue | null>(null)
const SandboxUIContext = createContext<SandboxUIContextValue | null>(null)
const SandboxDerivedContext = createContext<SandboxDerivedContextValue | null>(null)

interface SandboxCodecProviderProps {
  urlCode?: string
  onCodeChange?: (code: string | undefined) => void
  children: ReactNode
}

export function SandboxCodecProvider({ urlCode, onCodeChange, children }: SandboxCodecProviderProps) {
  const [state, setState] = useState(() => createDefaultState())
  const [decodeInput, setDecodeInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('decode')
  const [activePresetId, setActivePresetId] = useState<string | null>(null)

  const currentCode = useMemo(() => {
    const changed = new Map<SandboxOption, number>()
    for (const [opt, s] of state) {
      if (s.currentIndex !== getDefaultIndex(s.definition)) {
        changed.set(opt, s.currentIndex)
      }
    }
    return encodePresetToCode(changed)
  }, [state])

  const disabledOptionIds = useMemo(() => {
    const set = new Set<SandboxOption>()
    for (const [opt, s] of state) {
      if (!s.isEnabled) set.add(opt)
    }
    return set
  }, [state])

  const initializedFromUrl = useRef(false)

  useEffect(() => {
    if (urlCode && !initializedFromUrl.current) {
      setState(createStateFromValues(decodeCodeToPreset(urlCode)))
      setActivePresetId(findPresetByCode(urlCode)?.id ?? null)
      setDecodeInput(urlCode)
      initializedFromUrl.current = true
    }
  }, [urlCode])

  useEffect(() => {
    if (!onCodeChange) return
    if (initializedFromUrl.current || !urlCode) {
      const codeToSet = currentCode.length > 1 ? currentCode : undefined
      if (codeToSet !== urlCode) {
        onCodeChange(codeToSet)
      }
    }
  }, [currentCode, urlCode, onCodeChange])

  const decodeInputRef = useRef(decodeInput)
  useEffect(() => {
    decodeInputRef.current = decodeInput
  }, [decodeInput])

  const setValue = useCallback((option: SandboxOption, valueIndex: number) => {
    // Hand-editing a value means the result is no longer the shipped preset.
    setActivePresetId(null)
    setState((prev) => {
      const next = new Map(prev)
      const entry = next.get(option)
      if (!entry) return prev
      next.set(option, { ...entry, currentIndex: valueIndex })
      applyCascade(next, option, valueIndex)
      return next
    })
  }, [])

  const handleDecode = useCallback(() => {
    const trimmed = decodeInputRef.current.trim()
    if (!trimmed) {
      toast.error('Please enter a code to decode.')
      return
    }
    initializedFromUrl.current = true
    setState(createStateFromValues(decodeCodeToPreset(trimmed)))
    setActivePresetId(findPresetByCode(trimmed)?.id ?? null)
    toast.success('Successfully decoded Sandbox Code.')
  }, [])

  const applyPreset = useCallback((id: string) => {
    const preset = getSandboxPreset(id)
    if (!preset) return
    // The state is now authoritative: without this, the URL effect would adopt
    // the code this very action is about to write and rebuild from it.
    initializedFromUrl.current = true
    setState(createStateFromValues(decodeCodeToPreset(preset.code)))
    setDecodeInput(preset.code)
    setActivePresetId(preset.id)
    setActiveTab('decode')
    toast.success(`Loaded the ${getPresetName(preset)} preset.`)
  }, [])

  const resetAll = useCallback(() => {
    setState(createDefaultState())
    setDecodeInput('')
    setActivePresetId(null)
    setSearchQuery('')
    toast.info('Reset to default values.')
  }, [])

  const handleRandomizeAll = useCallback(() => {
    const newState = new Map<SandboxOption, SandboxOptionState>()

    for (const def of SANDBOX_OPTION_DEFINITIONS) {
      const vs = getValueSet(def)
      const len = vs.values.length
      const idx = len > 0 ? Math.floor(Math.random() * len) : getDefaultIndex(def)
      newState.set(def.option, {
        definition: def,
        currentIndex: idx,
        isEnabled: true,
      })
    }

    for (const [opt, s] of newState) {
      applyCascade(newState, opt, s.currentIndex)
    }
    for (const [opt, s] of newState) {
      applyCascade(newState, opt, s.currentIndex)
    }

    for (const [, s] of newState) {
      if (!s.isEnabled) {
        s.currentIndex = getDefaultIndex(s.definition)
      }
    }

    setState(newState)
    setActivePresetId(null)
    toast.info('Randomized all options.')
  }, [])

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }, [])

  const groupedOptions = useMemo(() => {
    const groups: Record<string, SandboxOptionDefinition[]> = {}
    for (const [cat, defs] of optionsByCategory) {
      groups[cat] = defs
    }
    return groups
  }, [])

  const changedOptions = useMemo(() => {
    return SANDBOX_OPTION_DEFINITIONS.filter((def) => {
      const s = state.get(def.option)
      return s && s.currentIndex !== getDefaultIndex(def)
    })
  }, [state])

  const groupedChangedOptions = useMemo(() => {
    const groups: Record<string, SandboxOptionDefinition[]> = {}
    for (const def of changedOptions) {
      if (!groups[def.categoryName]) groups[def.categoryName] = []
      groups[def.categoryName].push(def)
    }
    return groups
  }, [changedOptions])

  const filteredGroups = useMemo(() => {
    if (!searchQuery) return groupedOptions
    const lowerQuery = searchQuery.toLowerCase()
    const groups: Record<string, SandboxOptionDefinition[]> = {}
    for (const [cat, opts] of Object.entries(groupedOptions)) {
      const filtered = opts.filter(
        (def) =>
          getDisplayName(def).toLowerCase().includes(lowerQuery) ||
          getEnumName(def.option).toLowerCase().includes(lowerQuery),
      )
      if (filtered.length > 0) groups[cat] = filtered
    }
    return groups
  }, [searchQuery, groupedOptions])

  const filteredChangedGroups = useMemo(() => {
    if (!searchQuery) return groupedChangedOptions
    const lowerQuery = searchQuery.toLowerCase()
    const groups: Record<string, SandboxOptionDefinition[]> = {}
    for (const [cat, opts] of Object.entries(groupedChangedOptions)) {
      const filtered = opts.filter(
        (def) =>
          getDisplayName(def).toLowerCase().includes(lowerQuery) ||
          getEnumName(def.option).toLowerCase().includes(lowerQuery),
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
    applyPreset,
    resetAll,
    handleRandomizeAll,
    copyToClipboard,
  }), [setValue, handleDecode, applyPreset, resetAll, handleRandomizeAll, copyToClipboard])

  const valuesValue = useMemo<SandboxValuesContextValue>(() => ({
    state,
    disabledOptionIds,
  }), [state, disabledOptionIds])

  const uiValue = useMemo<SandboxUIContextValue>(() => ({
    decodeInput,
    searchQuery,
    activeTab,
    currentCode,
    activePresetId,
  }), [decodeInput, searchQuery, activeTab, currentCode, activePresetId])

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

export function useSandboxCodec() {
  return {
    ...useSandboxActions(),
    ...useSandboxValues(),
    ...useSandboxUI(),
    ...useSandboxDerived(),
  }
}
