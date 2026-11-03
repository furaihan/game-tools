# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Existing: Vite + React 19 + TypeScript, TanStack Router, Tailwind CSS v4, shadcn/ui (Base UI), lucide-react. Client-side only; no backend, no accounts.

## Users

7 Days to Die players, server admins, and modders who need to produce working game configuration rather than hand-write it. They are at a desktop, mid-task, usually with the game, a server config folder, or a forum thread open beside the browser.

## Product Purpose

Game Tools is a browser toolbox of small, single-purpose utilities for one game. A visitor picks a tool, does one job, and leaves with a file or a string they can paste into the game. Success is a finished artifact, not time on site.

## Positioning

Everything runs in the browser with nothing to install and no account, and each tool is built against the real shape of the game's data — the biome map geometry the world generator actually consumes, the sandbox option set the game actually defines — rather than against a generic generator.

## Operating Context

Work happens in short, focused sessions next to the game install or a rented server's config files. Output is carried by hand: a map image for the world folder, a code string for a server setting. Nothing is saved server-side, so a run has to be legible and repeatable while the tab is open.

## Capabilities and Constraints

- **Biome Layout Generator** (`/7dtd/biome-layout-generator`) — generates biome layout maps for 7 Days to Die.
- **Sandbox Codec** (`/7dtd/sandbox-codec`) — encodes and decodes sandbox data for 7 Days to Die.
- The registry lives in `src/shared/tool-registry/tool-list.ts`; the landing page reads from it and must render whatever it contains, including an empty state.
- Tool routes and titles are fixed. The landing page is the only surface in scope for a visual redesign; tool screens keep their current appearance.

## Brand Commitments

- **Palette is fixed.** The existing `src/index.css` tokens (warm parchment background and deep pine primary in light; near-black background and mint primary in dark) are a binding constraint, not a starting point.
- **Dark theme stays the default.**
- **7 Days to Die vocabulary stays visible** — biomes, voxels, maps, sandbox settings, game data.
- The name "Game Tools" and the gamepad brand mark stay.
- A technical, machine-honest voice that shows real values rather than decorative ones.

## Evidence on Hand

Two real tools, real descriptions, real routes. No testimonials, case studies, press, customer counts, or benchmarks exist — future work must not fabricate them. Any sample data shown must be honestly generated or labeled as illustrative.

## Product Principles

1. Show the artifact, not the marketing: what a tool produces is the strongest thing the page can put in front of a visitor.
2. One glance to a decision — a visitor should reach the right tool without reading a paragraph.
3. Density is respect: this audience reads dense technical surfaces comfortably and distrusts padding.
4. Honesty in the details; every number on screen should mean something.
5. Never break the tool screens; the landing page is the only surface in scope.

## Accessibility & Inclusion

Baseline: keyboard reachable controls, visible focus, WCAG AA contrast on body text in both themes, and `prefers-reduced-motion` respected for any motion.
