# 7DTD Game Tools

A high-performance, modular web-based toolkit for **7 Days to Die (7DTD)** server administrators, modders, and players. Built with a modern, reactive stack, it is designed for speed, flexibility, and a polished user experience.

## Tools & Features

### Biome Layout Generator (`/7dtd/biome-layout-generator`)
A highly configurable procedural generation engine that allows creators to instantly design regional biome structures.

* **9 Generation Algorithms**: Craft layouts using Random Seeds, Territory Expansion, Random Walkers, Random Blobs, Cellular Growth, Probability Fields, Recursive Split, Weighted Expansion, and Biome Islands.
* **Noise Mode**: Utilize Simplex, Perlin, Fractal, or Worley noise fields with configurable frequency, octaves, persistence, and lacunarity.
* **Multithreaded Processing**: Offloads heavy noise calculations and median filtering to Web Workers so the UI never drops a frame.
* **Smart Presets**: Out-of-the-box configurations for 7 Days to Die (5 biomes), Minecraft (7 biomes), Valheim (9 biomes), and Standard Earth (9 biomes).

### Sandbox Codec (`/7dtd/sandbox-codec`)
An interactive encoder and decoder for the V3.0 Sandbox Server Preset Codes introduced in 7 Days to Die.

* **Bi-directional Encoding/Decoding**: Easily convert a compact alphanumeric string back into editable options or vice versa.
* **120+ Options Configured**: Covers all core gameplay multipliers, settings, and flags.
* **Live Code Preview**: Encodes in real-time as you tweak slider values, toggles, or drop-downs.
* **Dependency System**: Options react to user selections (e.g., setting XP Multiplier to 0 automatically hides and disables Show XP).
* **Schema-backed Safety**: Warns about invalid entries, unknown values, and out-of-range inputs gracefully without crashing the app.

## Architecture Overview

The app is built as a single-page application (SPA) with tool-scoped state management to ensure high modularity and zero coupling between different tool routes.

```mermaid
graph TD
    subgraph Client [Browser Client]
        App[Vite + React 19 App] --> Router[TanStack Router]
        Router --> Dash[Dashboard /]
        Router --> LayoutGen[Biome Layout Generator]
        Router --> Codec[Sandbox Codec]

        subgraph Biome Layout Generator Tool
            LayoutGen --> UI_Gen[UI Controls & Canvas Preview]
            UI_Gen --> Worker_Gen[Web Workers: biome-generator & filter]
            Worker_Gen -->|Transferable Buffers| UI_Gen
        end

        subgraph Sandbox Codec Tool
            Codec --> UI_Codec[UI panels: Encode & Decode]
            UI_Codec --> Codec_Lib[Codec Library: encode, decode, dependencies]
        end
    end
```

### Project Structure

```
src/
  features/                         — Self-contained tool modules
    biome-generator/                — Biome Layout Generator
      components/                   — UI components (Controls, Canvas, List)
      context/                      — Tool-scoped React Context
      core/                         — Pure generation algorithms (no React deps)
      workers/                      — Web Workers for offloaded generation
      types/                        — Tool-specific TypeScript types
    sandbox-codec/                  — Sandbox Codec
      components/                   — UI components (Panels, Controls)
      core/                         — Encode/decode library (no React deps)
  shared/                           — Cross-feature utilities (features → shared, never shared → features)
    ui/                             — shadcn/ui base components
    hooks/                          — Shared React hooks (useIsMobile)
    utils/                          — Utility functions (cn)
    canvas/                         — Canvas/ImageData utilities
    tool-registry/                  — Tool definitions (tool-list.ts)
    types/                          — Shared TypeScript types
    constants/                      — Shared constants (future use)
  app/                              — App-level framework setup
    theme/                          — ThemeProvider (dark/light mode)
    providers/                      — App-level providers
    router.ts                       — TanStack Router creation (extracted from main.tsx)
  routes/                           — TanStack Router file-based route pages
    7dtd/
      biome-layout-generator/
      sandbox-codec/
```

### Architecture Principles

- **Feature-first**: Each tool is fully self-contained under `features/<tool-name>/` with its own components, context, core logic, workers, and types.
- **One-way dependency**: Features import from `shared/`, never the reverse. Core logic (`features/*/core/`) is pure TypeScript with zero React or UI dependencies.
- **Shared baseline**: Cross-cutting concerns (shadcn/ui components, hooks, utils) live in `shared/` and are used by all features.

## Tech Stack

- **Runtime**: Bun (v1.3.14+) — fast package installer and task runner
- **Bundler**: Vite 8 + React 19 — fast refresh and advanced rendering
- **Language**: TypeScript 7 — strict mode, bundler module resolution, `verbatimModuleSyntax`
- **Routing**: TanStack Router v1 — fully type-safe, file-based routing
- **Styling**: Tailwind CSS v4 — CSS-first architecture with OKLCH color spaces
- **UI Foundation**: shadcn/ui v4 (`base-nova` style, `@base-ui/react` primitives, Lucide React icons, `sonner` toasts)
- **Code Quality**: oxlint — ultra-fast Rust-based linter

## Getting Started

```bash
bun install
bun run dev
```

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start Vite dev server (port 5173) |
| `bun run build` | `tsc -b && vite build` — typecheck then bundle |
| `bun run preview` | Preview production build |
| `bun run lint` | Run oxlint |

## Adding a Tool (For Developers)

This project is built to expand to other games and features easily. To add a new tool:

1. Create a route page at `src/routes/<game>/<tool-name>/index.tsx`.
2. Create a feature folder at `src/features/<tool-name>/` with subdirectories: `components/`, `core/`, `hooks/`, `context/`, `types/` (add only what you need).
3. Core logic goes in `features/<tool-name>/core/` — pure TypeScript, no React dependencies.
4. Track tool-specific state inside its own Context provider in `features/<tool-name>/context/` or local page state (avoid global variables).
5. Register the route link in `src/App.tsx` (sidebar) and `src/routes/index.tsx` (dashboard grid).
6. Import shadcn components from `@/shared/ui/` and shared utilities from `@/shared/`.
