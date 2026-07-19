import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Button } from '@/shared/ui/button'
import { Toaster } from '@/shared/ui/sonner'
import { Shuffle, RefreshCw, Code2, Settings2 } from 'lucide-react'
import { LiveCodeCard } from './LiveCodeCard'
import { SearchBar } from './SearchBar'
import { DecodePanel } from './DecodePanel'
import { EncodePanel } from './EncodePanel'
import { SandboxCodecProvider, useSandboxCodec } from '@/features/sandbox-codec/context/SandboxCodecContext'

interface SandboxCodecProps {
  urlCode?: string
}

export function SandboxCodec({ urlCode }: SandboxCodecProps) {
  return (
    <SandboxCodecProvider urlCode={urlCode}>
      <SandboxCodecView />
    </SandboxCodecProvider>
  )
}

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
