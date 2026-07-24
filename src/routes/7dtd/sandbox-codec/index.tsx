import { createFileRoute } from '@tanstack/react-router'
import { SandboxCodec } from '@/features/sandbox-codec/components/SandboxCodec'

export const Route = createFileRoute('/7dtd/sandbox-codec/')({
  validateSearch: (search: Record<string, unknown>): { code?: string } => ({
    code: typeof search.code === 'string' && search.code.length > 0 ? search.code : undefined,
  }),
  component: SandboxCodecWrapper,
})

function SandboxCodecWrapper() {
  const { code } = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <SandboxCodec
      urlCode={code}
      onCodeChange={(newCode) =>
        navigate({
          search: (prev) => ({ ...prev, code: newCode }),
          replace: true,
        })
      }
    />
  )
}
