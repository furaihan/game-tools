import { useCallback } from 'react'
import { usePipelineContext } from '@/context/pipeline-context'
import { useUIContext } from '@/context/ui-context'
import { imageDataFromFile, isValidImageSize } from '@/lib/canvas'

export function useImageLoader() {
  const { setOriginalImage, setWorkingImage, setError } = usePipelineContext()
  const { setUploadPhase, setSquareAction } = useUIContext()

  const loadImage = useCallback(
    async (file: File) => {
      try {
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
        if (!validTypes.includes(file.type)) {
          setError('Unsupported file format. Please use PNG, JPG, JPEG, or WEBP.')
          return
        }

        const imageData = await imageDataFromFile(file)
        const validation = isValidImageSize(imageData.width, imageData.height)
        if (!validation.valid) {
          setError(validation.message || 'Invalid image size')
          return
        }

        setOriginalImage(imageData)
        const workingCopy = new ImageData(
          new Uint8ClampedArray(imageData.data),
          imageData.width,
          imageData.height,
        )
        setWorkingImage(workingCopy)

        if (imageData.width !== imageData.height) {
          setSquareAction('dialog')
        } else {
          setUploadPhase('processing')
        }
      } catch (err) {
        setError((err as Error).message)
      }
    },
    [setOriginalImage, setWorkingImage, setError, setUploadPhase, setSquareAction],
  )

  const loadFromClipboard = useCallback(async () => {
    try {
      const items = await navigator.clipboard.read()
      for (const item of items) {
        const imageType = item.types.find((t) => t.startsWith('image/'))
        if (!imageType) continue

        const blob = await item.getType(imageType)
        const file = new File([blob], 'clipboard.png', { type: imageType })
        await loadImage(file)
        return
      }
      setError('No image found in clipboard')
    } catch {
      setError('Failed to read from clipboard')
    }
  }, [loadImage, setError])

  return { loadImage, loadFromClipboard }
}
