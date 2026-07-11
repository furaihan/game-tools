import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy } from 'lucide-react'

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
          <span className="text-xs font-normal">Length: {currentCode.length}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2 pb-4 flex flex-col sm:flex-row gap-2">
        <Input readOnly value={currentCode} className="font-mono text-primary font-medium" />
        <Button onClick={onCopy}>
          <Copy className="w-4 h-4 mr-2" />
          Copy
        </Button>
      </CardContent>
    </Card>
  )
}
