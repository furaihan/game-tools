import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ATLAS_GRID,
  PROBE_POINTS,
  buildAtlas,
  plateGeometry,
  sheetPercent,
  type Atlas,
} from '@/features/landing/core/atlas-map'
import { cn } from '@/shared/utils/utils'

/**
 * The plate is drawn from real generator output: biome cells, then the
 * marching-squares contours of that same field. No traced geography. The two
 * survey marks are the tools' probes, and the leaders are drawn between a probe
 * and the callout that points at it — real geometry, not decoration.
 *
 * Motion is the sheet being read. It inks itself once on arrival; engaging a
 * tool then swings the plate's focus onto that tool's probe and a ring answers
 * there. Values are tweened inside the paint loop, so moving between callouts
 * retargets mid-flight instead of snapping. Nothing repaints while the pointer
 * rests.
 */

export type AtlasHighlight = 'biome' | 'codec' | null

/** A callout anchor, in canvas CSS pixels. */
export type Leader = { id: Exclude<AtlasHighlight, null>; x: number; y: number }

const PROBE_IDS = ['biome', 'codec'] as const

/** Exponential ease-out: the plate settles, it never bounces. */
const ease = (t: number) => 1 - Math.pow(1 - t, 3.4)

/** One value on its way somewhere. Re-aiming mid-flight starts from where it is. */
type Track = { v: number; from: number; to: number; at: number; dur: number }

const still = (v = 0): Track => ({ v, from: v, to: v, at: 0, dur: 0 })
const settled = (t: Track) => t.v === t.to

/**
 * Distance sets the duration: a small nudge is not worth a long transition.
 * Letting go is quicker than taking hold, so leaving a probe costs less time.
 */
function aim(t: Track, to: number, at: number, instant: boolean) {
  if (t.to === to) return
  const release = to === 0
  t.from = t.v
  t.to = to
  t.at = at
  t.dur = instant ? 0 : Math.round(Math.min(420, 120 + Math.abs(to - t.v) * 320) * (release ? 0.7 : 1))
}

function advance(t: Track, now: number) {
  if (t.dur <= 0) {
    t.v = t.to
    return
  }
  const k = Math.min(1, (now - t.at) / t.dur)
  t.v = k >= 1 ? t.to : t.from + (t.to - t.from) * ease(k)
}

function hexToRgb(hex: string) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return m
    ? ([parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] as const)
    : ([0, 0, 0] as const)
}

/**
 * Resolve a CSS custom property to an 8-bit RGB triple. Painting one pixel on a
 * throwaway canvas lets the browser do the colour conversion, so oklch() tokens
 * come back exact instead of being guessed.
 */
function readTriple(name: string, fallback: readonly [number, number, number]) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  if (!raw) return fallback

  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return fallback

  ctx.fillStyle = raw
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
  if (a === 0) return fallback
  return [r, g, b] as const
}

const luminance = (rgb: readonly [number, number, number]) =>
  0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]

type Props = {
  seed: number
  biomeColors: string[]
  highlight: AtlasHighlight
  leaders: Leader[]
  onReady?: (atlas: Atlas) => void
  className?: string
}

export function AtlasPlate({ seed, biomeColors, highlight, leaders, onReady, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const playedRef = useRef(false)
  const inkedTheme = useRef<number | null>(null)
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [theme, setTheme] = useState(0)
  const [frame, setFrame] = useState({ w: 0, h: 0 })
  const atlas = useMemo(() => buildAtlas(seed, ATLAS_GRID), [seed])

  // Engagement outlives React's render loop: the canvas is repainted from here,
  // so the pointer only aims a value instead of triggering a re-render.
  const anim = useRef({
    biome: { live: still(), dim: still() },
    codec: { live: still(), dim: still() },
    ping: 0,
  })

  // Region labels are laid out from the measured frame, so they track resizing.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      if (width && height) setFrame({ w: width, h: height })
    })
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])

  const labels = useMemo(() => {
    if (!frame.w || !frame.h) return []
    return atlas.regions
      .filter((r) => r.coverage >= 0.02 && r.label)
      .map((r) => {
        const p = sheetPercent(r.label!.x, r.label!.y, frame.w, frame.h)
        return { ...r, ...p }
      })
      .filter((r) => r.x > 4 && r.x < 96 && r.y > 6 && r.y < 94)
  }, [atlas, frame])

  useEffect(() => {
    onReady?.(atlas)
  }, [atlas, onReady])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // The plate samples live palette tokens, so a theme flip has to repaint it.
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme((n) => n + 1))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = canvas.clientWidth || 1200
    const h = canvas.clientHeight || 900

    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // The plate is one survey sheet, larger than the frame so it runs off the edge.
    const { side, originX, originY } = plateGeometry(w, h)
    const step = side / (atlas.grid - 1)
    const toScreen = (gx: number, gy: number) =>
      [originX + gx * step, originY + gy * step] as const

    const cell = side / atlas.grid

    // Sample the live tokens once per paint: the palette stays the app's, not a copy.
    const g = readTriple('--background', [4, 6, 5])
    const accent = readTriple('--primary', [0, 243, 174])
    const strip = readTriple('--muted-foreground', [111, 139, 130])
    const dark = luminance(g) < 60
    // Overlay opacity is theme-aware: dark gets pulled back, light gets laid on.
    const overlay = dark ? 0.88 : 0.86
    const ink = accent.join(' ')

    const state = anim.current
    const start = performance.now()
    // A palette flip re-inks the same sheet on the new paper; resizing does not.
    const reink = inkedTheme.current !== null && inkedTheme.current !== theme
    inkedTheme.current = theme
    const fresh = !playedRef.current
    const introDur = reduced ? 0 : reink ? 720 : fresh ? 1500 : 0
    let painted = false
    let lastPaint = 0
    let raf = 0

    const paint = (reveal: number, ping: number) => {
      const liveBiome = state.biome.live.v
      const engaged = Math.max(liveBiome, state.codec.live.v)
      const cellAlpha = 0.3 + 0.32 * liveBiome
      const contourAlpha = 0.72 + 0.28 * engaged

      ctx.clearRect(0, 0, w, h)

      // 1. generated biome cells — the plate's ground
      for (let y = 0; y < atlas.grid; y++) {
        for (let x = 0; x < atlas.grid; x++) {
          const idx = atlas.field[y * atlas.grid + x]
          const base = biomeColors[idx]
          if (!base) continue
          const [r, gg, b] = hexToRgb(base)
          const k = idx === 0 ? Math.min(0.8, cellAlpha * 1.5) : cellAlpha
          ctx.fillStyle = `rgba(${r}, ${gg}, ${b}, ${k * reveal})`
          ctx.fillRect(originX + x * cell, originY + y * cell, cell + 0.7, cell + 0.7)
        }
      }

      // 2. the veil: the page's ground comes back over the sheet
      const veil = ctx.createLinearGradient(0, 0, w, 0)
      veil.addColorStop(0, `rgb(${g.join(' ')} / ${overlay})`)
      veil.addColorStop(0.3, `rgb(${g.join(' ')} / ${overlay * 0.9})`)
      veil.addColorStop(0.62, `rgb(${g.join(' ')} / ${overlay * 0.42})`)
      veil.addColorStop(1, `rgb(${g.join(' ')} / ${overlay * 0.58})`)
      ctx.fillStyle = veil
      ctx.fillRect(0, 0, w, h)

      const shade = ctx.createLinearGradient(0, 0, 0, h)
      shade.addColorStop(0, `rgb(${g.join(' ')} / ${overlay * 0.55})`)
      shade.addColorStop(0.36, `rgb(${g.join(' ')} / 0.02)`)
      shade.addColorStop(1, `rgb(${g.join(' ')} / ${overlay * 0.62})`)
      ctx.fillStyle = shade
      ctx.fillRect(0, 0, w, h)

      // 3. relief rings, faint
      ctx.lineWidth = 0.6
      ctx.strokeStyle = `rgb(${strip.join(' ')} / ${(dark ? 0.26 : 0.42) * reveal})`
      ctx.beginPath()
      for (const level of atlas.relief) {
        for (const [x1, y1, x2, y2] of level.segments) {
          const [ax, ay] = toScreen(x1, y1)
          const [bx, by] = toScreen(x2, y2)
          ctx.moveTo(ax, ay)
          ctx.lineTo(bx, by)
        }
      }
      ctx.stroke()

      // 4. biome boundaries — the drawn contour the plate is read for. Engaging
      //    the biome tool draws the field's own boundary in.
      ctx.lineCap = 'round'
      for (const contour of atlas.contours) {
        const emphasis = liveBiome * (contour.biomeIndex === 0 ? 1 : 0)
        for (let i = 0; i < contour.levels.length; i++) {
          const level = contour.levels[i]
          const alpha = (contourAlpha + 0.28 * emphasis) * (i === 0 ? 1 : 0.4)
          ctx.strokeStyle = `rgb(${ink} / ${Math.min(1, alpha * reveal)})`
          ctx.lineWidth = i === 0 ? 1.1 + emphasis * 0.55 : 0.6
          ctx.beginPath()
          for (const [x1, y1, x2, y2] of level.segments) {
            const [ax, ay] = toScreen(x1, y1)
            const [bx, by] = toScreen(x2, y2)
            ctx.moveTo(ax, ay)
            ctx.lineTo(bx, by)
          }
          ctx.stroke()
        }
      }

      // 5. leaders, then the two probes sitting on their own coordinates
      for (const leader of leaders) {
        const mark = state[leader.id]
        const opacity = Math.min(1, 0.3 + mark.live.v * 0.65 - mark.dim.v * 0.16)
        const probe = PROBE_POINTS[leader.id]
        const px = probe.u * w
        const py = probe.v * h
        const elbow = leader.x - 26

        // elbow: horizontal away from the probe, then a straight run to the callout
        ctx.strokeStyle = `rgb(${ink} / ${opacity})`
        ctx.lineWidth = 1 + mark.live.v * 0.25
        ctx.beginPath()
        ctx.moveTo(px, py)
        ctx.lineTo(elbow, py)
        ctx.lineTo(elbow, leader.y)
        ctx.lineTo(leader.x, leader.y)
        ctx.stroke()

        ctx.fillStyle = `rgb(${ink} / ${opacity})`
        ctx.beginPath()
        ctx.arc(leader.x, leader.y, 1.8 + mark.live.v * 0.8, 0, Math.PI * 2)
        ctx.fill()
      }

      for (const id of PROBE_IDS) {
        const mark = state[id]
        const live = mark.live.v
        const presence = Math.max(0, 1 - mark.dim.v * 0.9)
        if (presence <= 0.01) continue
        const cx = PROBE_POINTS[id].u * w
        const cy = PROBE_POINTS[id].v * h
        const r = 7 + live * 15

        // the live probe lifts off the sheet on its own halo
        if (live > 0.01) {
          ctx.fillStyle = `rgb(${ink} / ${0.16 * live})`
          ctx.beginPath()
          ctx.arc(cx, cy, r + 10, 0, Math.PI * 2)
          ctx.fill()
        }

        // the ring that answers the pointer, once per engagement
        if (state.ping && live > 0.4) {
          ctx.strokeStyle = `rgb(${ink} / ${0.55 * (1 - ping) * live})`
          ctx.lineWidth = 1.1
          ctx.beginPath()
          ctx.arc(cx, cy, 9 + ping * 34, 0, Math.PI * 2)
          ctx.stroke()
        }

        ctx.strokeStyle = `rgb(${ink} / ${(0.8 + live * 0.15) * presence})`
        ctx.lineWidth = 1 + live * 0.25
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.stroke()

        // crosshairs grow out of the probe as it is engaged
        if (live > 0.01) {
          const arm = r - 7
          ctx.strokeStyle = `rgb(${ink} / ${0.95 * live})`
          ctx.beginPath()
          for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]] as const) {
            ctx.moveTo(cx + dx * arm, cy + dy * arm)
            ctx.lineTo(cx + dx * (arm + 16 * live), cy + dy * (arm + 16 * live))
          }
          ctx.stroke()
        }

        ctx.fillStyle = `rgb(${ink} / ${presence})`
        ctx.beginPath()
        ctx.arc(cx, cy, 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const draw = (now: number) => {
      const intro = introDur === 0 ? 1 : Math.min(1, (now - start) / introDur)
      const reveal = ease(intro)
      const introDone = intro >= 1
      if (introDone) playedRef.current = true

      let tweening = false
      for (const id of PROBE_IDS) {
        aim(state[id].live, highlight === id ? 1 : 0, now, reduced)
        aim(state[id].dim, highlight !== null && highlight !== id ? 1 : 0, now, reduced)
        advance(state[id].live, now)
        advance(state[id].dim, now)
        if (!settled(state[id].live) || !settled(state[id].dim)) tweening = true
      }

      // A ring keeps answering while a probe is held. Scheduling it from the
      // engagement itself means resting the pointer never leaves one mid-flight.
      // Reduced motion keeps the engagement but drops the travelling ring.
      const engaged = Math.max(state.biome.live.v, state.codec.live.v)
      if (engaged > 0.05 && !reduced) {
        if (!state.ping) state.ping = now
      } else {
        state.ping = 0
      }
      const ringing = state.ping > 0
      const ping = ringing ? ((now - state.ping) % 1600) / 1600 : 0

      if (!painted || !introDone || tweening || ringing) {
        // A lone ring is slow enough to read at 30fps; everything else is 60.
        const quiet = painted && ringing && !tweening && introDone
        if (!quiet || now - lastPaint >= 32) {
          lastPaint = now
          painted = true
          paint(reveal, ping)
        }
        raf = requestAnimationFrame(draw)
      }
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [atlas, biomeColors, highlight, leaders, reduced, theme])

  return (
    <div className={cn('relative h-full w-full', className)}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="h-full w-full"
        data-testid="atlas-plate-canvas"
      />

      {/* graticule ticks: the sheet's own coordinates, on the real map scale */}
      {[1 / 3, 2 / 3].map((f, i) => (
        <span
          key={'gx' + i}
          className="absolute hidden -translate-y-1/2 font-mono text-[8px] tracking-[0.2em] text-foreground/25 lg:block"
          style={{ left: 'calc(0.75rem + 0px)', top: `${f * 100}%` }}
        >
          {String(Math.round(f * 2048)).padStart(4, '0')}
        </span>
      ))}
      {[1 / 3, 2 / 3].map((f, i) => (
        <span
          key={'gy' + i}
          className="absolute hidden -translate-x-1/2 font-mono text-[8px] tracking-[0.2em] text-foreground/25 lg:block"
          style={{ left: `${f * 100}%`, bottom: '0.5rem' }}
        >
          {String(Math.round(f * 2048)).padStart(4, '0')}
        </span>
      ))}

      {/* region names, placed on the real centroids of the generated field */}
      {labels.map((region) => (
        <span
          key={region.index}
          className="absolute hidden -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.28em] text-primary/45 lg:block"
          style={{ left: `${region.x}%`, top: `${region.y}%` }}
        >
          {region.name}
        </span>
      ))}
    </div>
  )
}