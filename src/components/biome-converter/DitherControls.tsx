import { usePipelineContext } from '@/context/pipeline-context'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const methods = [
  { id: 'errorDiffusion', label: 'Error Diffusion', desc: 'Floyd-Steinberg in LAB space' },
  { id: 'ordered', label: 'Ordered', desc: 'Bayer matrix, structured pattern' },
  { id: 'blueNoise', label: 'Blue Noise', desc: 'Random-like, no low-freq artifacts' },
]

export function DitherControls() {
  const { params: { dither }, setDitherParams } = usePipelineContext()

  return (
    <div className="space-y-3">
      <ToggleGroup
        value={[dither.method]}
        onValueChange={(val) => {
          if (val && val[0]) setDitherParams({ method: val[0] as 'errorDiffusion' | 'ordered' | 'blueNoise' })
        }}
        className="flex-col gap-2"
      >
        {methods.map((method) => (
          <ToggleGroupItem
            key={method.id}
            value={method.id}
            className="flex w-full flex-col items-start gap-0.5 rounded-lg border px-3 py-2.5 text-left data-[state=on]:border-primary data-[state=on]:bg-primary/5"
          >
            <span className="text-sm font-medium">{method.label}</span>
            <span className="text-xs text-muted-foreground">{method.desc}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}