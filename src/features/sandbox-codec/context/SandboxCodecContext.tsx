import { createContext, use, useState, useMemo, useEffect, useRef, type ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
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

interface SandboxCodecContextValue {
  values: Record<number, number>
  setValue: (optionId: number, valueIndex: number) => void
  decodeInput: string
  setDecodeInput: (value: string) => void
  decodeWarnings: string[]
  handleDecode: () => void
  searchQuery: string
  setSearchQuery: (value: string) => void
  activeTab: string
  setActiveTab: (value: string) => void
  currentCode: string
  disabledOptionIds: Set<number>
  resetAll: () => void
  handleRandomizeAll: () => void
  copyToClipboard: (text: string) => void
  groupedOptions: Record<string, SandboxOption[]>
  changedOptions: SandboxOption[]
  filteredGroups: Record<string, SandboxOption[]>
  filteredChangedGroups: Record<string, SandboxOption[]>
}

const SandboxCodecContext = createContext<SandboxCodecContextValue | null>(null)

interface SandboxCodecProviderProps {
  urlCode?: string
  children: ReactNode
}

export function SandboxCodecProvider({ urlCode, children }: SandboxCodecProviderProps) {
  const [values, setValues] = useState<Record<number, number>>(defaultValues)
  const [decodeInput, setDecodeInput] = useState('')
  const [decodeWarnings, setDecodeWarnings] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('decode')

  const currentCode = useMemo(() => encodeSandboxCode(values), [values])
  const disabledOptionIds = useMemo(() => getDisabledOptionIds(values), [values])

  const initializedFromUrl = useRef(false)
  const navigate = useNavigate({ from: '/7dtd/sandbox-codec/' })

  // Initialize from URL on first mount only
  useEffect(() => {
    if (urlCode && !initializedFromUrl.current) {
      const { values: decoded } = decodeSandboxCode(urlCode)
      setValues(decoded)
      setDecodeInput(urlCode) // populate decode input too
      initializedFromUrl.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // empty deps run only on mount

  // Sync currentCode back to URL (after init)
  useEffect(() => {
    // Only update if initialized (or no urlCode was present, meaning we're starting fresh)
    if (initializedFromUrl.current || !urlCode) {
      const codeToSet = currentCode.length > 1 ? currentCode : undefined
      if (codeToSet !== urlCode) {
        navigate({
          search: (prev) => ({ ...prev, code: codeToSet }),
          replace: true,
        })
      }
    }
  }, [currentCode, navigate, urlCode])

  const handleDecode = () => {
    const trimmed = decodeInput.trim()
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
  }

  const resetAll = () => {
    setValues(defaultValues)
    setDecodeInput('')
    setDecodeWarnings([])
    setSearchQuery('')
    toast.info('Reset to default values.')
  }

  const handleRandomizeAll = () => {
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
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const setValue = (optionId: number, valueIndex: number) => {
    setValues((prev) => ({
      ...prev,
      [optionId]: valueIndex,
    }))
  }

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

  const value: SandboxCodecContextValue = {
    values,
    setValue,
    decodeInput,
    setDecodeInput,
    decodeWarnings,
    handleDecode,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    currentCode,
    disabledOptionIds,
    resetAll,
    handleRandomizeAll,
    copyToClipboard,
    groupedOptions,
    changedOptions,
    filteredGroups,
    filteredChangedGroups,
  }

  return <SandboxCodecContext value={value}>{children}</SandboxCodecContext>
}

export function useSandboxCodec() {
  const ctx = use(SandboxCodecContext)
  if (!ctx) {
    throw new Error('useSandboxCodec must be used within a SandboxCodecProvider')
  }
  return ctx
}
