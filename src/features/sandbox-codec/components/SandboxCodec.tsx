import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Button } from '@/shared/ui/button'
import { Toaster } from '@/shared/ui/sonner'
import { ShuffleIcon, RefreshCwIcon, Code2Icon, Settings2Icon } from 'lucide-react'
import { LiveCodeCard } from './LiveCodeCard'
import { DecodeStrip } from './DecodeStrip'
import { SearchBar } from './SearchBar'
import { DecodePanel } from './DecodePanel'
import { PresetPicker } from './PresetPicker'
import { ActivePresetNote } from './ActivePresetNote'
import { EncodePanel } from './EncodePanel'
import { SandboxCodecProvider, useSandboxCodec } from '@/features/sandbox-codec/context/SandboxCodecContext'
import { SANDBOX_OPTION_DEFINITIONS } from '@/features/sandbox-codec/core/sandbox-option-definitions.data'
import { optionsByCategory } from '@/features/sandbox-codec/core/sandbox-option-registry'
import { CODEC_VERSION } from '@/features/sandbox-codec/core/sandbox-option-codec'
import { SANDBOX_PRESETS } from '@/features/sandbox-codec/core/sandbox-presets.data'

interface SandboxCodecProps {
  urlCode?: string
  onCodeChange?: (code: string | undefined) => void
}

export function SandboxCodec({ urlCode, onCodeChange }: SandboxCodecProps) {
  return (
    <SandboxCodecProvider urlCode={urlCode} onCodeChange={onCodeChange}>
      <SandboxCodecView />
    </SandboxCodecProvider>
  )
}

const toolButton =
  'h-7 rounded-none border border-foreground/25 bg-transparent px-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground outline-none transition-colors hover:bg-foreground/[0.07] focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-foreground/25 dark:bg-transparent dark:hover:bg-foreground/[0.07]'

// This top-level view is cheap to re-render (it's just layout + a
// handful of buttons), so using the composed `useSandboxCodec()` hook
// here is fine — the expensive part (150+ option rows) lives in
// EncodePanel/DecodePanel, which use the granular hooks instead.
function SandboxCodecView() {
  const {
    currentCode,
    copyToClipboard,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    handleRandomizeAll,
    resetAll,
  } = useSandboxCodec()

  return (
    <div className="bg-background text-foreground w-full pb-20" data-testid="sandbox-codec">
      <Toaster position="top-center" richColors />

      <div className="mx-auto max-w-6xl px-4 pt-7 sm:px-6 lg:px-8">
        {/* ── the sheet's head: what this is, and the numbers it is built on ── */}
        <header className="flex flex-col gap-5 border-b border-foreground/15 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-balance text-[1.7rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[2rem]">
              Sandbox Options Codec
            </h1>
            <p className="mt-2 max-w-lg text-pretty text-[13px] leading-relaxed text-foreground/80 dark:text-foreground/70">
              Read a preset code back into its settings, or build one from the options the game
              reads. Nothing leaves the tab.
            </p>
          </div>

          <dl className="flex flex-wrap items-baseline gap-x-6 gap-y-2 font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/85 dark:text-foreground/70">
            <div className="flex items-baseline gap-1.5">
              <dt>format</dt>
              <dd className="tabular-nums text-foreground">{CODEC_VERSION}</dd>
            </div>
            <div className="flex items-baseline gap-1.5">
              <dt>options</dt>
              <dd className="tabular-nums text-foreground">{SANDBOX_OPTION_DEFINITIONS.length}</dd>
            </div>
            <div className="flex items-baseline gap-1.5">
              <dt>categories</dt>
              <dd className="tabular-nums text-foreground">{optionsByCategory.size}</dd>
            </div>
            <div className="flex items-baseline gap-1.5">
              <dt>presets</dt>
              <dd className="tabular-nums text-foreground">{SANDBOX_PRESETS.length}</dd>
            </div>
          </dl>
        </header>

        {/* ── the artifact, and the way back in ── */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <LiveCodeCard currentCode={currentCode} onCopy={() => copyToClipboard(currentCode)} />

          <div className="flex flex-col justify-between gap-4 border border-foreground/15 p-4">
            <div>
              <div className="flex items-baseline justify-between gap-3">
                <PresetPicker />
              </div>
              <div className="mt-4">
                <DecodeStrip />
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-dashed border-foreground/15 pt-3">
              <Button
                variant="ghost"
                onClick={handleRandomizeAll}
                className={toolButton}
                data-testid="codec-randomize-all"
              >
                <ShuffleIcon className="mr-1.5 h-3 w-3" />
                Randomize
              </Button>
              <Button
                variant="ghost"
                onClick={resetAll}
                className={toolButton}
                data-testid="codec-reset-all"
              >
                <RefreshCwIcon className="mr-1.5 h-3 w-3" />
                Reset all
              </Button>
            </div>
          </div>
        </div>

        <ActivePresetNote />

        {/* ── the ledger ── */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8 w-full gap-0">
          <div className="flex flex-col gap-3 border-b border-foreground/15 pb-2 sm:flex-row sm:items-end sm:justify-between">
            <TabsList variant="line" className="h-auto gap-6 p-0">
              <TabsTrigger
                value="decode"
                data-testid="codec-tab-decode"
                className="h-auto flex-none rounded-none px-0 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] after:hidden data-active:text-foreground"
              >
                <Code2Icon className="mr-1.5 h-3.5 w-3.5" />
                Changed
              </TabsTrigger>
              <TabsTrigger
                value="encode"
                data-testid="codec-tab-encode"
                className="h-auto flex-none rounded-none px-0 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] after:hidden data-active:text-foreground"
              >
                <Settings2Icon className="mr-1.5 h-3.5 w-3.5" />
                All options
              </TabsTrigger>
            </TabsList>

            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          <div className="mt-5">
            <TabsContent value="decode">
              <DecodePanel />
            </TabsContent>

            <TabsContent value="encode">
              <EncodePanel />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}