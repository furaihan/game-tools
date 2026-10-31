import { createRootRoute, Link, type ErrorComponentProps } from '@tanstack/react-router'
import App from '@/App'

export const Route = createRootRoute({
  component: () => <App />,
  notFoundComponent: NotFound,
  errorComponent: RouteError,
})

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-60 gap-4">
      <h2 className="text-xl font-semibold">Page not found</h2>
      <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
      <Link to="/" className="text-primary underline underline-offset-2">Go home</Link>
    </div>
  )
}

function RouteError({ error }: ErrorComponentProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-60 gap-4">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-muted-foreground">{error instanceof Error ? error.message : String(error)}</p>
      <Link to="/" className="text-primary underline underline-offset-2">Go home</Link>
    </div>
  )
}
