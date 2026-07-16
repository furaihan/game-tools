import { Map, LayoutGrid, Code2 } from 'lucide-react'

export type GameCategory = '7 Days to Die' | 'Minecraft' | 'Other'

export type Tool = {
  title: string
  description: string
  href: string
  gameCategory: GameCategory
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export const tools: Tool[] = [
  {
    title: 'Biome Layout Generator',
    description: 'Generate biome layouts for 7 Days to Die',
    href: '/7dtd/biome-layout-generator',
    gameCategory: '7 Days to Die',
    icon: LayoutGrid
  },
  {
    title: 'Sandbox Codec',
    description: 'Encode and decode sandbox data for 7 Days to Die',
    href: '/7dtd/sandbox-codec',
    gameCategory: '7 Days to Die',
    icon: Code2
  }
];
