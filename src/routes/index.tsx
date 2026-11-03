import { createFileRoute, Link } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { tools } from '@/shared/tool-registry/tool-list'
import { DEFAULT_BIOMES } from '@/features/biome-generator/context/biome-generator-context'
import { AtlasPlate, type AtlasHighlight, type Leader } from '@/features/landing/components/AtlasPlate'
import { ATLAS_GRID, PROBE_POINTS, type Atlas } from '@/features/landing/core/atlas-map'
import { SandboxOption } from '@/features/sandbox-codec/core/sandbox-option.enum'
import { useReducedMotion } from '@/shared/hooks/use-reduced-motion'

export const Route = createFileRoute('/')({
  component: AtlasPage,
})

/* ── survey facts, read from the tools themselves ───────────────────────── */

const SEED = 8871
/** Largest map size the Biome Layout Generator offers (its RESOLUTIONS list). */
const MAP_MAX = 2048

// The codec's option table is large; the landing page only needs its size,
// so it counts the enum the definitions are keyed by rather than the data file.
const OPTION_COUNT = Object.keys(SandboxOption).length

/** Registry href → the probe on the plate that tool owns. */
const PROBE_OF: Record<string, Exclude<AtlasHighlight, null>> = {
  'biome-layout-generator': 'biome',
  'sandbox-codec': 'codec',
}

const PROBE_LABEL: Record<string, string> = {
  biome: 'biome map',
  codec: 'sandbox code',
}

/** The probe's world coordinate, derived — never typed. */
const probeRef = (id: Exclude<AtlasHighlight, null>) =>
  `${Math.round(PROBE_POINTS[id].u * MAP_MAX)} · ${Math.round(PROBE_POINTS[id].v * MAP_MAX)}`

const probeKey = (href: string) => href.replace(/^\/7dtd\//, '')

const pad = (n: number) => String(n).padStart(2, '0')

function AtlasPage() {
  const [highlight, setHighlight] = useState<AtlasHighlight>(null)
  const [atlas, setAtlas] = useState<Atlas | null>(null)
  const [leaders, setLeaders] = useState<Leader[]>([])
  const listRef = useRef<HTMLOListElement>(null)
  const reduced = useReducedMotion()

  const biomeColors = useMemo(() => DEFAULT_BIOMES.map((b) => b.color), [])
  const handleRegions = useCallback((next: Atlas) => setAtlas(next), [])
  const clear = useCallback(() => setHighlight(null), [])

  // Measure where each callout's leader should land, so the plate can draw it.
  // Only wide layouts put the callouts beside the map; below that they stack.
  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const measure = () => {
      const wide = window.matchMedia('(min-width: 1024px)').matches
      if (!wide) {
        setLeaders([])
        return
      }
      // Leaders are drawn on the canvas, so they must be measured against it.
      const canvas = document.querySelector<HTMLElement>('[data-testid="atlas-plate-canvas"]')
      if (!canvas) return
      const root = canvas.getBoundingClientRect()
      const next: Leader[] = []
      for (const item of Array.from(list.querySelectorAll<HTMLElement>('[data-probe]'))) {
        const id = item.dataset.probe as Exclude<AtlasHighlight, null>
        const card = item.querySelector<HTMLElement>('[data-testid^="tool-card-"]')
        if (!card) continue
        const box = card.getBoundingClientRect()
        const dot = item.querySelector<HTMLElement>('[data-leader-dot]')
        const dotBox = dot ? dot.getBoundingClientRect() : box
        next.push({
          id,
          x: dotBox.left - root.left + dotBox.width / 2,
          y: dotBox.top - root.top + dotBox.height / 2,
        })
      }
      setLeaders(next)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const topRegions = (atlas?.regions ?? [])
    .filter((r) => r.coverage > 0)
    .sort((a, b) => b.coverage - a.coverage)

  return (
    <div className="relative flex min-h-full w-full flex-1 flex-col overflow-hidden bg-background selection:bg-primary selection:text-primary-foreground">
      {/* ── the plate ─────────────────────────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <AtlasPlate
          seed={SEED}
          biomeColors={biomeColors}
          highlight={highlight}
          leaders={leaders}
          onReady={handleRegions}
        />
        <div className="absolute inset-x-0 top-1/3 hidden h-px bg-foreground/[0.07] lg:block" />
        <div className="absolute inset-x-0 top-2/3 hidden h-px bg-foreground/[0.07] lg:block" />
        <div className="absolute inset-y-0 left-[38%] hidden w-px bg-foreground/[0.07] lg:block" />
        <div className="absolute inset-y-0 right-[24%] hidden w-px bg-foreground/[0.07] lg:block" />
      </div>

      {/* ── the page ──────────────────────────────────────────── */}
      <div className="relative flex min-h-full flex-col px-6 pb-8 pt-9 md:px-10 md:pt-11 lg:px-12">
        <header
          className="animate-sheet-in flex items-start justify-between gap-6"
          style={{ animationDelay: '40ms' }}
        >
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.34em] text-primary">
              Game Tools
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.26em] text-foreground/85 dark:text-foreground/70 sm:inline">
              7 Days to Die
            </span>
          </div>
          <dl className="hidden gap-6 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/85 dark:text-foreground/70 sm:flex md:gap-8">
            <div className="flex gap-2">
              <dt>max map</dt>
              <dd className="tabular-nums text-foreground">{MAP_MAX}²</dd>
            </div>
            <div className="flex gap-2">
              <dt>seed</dt>
              <dd className="tabular-nums text-foreground">{SEED}</dd>
            </div>
            <div className="flex gap-2">
              <dt>tools</dt>
              <dd className="tabular-nums text-foreground">{pad(tools.length)}</dd>
            </div>
          </dl>
        </header>

        <div className="flex flex-1 flex-col gap-10 pt-8 lg:flex-row lg:items-start lg:justify-between lg:gap-8 lg:pt-10">
          {/* ── the offer ────────────────────────────────────── */}
          <div className="flex max-w-xl flex-col lg:max-w-[36rem] lg:self-stretch">
            <h1 className="animate-plot-heading text-balance text-[2.4rem] font-semibold leading-[0.94] tracking-[-0.03em] sm:text-5xl lg:text-[3.5rem]">
              Build the <span className="text-primary">biome map</span> and{' '}
              <span className="text-primary">sandbox code</span> 7 Days to Die reads.
            </h1>
            <p
              className="animate-sheet-in mt-4 max-w-md text-pretty text-[0.95rem] leading-relaxed text-foreground/85 dark:text-foreground/70 md:text-base"
              style={{ animationDelay: '180ms' }}
            >
              Two single-purpose tools. One exports a map image for your world folder; the
              other encodes sandbox settings into a code string for your server config, and
              decodes one back. Both run in this tab.
            </p>

            <dl
              className="animate-sheet-in mt-8 flex flex-wrap gap-x-8 gap-y-4 border-t border-foreground/15 pt-4 lg:mt-auto"
              style={{ animationDelay: '260ms' }}
            >
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.26em] text-foreground/85 dark:text-foreground/70">
                  Output
                </dt>
                <dd className="mt-1 text-sm">
                  PNG map &middot; <span className="text-primary">code string</span>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.26em] text-foreground/85 dark:text-foreground/70">
                  Uploads
                </dt>
                <dd className="mt-1 text-sm">
                  none &mdash; <span className="text-primary">runs locally</span>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.26em] text-foreground/85 dark:text-foreground/70">
                  Account
                </dt>
                <dd className="mt-1 text-sm">none needed</dd>
              </div>
            </dl>
          </div>

          {/* ── the probes: each tool is a callout pinned to the map ── */}
          <ol
            ref={listRef}
            className="flex w-full flex-col gap-4 pb-2 lg:w-[25rem] lg:gap-10 lg:self-center lg:pb-8 lg:pt-0"
          >
            {tools.map((tool, i) => {
              const Icon = tool.icon
              const key = probeKey(tool.href as string)
              const probe = PROBE_OF[key] ?? null
              const live = probe !== null && highlight === probe
              const dim = highlight !== null && !live

              return (
                <li
                  key={tool.href}
                  data-probe={probe ?? undefined}
                  className={`animate-sheet-in relative w-full lg:pl-9 ${
                    i % 2 === 1 ? 'lg:ml-auto lg:w-[calc(100%-3.25rem)]' : ''
                  }`}
                  style={{ animationDelay: `${320 + i * 90}ms` }}
                >
                  {/* the anchor the plate's leader terminates on */}
                  <span
                    data-leader-dot
                    aria-hidden
                    className="absolute left-[-3px] top-[1.72rem] hidden h-[7px] w-[7px] rounded-full border border-primary transition-colors duration-300 ease-out lg:block"
                    style={{
                      backgroundColor: live ? 'var(--primary)' : 'var(--background)',
                    }}
                  />

                  {/* the plate answers: a ring leaves the mark when its tool is engaged */}
                  {live && !reduced && (
                    <span
                      data-testid={`leader-ping-${key}`}
                      aria-hidden
                      className="animate-probe-ping pointer-events-none absolute left-[-8px] top-[calc(1.72rem-5px)] hidden h-[17px] w-[17px] rounded-full border-[1.5px] border-primary/60 lg:block"
                    />
                  )}

                  <Link
                    to={tool.href}
                    data-testid={`tool-card-${key}`}
                    onMouseEnter={() => setHighlight(probe)}
                    onMouseLeave={clear}
                    onFocus={() => setHighlight(probe)}
                    onBlur={clear}
                    className={`group relative block border border-foreground/15 bg-[color-mix(in_oklch,var(--background)_86%,transparent)] px-4 py-3.5 backdrop-blur-[3px] transition-[border-color,background-color,opacity,box-shadow,transform] duration-300 ease-out hover:border-primary/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:px-5 md:py-4 ${
                      live ? 'border-primary/60 lg:-translate-x-1.5' : ''
                    }`}
                    style={{
                      // the other callout recedes, but its copy stays readable
                      opacity: dim ? 0.62 : 1,
                      boxShadow: live
                        ? '0 16px 34px -20px color-mix(in oklch, var(--primary) 50%, transparent)'
                        : '0 0 0 0 transparent',
                    }}
                  >
                    <span
                      aria-hidden
                      className="absolute inset-y-0 left-0 w-px origin-top scale-y-0 bg-primary transition-transform duration-500 ease-out group-hover:scale-y-100 group-focus-visible:scale-y-100"
                    />

                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-2 font-mono text-[9px] uppercase tracking-[0.24em] text-foreground/85 dark:text-foreground/70">
                          <span className="tabular-nums">{pad(i + 1)}</span>
                          <span className="opacity-60">/</span>
                          <span>{probe ? PROBE_LABEL[probe] : 'tool'}</span>
                          <span className="tabular-nums opacity-60">{probe ? probeRef(probe) : ''}</span>
                        </div>
                        <h2 className="mt-1.5 truncate text-[1.05rem] font-semibold tracking-[-0.02em] md:text-lg">
                          {tool.title}
                        </h2>
                      </div>

                      <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-foreground/20 text-primary transition-colors duration-300 group-hover:border-primary/70 group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-4 w-4 transition-transform duration-300 ease-out group-hover:-rotate-6" />
                      </span>
                    </div>

                    <p className="mt-2 text-[13px] leading-relaxed text-foreground/85 dark:text-foreground/70">
                      {tool.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-3 border-t border-dashed border-foreground/15 pt-2.5 font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/85 dark:text-foreground/70">
                      <span className="truncate normal-case tracking-normal">{tool.href}</span>
                      <span className="flex shrink-0 items-center gap-1.5 text-primary">
                        open
                        <ArrowUpRight className="h-3 w-3 -translate-x-0.5 translate-y-0.5 transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0" />
                      </span>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ol>
        </div>

        {tools.length === 0 && (
          <div className="mt-10 max-w-xl border border-dashed border-foreground/25 px-6 py-16 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-foreground/85 dark:text-foreground/70">
              No tools registered yet
            </p>
          </div>
        )}

        <div
          className="animate-sheet-in mt-6 flex items-end justify-between gap-6 border-t border-foreground/15 pt-3 font-mono text-[9px] uppercase tracking-[0.24em] text-foreground/85 dark:text-foreground/70"
          style={{ animationDelay: '420ms' }}
        >
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-primary" />
            read from the registry
          </span>
          <span className="flex items-end gap-3">
            <span className="hidden leading-relaxed sm:inline">preview · {ATLAS_GRID}² sample</span>
            <span className="block h-8 w-px bg-[linear-gradient(0deg,var(--primary),transparent)]" />
          </span>
        </div>
      </div>

      {/* ── survey readout, live from the generated field ─────── */}
      <aside
        className="animate-sheet-in pointer-events-none absolute bottom-20 left-6 hidden w-[13.5rem] xl:right-12 xl:left-auto flex-col gap-1.5 border-l border-foreground/15 pl-4 md:flex lg:right-12"
        style={{ animationDelay: '500ms' }}
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-foreground/85 dark:text-foreground/70">
          Biome coverage
        </span>
        {topRegions.map((region) => (
          <div key={region.index} className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="h-2 w-2 shrink-0"
              style={{ backgroundColor: DEFAULT_BIOMES[region.index]?.color }}
            />
            <span className="flex-1 truncate text-[11px] text-foreground/85">{region.name}</span>
            <span className="font-mono text-[10px] tabular-nums text-foreground/85 dark:text-foreground/70">
              {(region.coverage * 100).toFixed(1)}%
            </span>
          </div>
        ))}
        <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/85 dark:text-foreground/70">
          {OPTION_COUNT} sandbox options supported
        </span>
        <span className="mt-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-primary">
          <span className="h-px w-6 bg-primary" />
          seed {SEED} &middot; sampled {ATLAS_GRID}²
        </span>
      </aside>
    </div>
  )
}

export default AtlasPage