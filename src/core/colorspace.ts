export function rgbToXyz(r: number, g: number, b: number): [number, number, number] {
  let rn = r / 255
  let gn = g / 255
  let bn = b / 255

  rn = rn > 0.04045 ? Math.pow((rn + 0.055) / 1.055, 2.4) : rn / 12.92
  gn = gn > 0.04045 ? Math.pow((gn + 0.055) / 1.055, 2.4) : gn / 12.92
  bn = bn > 0.04045 ? Math.pow((bn + 0.055) / 1.055, 2.4) : bn / 12.92

  const x = rn * 0.4124564 + gn * 0.3575761 + bn * 0.1804375
  const y = rn * 0.2126729 + gn * 0.7151522 + bn * 0.0721750
  const z = rn * 0.0193339 + gn * 0.1191920 + bn * 0.9503041

  return [x, y, z]
}

export function xyzToLab(x: number, y: number, z: number): [number, number, number] {
  const xn = 0.95047
  const yn = 1.0
  const zn = 1.08883

  const fx = x / xn > 0.008856 ? Math.cbrt(x / xn) : 7.787 * (x / xn) + 16 / 116
  const fy = y / yn > 0.008856 ? Math.cbrt(y / yn) : 7.787 * (y / yn) + 16 / 116
  const fz = z / zn > 0.008856 ? Math.cbrt(z / zn) : 7.787 * (z / zn) + 16 / 116

  const L = 116 * fy - 16
  const a = 500 * (fx - fy)
  const b = 200 * (fy - fz)

  return [L, a, b]
}

export function rgbToLab(r: number, g: number, b: number): [number, number, number] {
  const [x, y, z] = rgbToXyz(r, g, b)
  return xyzToLab(x, y, z)
}

export function labToXyz(L: number, a: number, b: number): [number, number, number] {
  const fy = (L + 16) / 116
  const fx = a / 500 + fy
  const fz = fy - b / 200

  const xn = 0.95047
  const yn = 1.0
  const zn = 1.08883

  const x = (fx ** 3 > 0.008856 ? fx ** 3 : (116 * fx - 16) / 7.787) * xn
  const y = (L > 8 ? ((L + 16) / 116) ** 3 : L / 7.787) * yn
  const z = (fz ** 3 > 0.008856 ? fz ** 3 : (116 * fz - 16) / 7.787) * zn

  return [x, y, z]
}

export function xyzToRgb(x: number, y: number, z: number): [number, number, number] {
  let r = x * 3.2404542 + y * -1.5371385 + z * -0.4985314
  let g = x * -0.9692660 + y * 1.8760108 + z * 0.0415560
  let b = x * 0.0556434 + y * -0.2040259 + z * 1.0572252

  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : r * 12.92
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : g * 12.92
  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : b * 12.92

  const ri = Math.round(Math.max(0, Math.min(255, r * 255)))
  const gi = Math.round(Math.max(0, Math.min(255, g * 255)))
  const bi = Math.round(Math.max(0, Math.min(255, b * 255)))

  return [ri, gi, bi]
}

export function labToRgb(L: number, a: number, b: number): [number, number, number] {
  const [x, y, z] = labToXyz(L, a, b)
  return xyzToRgb(x, y, z)
}

export function imageDataToLAB(data: Uint8ClampedArray): Float64Array {
  const len = data.length / 4
  const lab = new Float64Array(len * 3)

  for (let i = 0; i < len; i++) {
    const off = i * 4
    const [L, a, b] = rgbToLab(data[off], data[off + 1], data[off + 2])
    lab[i * 3] = L
    lab[i * 3 + 1] = a
    lab[i * 3 + 2] = b
  }

  return lab
}
