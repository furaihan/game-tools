import { createFileRoute } from '@tanstack/react-router'
import { BiomeGeneratorProvider } from '@/features/biome-generator/context/biome-generator-context'
import { GeneratorControls } from '@/features/biome-generator/components/GeneratorControls'
import { CanvasPreview } from '@/features/biome-generator/components/CanvasPreview'
import { BiomeList } from '@/features/biome-generator/components/BiomeList'

export const Route = createFileRoute('/7dtd/biome-layout-generator/')({
  component: BiomeLayoutGeneratorWrapper,
})

function BiomeLayoutGeneratorWrapper() {
  return (
    <BiomeGeneratorProvider>
      <BiomeLayoutGenerator />
    </BiomeGeneratorProvider>
  )
}

function BiomeLayoutGenerator() {
  return (
    <div className="flex flex-1 min-h-0">
      <aside className="w-72 shrink-0 overflow-y-auto border-r bg-card">
        <GeneratorControls />
      </aside>

      <main className="flex flex-1 min-w-0 overflow-hidden">
        <CanvasPreview />
      </main>

      <aside className="w-72 shrink-0 overflow-y-auto border-l bg-card">
        <BiomeList />
      </aside>
    </div>
  )
}
