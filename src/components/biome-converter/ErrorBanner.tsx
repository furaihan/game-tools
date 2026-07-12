import { Alert, AlertTitle, AlertAction } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { TriangleAlert, X } from 'lucide-react'
import { usePipelineContext } from '@/context/pipeline-context'
import { useEffect, useRef } from 'react'

export function ErrorBanner() {
  const { error, setError } = usePipelineContext()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (error) {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setError(null), 8000)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [error, setError])

  if (!error) return null

  return (
    <Alert variant="destructive" className="mb-3">
      <TriangleAlert className="h-4 w-4" />
      <AlertTitle>{error}</AlertTitle>
      <AlertAction>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setError(null)}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </AlertAction>
    </Alert>
  )
}