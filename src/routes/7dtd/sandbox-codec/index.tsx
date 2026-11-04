import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useCallback } from 'react'
import { SandboxCodec } from '@/features/sandbox-codec/components/SandboxCodec'

const CODEC_PATH = '/7dtd/sandbox-codec'

/** `/7dtd/sandbox-codec` and its trailing-slash form are the same page. */
const isOnCodec = (pathname: string) => pathname.replace(/\/+$/, '') === CODEC_PATH

export const Route = createFileRoute('/7dtd/sandbox-codec/')({
  validateSearch: (search: Record<string, unknown>): { code?: string } => ({
    code: typeof search.code === 'string' && search.code.length > 0 ? search.code : undefined,
  }),
  component: SandboxCodecWrapper,
})

function SandboxCodecWrapper() {
  const { code } = Route.useSearch()
  const navigate = Route.useNavigate()
  const router = useRouter()

  /**
   * The codec mirrors its state into `?code=` on every change.
   *
   * When the user leaves for another route, `code` drops to undefined while the
   * provider still holds its last state, so that mirroring fires once more. A
   * navigate without `to` is relative to this route, so that late write sent the
   * visitor straight back here: selecting a preset or editing a value made Home
   * unreachable. Reading the live pathname at call time (not from render props,
   * which can be a frame stale) keeps the write to the page that owns it.
   */
  const handleCodeChange = useCallback(
    (newCode: string | undefined) => {
      if (!isOnCodec(router.state.location.pathname)) return
      navigate({
        to: CODEC_PATH,
        search: (prev) => ({ ...prev, code: newCode }),
        replace: true,
        resetScroll: false,
      })
    },
    [navigate, router],
  )

  return <SandboxCodec urlCode={code} onCodeChange={handleCodeChange} />
}
