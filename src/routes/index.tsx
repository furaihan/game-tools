import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Gamepad2, PandaIcon } from 'lucide-react'
import { tools } from '@/lib/tool-list'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="p-6 w-full">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <Gamepad2 className="h-5 w-5 text-primary" />
            <PandaIcon className="h-5 w-5 text-primary" />
            Available Tools
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Select a tool to get started
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
            {tools.map((tool) => {
              const Icon = tool.icon
              return (
                <Link key={tool.href} to={tool.href} className="block w-full">
                <Card className="h-full w-full cursor-pointer border-border transition-all duration-200 hover:border-primary/50 hover:bg-accent/5 [--card-spacing:--spacing(6)]">
                  <CardHeader>
                    <div className="mb-3 flex items-center gap-3">
                      <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                    </div>
                    <CardDescription className="text-sm leading-relaxed">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
                </Link>
              )
            })}
          </div>
        {tools.length === 0 && (
          <p className="text-sm text-muted-foreground">No tools available yet.</p>
        )}
      </div>
    </div>
  )
}