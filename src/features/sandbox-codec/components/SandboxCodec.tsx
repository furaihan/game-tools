import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { decodeSandboxCode, encodeSandboxCode, getDisabledOptionIds } from '@/features/sandbox-codec/core/codec'
import { sandboxOptions, optionsById, getDisplayName } from '@/features/sandbox-codec/core/sandboxOptions'
import type { SandboxOption } from '@/features/sandbox-codec/core/sandboxOptions'
import { valueSets } from '@/features/sandbox-codec/core/valueSets'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Button } from '@/shared/ui/button'
import { Toaster } from '@/shared/ui/sonner'
import { toast } from 'sonner'
import { Shuffle, RefreshCw, Code2, Settings2 } from 'lucide-react'
import { LiveCodeCard } from './LiveCodeCard'
import { SearchBar } from './SearchBar'
import { DecodePanel } from './DecodePanel'
import { EncodePanel } from './EncodePanel'

const defaultValues = sandboxOptions.reduce((acc, opt) => {
  acc[opt.id] = opt.defaultValueIndex
  return acc
}, {} as Record<number, number>)

function getValueSetLength(option: SandboxOption): number {
  const vs = valueSets[option.valueSetName]
  if (!vs) return 0
  return (vs.floatValues ?? vs.intValues ?? vs.boolValues ?? []).length
}

interface SandboxCodecProps {
  urlCode?: string
}

export function SandboxCodec({ urlCode }: SandboxCodecProps) {
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

  return (
    <div className="bg-background text-foreground pb-20 w-full">
      <Toaster position="top-center" richColors />

      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sandbox Options Codec</h1>
            <p className="text-muted-foreground mt-1">7 Days to Die V3.0 &bull; Encode and Decode Server Presets</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleRandomizeAll} size="sm">
              <Shuffle className="w-4 h-4 mr-2" />
              Randomize
            </Button>
            <Button variant="outline" onClick={resetAll} size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset All
            </Button>
          </div>
        </div>

        <LiveCodeCard currentCode={currentCode} onCopy={() => copyToClipboard(currentCode)} />
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="decode">
              <Code2 className="w-4 h-4 mr-2" />
              Decode Mode
            </TabsTrigger>
            <TabsTrigger value="encode">
              <Settings2 className="w-4 h-4 mr-2" />
              Encode / Edit All
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="decode">
              <DecodePanel
                decodeInput={decodeInput}
                onDecodeInputChange={setDecodeInput}
                onDecode={handleDecode}
                decodeWarnings={decodeWarnings}
                filteredChangedGroups={filteredChangedGroups}
                changedOptions={changedOptions}
                values={values}
                disabledOptionIds={disabledOptionIds}
                onSwitchToEncode={() => setActiveTab('encode')}
              />
            </TabsContent>

            <TabsContent value="encode">
              <EncodePanel
                filteredGroups={filteredGroups}
                values={values}
                disabledOptionIds={disabledOptionIds}
                onSetValue={setValue}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
