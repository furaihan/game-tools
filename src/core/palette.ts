import type { Biome, PaletteColor } from '@/types'
import { rgbToLab } from './colorspace'

export const OFFICIAL_PALETTE: PaletteColor[] = [
  {
    biome: 'forest',
    rgb: [0, 64, 0],
    lab: rgbToLab(0, 64, 0),
    hex: '#004000',
  },
  {
    biome: 'burntForest',
    rgb: [186, 0, 255],
    lab: rgbToLab(186, 0, 255),
    hex: '#BA00FF',
  },
  {
    biome: 'desert',
    rgb: [255, 228, 119],
    lab: rgbToLab(255, 228, 119),
    hex: '#FFE477',
  },
  {
    biome: 'snow',
    rgb: [255, 255, 255],
    lab: rgbToLab(255, 255, 255),
    hex: '#FFFFFF',
  },
  {
    biome: 'wasteland',
    rgb: [255, 168, 0],
    lab: rgbToLab(255, 168, 0),
    hex: '#FFA800',
  },
]

const LAB_CACHE = new Map<string, [number, number, number]>()
OFFICIAL_PALETTE.forEach((c) => LAB_CACHE.set(c.biome, c.lab))

export function findNearestBiome(lab: [number, number, number]): Biome {
  let minDist = Infinity
  let nearest = OFFICIAL_PALETTE[0].biome

  for (const color of OFFICIAL_PALETTE) {
    const d = deltaE76(lab, color.lab)
    if (d < minDist) {
      minDist = d
      nearest = color.biome
    }
  }

  return nearest
}

export function biomeToRGB(biome: Biome): [number, number, number] {
  const color = OFFICIAL_PALETTE.find((c) => c.biome === biome)
  if (!color) return [0, 0, 0]
  return color.rgb
}

export function isValidBiomePixel(r: number, g: number, b: number): boolean {
  return OFFICIAL_PALETTE.some(
    (c) => c.rgb[0] === r && c.rgb[1] === g && c.rgb[2] === b,
  )
}

export function closestPaletteLAB(lab: [number, number, number]): { biome: Biome; lab: [number, number, number]; rgb: [number, number, number] } {
  let minDist = Infinity
  let closest = OFFICIAL_PALETTE[0]

  for (const color of OFFICIAL_PALETTE) {
    const d = deltaE76(lab, color.lab)
    if (d < minDist) {
      minDist = d
      closest = color
    }
  }

  return { biome: closest.biome, lab: closest.lab, rgb: closest.rgb }
}

function deltaE76(a: [number, number, number], b: [number, number, number]): number {
  const dl = a[0] - b[0]
  const da = a[1] - b[1]
  const db = a[2] - b[2]
  return dl * dl + da * da + db * db
}
