import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { CopyIcon } from 'lucide-react'

interface LiveCodeCardProps {
  currentCode: string
  onCopy: () => void
}

export function LiveCodeCard({ currentCode, onCopy }: LiveCodeCardProps) {
  return (
    <Card className="border-primary/50 shadow-sm">
      <CardHeader className="py-4">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
          <span>LIVE SANDBOX CODE</span>
          <span className="text-xs font-normal" data-testid="codec-length">Length: {currentCode.length}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2 pb-4 flex flex-col sm:flex-row gap-2">
        <Input readOnly value={currentCode} className="font-mono text-primary font-medium" data-testid="codec-live-code" />
        <Button onClick={onCopy} data-testid="codec-copy">
          <CopyIcon className="w-4 h-4 mr-2" />
          Copy
        </Button>
      </CardContent>
    </Card>
  )
}
