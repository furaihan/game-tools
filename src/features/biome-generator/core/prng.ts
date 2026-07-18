export function createPRNG(seed: number) {
  let z = (seed + 0x9E3779B9) >>> 0
  const s = new Uint32Array(4)
  for (let i = 0; i < 4; i++) {
    z = (z ^ (z >>> 16)) >>> 0
    z = Math.imul(z, 0x85EBCA6B)
    z = (z ^ (z >>> 13)) >>> 0
    z = Math.imul(z, 0xC2B2AE35)
    z = (z ^ (z >>> 16)) >>> 0
    s[i] = z
  }

  const rotl = (x: number, k: number) => ((x << k) | (x >>> (32 - k))) >>> 0

  return function() {
    const s0 = s[0], s1 = s[1], s3 = s[3]

    const result = (rotl((s0 + s3) >>> 0, 7) + s0) >>> 0

    const t = (s1 << 9) >>> 0
    s[2] = (s[2] ^ s0) >>> 0
    s[3] = (s[3] ^ s1) >>> 0
    s[1] = (s[1] ^ s[2]) >>> 0
    s[0] = (s[0] ^ s[3]) >>> 0
    s[2] = (s[2] ^ t) >>> 0
    s[3] = rotl(s[3], 11)

    return (result >>> 0) / 4294967296
  }
}
