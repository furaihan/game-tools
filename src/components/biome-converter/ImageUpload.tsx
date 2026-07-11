import { useCallback, useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, ClipboardPaste } from 'lucide-react'
import { useImageLoader } from '@/hooks/use-image-loader'

export function ImageUpload() {
  const { loadImage, loadFromClipboard } = useImageLoader()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) loadImage(file)
    },
    [loadImage],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => setIsDragging(false), [])

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) loadImage(file)
    },
    [loadImage],
  )

  return (
    <Card
      className={`relative cursor-pointer transition-all duration-200 ${
        isDragging
          ? 'border-primary border-2 bg-primary/5 scale-[1.01]'
          : 'hover:border-muted-foreground/30'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="pointer-events-none absolute inset-0 rounded-lg border-2 border-dashed border-border opacity-40" />
      <CardContent className="relative flex flex-col items-center gap-5 py-16">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <div className="text-center">
          <h3 className="text-base font-semibold">Upload an image</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Drag & drop here, or click to browse
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            PNG, JPG, JPEG, WEBP &mdash; up to 20000&times;20000
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          className="hidden"
          onChange={handleFileSelect}
        />
        <div className="flex gap-2">
          <Button onClick={() => inputRef.current?.click()} className="gap-1.5">
            <Upload className="h-4 w-4" />
            Browse Files
          </Button>
          <Button variant="outline" onClick={loadFromClipboard} className="gap-1.5">
            <ClipboardPaste className="h-4 w-4" />
            Paste
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}