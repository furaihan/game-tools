import type { SandboxOption } from '@/features/sandbox-codec/core/sandboxOptions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Textarea } from '@/shared/ui/textarea'
import { Button } from '@/shared/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert'
import { AlertCircle, Settings2 } from 'lucide-react'
import { OptionRow } from './OptionRow'

interface DecodePanelProps {
  decodeInput: string
  onDecodeInputChange: (value: string) => void
  onDecode: () => void
  decodeWarnings: string[]
  filteredChangedGroups: Record<string, SandboxOption[]>
  changedOptions: SandboxOption[]
  values: Record<number, number>
  disabledOptionIds: Set<number>
  onSwitchToEncode: () => void
}

export function DecodePanel({
  decodeInput,
  onDecodeInputChange,
  onDecode,
  decodeWarnings,
  filteredChangedGroups,
  changedOptions,
  values,
  disabledOptionIds,
  onSwitchToEncode,
}: DecodePanelProps) {
  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
      <Card>
        <CardHeader>
          <CardTitle>Decode Sandbox Code</CardTitle>
          <CardDescription>Paste an existing code to see what options it changes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g. AAAJABJACJAD..."
            value={decodeInput}
            onChange={(e) => onDecodeInputChange(e.target.value)}
            className="font-mono min-h-[100px]"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={onDecode} className="w-full sm:w-auto">
              Decode Code
            </Button>
            <Button variant="secondary" onClick={onSwitchToEncode} className="w-full sm:w-auto">
              <Settings2 className="w-4 h-4 mr-2" />
              Edit Options
            </Button>
          </div>
        </CardContent>
      </Card>

      {decodeWarnings.length > 0 && (
        <div className="space-y-2">
          {decodeWarnings.map((warn, i) => (
            <Alert variant="destructive" key={i}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>{warn}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {Object.keys(filteredChangedGroups).length > 0 ? (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold border-b pb-2">Decoded Options</h3>
          {Object.entries(filteredChangedGroups).map(([cat, opts]) => (
            <div key={cat} className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{cat}</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {opts.map((opt) => (
                  <OptionRow
                    key={opt.id}
                    option={opt}
                    currentValueIndex={values[opt.id] ?? opt.defaultValueIndex}
                    isDisabled={disabledOptionIds.has(opt.id)}
                    isReadOnly
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
          {changedOptions.length > 0
            ? "No modified options matched your search."
            : "No modified options found. The current code represents the default state."}
        </div>
      )}
    </div>
  )
}
