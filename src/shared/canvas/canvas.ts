export function imageDataFromFile(file: File): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(img.src)
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, img.width, img.height)
      resolve(imageData)
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

export function imageDataFromBlob(blob: Blob): Promise<ImageData> {
  return imageDataFromFile(new File([blob], 'image'))
}

export function downscaleImageData(
  imageData: ImageData,
  maxDimension: number,
): ImageData {
  const { width, height } = imageData
  if (width <= maxDimension && height <= maxDimension) return imageData

  const scale = Math.min(maxDimension / width, maxDimension / height)
  const newWidth = Math.round(width * scale)
  const newHeight = Math.round(height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = newWidth
  canvas.height = newHeight
  const ctx = canvas.getContext('2d')!

  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = width
  tempCanvas.height = height
  tempCanvas.getContext('2d')!.putImageData(imageData, 0, 0)

  ctx.imageSmoothingEnabled = false
  ctx.drawImage(tempCanvas, 0, 0, newWidth, newHeight)

  return ctx.getImageData(0, 0, newWidth, newHeight)
}

export function upscaleLabelBuffer(
  labels: Uint8Array,
  srcWidth: number,
  srcHeight: number,
  dstWidth: number,
  dstHeight: number,
): Uint8Array {
  const result = new Uint8Array(dstWidth * dstHeight)

  for (let ty = 0; ty < dstHeight; ty++) {
    for (let tx = 0; tx < dstWidth; tx++) {
      const sx = Math.min(Math.floor((tx * srcWidth) / dstWidth), srcWidth - 1)
      const sy = Math.min(Math.floor((ty * srcHeight) / dstHeight), srcHeight - 1)
      result[ty * dstWidth + tx] = labels[sy * srcWidth + sx]
    }
  }

  return result
}

export function estimateProcessingTime(
  width: number,
  height: number,
): number {
  const pixels = width * height
  return Math.round(pixels / 100000)
}

export function isValidImageSize(
  width: number,
  height: number,
): { valid: boolean; message?: string } {
  if (width > 20000 || height > 20000) {
    return { valid: false, message: 'Image exceeds maximum size of 20000×20000 pixels' }
  }
  return { valid: true }
}

export function cropToSquare(
  imageData: ImageData,
  x: number,
  y: number,
  size: number,
): ImageData {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = imageData.width
  tempCanvas.height = imageData.height
  const tempCtx = tempCanvas.getContext('2d')!
  tempCtx.putImageData(imageData, 0, 0)

  ctx.drawImage(tempCanvas, x, y, size, size, 0, 0, size, size)
  return ctx.getImageData(0, 0, size, size)
}

export function padToSquare(imageData: ImageData): ImageData {
  const size = Math.max(imageData.width, imageData.height)
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  const offsetX = Math.floor((size - imageData.width) / 2)
  const offsetY = Math.floor((size - imageData.height) / 2)

  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = imageData.width
  tempCanvas.height = imageData.height
  tempCanvas.getContext('2d')!.putImageData(imageData, 0, 0)

  ctx.drawImage(tempCanvas, offsetX, offsetY)
  return ctx.getImageData(0, 0, size, size)
}

export function stretchToSquare(imageData: ImageData): ImageData {
  const size = Math.max(imageData.width, imageData.height)
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = imageData.width
  tempCanvas.height = imageData.height
  tempCanvas.getContext('2d')!.putImageData(imageData, 0, 0)

  ctx.imageSmoothingEnabled = false
  ctx.drawImage(tempCanvas, 0, 0, size, size)
  return ctx.getImageData(0, 0, size, size)
}

export function imageDataToBitmap(imageData: ImageData): Promise<ImageBitmap> {
  return createImageBitmap(imageData)
}
