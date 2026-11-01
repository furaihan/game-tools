import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardDescription, CardTitle } from '@/shared/ui/card'
import { ArrowUpRight, Gamepad2Icon } from 'lucide-react'
import { tools } from '@/shared/tool-registry/tool-list'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const pad = (n: number) => String(n).padStart(2, '0')

function HomePage() {
  return (
    <div className="w-full p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        {/* ── Header ─────────────────────────────────────────── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.25em] opacity-60">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            <Gamepad2Icon className="h-3.5 w-3.5" />
            Toolbox — Index
          </div>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-x-10 gap-y-5 border-b-2 border-primary pb-6">
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl">
              Available Tools
              <sup className="ml-2 font-mono text-sm font-normal opacity-50">
                {pad(tools.length)}
              </sup>
            </h2>
            <div className="max-w-xs md:text-right">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-40">
                // select to launch
              </p>
              <p className="mt-2 text-sm leading-relaxed opacity-60">
                Pick a tool from the index below to get started.
              </p>
            </div>
          </div>
        </header>

        {/* ── Tool index ─────────────────────────────────────── */}
        <div className="grid gap-4 sm:grid-cols-2">
          {tools.map((tool, i) => {
            const Icon = tool.icon
            return (
              <Link
                key={tool.href}
                to={tool.href}
                data-testid={`tool-card-${tool.href.replace(/^\//, '').replace(/\//g, '-')}`}
                className="group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Card className="relative flex h-full flex-col overflow-hidden p-6 transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-lg">
                  {/* top sweep line */}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-500 ease-out group-hover:scale-x-100"
                  />
                  {/* ghost index numeral */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-4 -right-1 select-none font-mono text-7xl font-black leading-none opacity-[0.06] transition-opacity duration-300 group-hover:opacity-[0.12]"
                  >
                    {pad(i + 1)}
                  </span>

                  <div className="flex items-start justify-between">
                    <span className="border px-1.5 py-0.5 font-mono text-[10px] tracking-widest opacity-50 transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:opacity-100">
                      {pad(i + 1)}
                    </span>
                    <span className="flex h-11 w-11 items-center justify-center border transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>

                  <div className="mt-6 flex flex-1 flex-col">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg font-semibold tracking-tight">
                        {tool.title}
                      </CardTitle>
                      <ArrowUpRight className="h-4 w-4 -translate-x-1 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-70" />
                    </div>
                    <CardDescription className="mt-2 text-sm leading-relaxed opacity-60">
                      {tool.description}
                    </CardDescription>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-dashed pt-3 font-mono text-[10px] uppercase tracking-[0.15em] opacity-40 transition-opacity duration-300 group-hover:opacity-90">
                    <span>{tool.href}</span>
                    <span>Open →</span>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* ── Empty state ────────────────────────────────────── */}
        {tools.length === 0 && (
          <div className="flex flex-col items-center gap-4 border border-dashed px-6 py-20 text-center">
            <Gamepad2Icon className="h-8 w-8 opacity-25" />
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] opacity-50">
              No tools registered yet
            </p>
          </div>
        )}

        {/* ── Footer strip ───────────────────────────────────── */}
        {tools.length > 0 && (
          <footer className="mt-10 flex items-center justify-between border-t pt-4 font-mono text-[10px] uppercase tracking-[0.2em] opacity-40">
            <span>End of index</span>
            <span>{pad(tools.length)} entries</span>
          </footer>
        )}
      </div>
    </div>
  )
}