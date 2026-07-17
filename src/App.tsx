import { Outlet, Link, useLocation } from "@tanstack/react-router";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { Button } from "@/shared/ui/button";
import { Moon, Sun, Gamepad2, ChevronDown } from "lucide-react";
import { ThemeProvider, useTheme } from "@/app/theme/theme-context";
import { tools } from "@/shared/tool-registry/tool-list";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shared/ui/dropdown-menu";

function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className="h-8 w-8 text-muted-foreground hover:text-foreground"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

export default function App() {
  const location = useLocation();

  const deployedAt = import.meta.env.VITE_DEPLOYED_TIMESTAMP;
  const formattedDate = deployedAt
    ? new Date(deployedAt).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Unknown";

  return (
    <ThemeProvider>
      <TooltipProvider delay={300}>
        <div className="min-h-screen flex flex-col">
          <header className="flex h-14 items-center justify-between border-b bg-background px-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5 text-primary" />
                <h1 className="text-sm font-semibold tracking-tight">
                  Game Tools
                </h1>
              </div>
              <nav className="flex items-center gap-1">
                <Link
                  to="/"
                  className={`relative text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                    location.pathname === "/"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  Home
                  {location.pathname === "/" && (
                    <span className="absolute -bottom-px inset-x-3 h-0.5 rounded-sm bg-primary" />
                  )}
                </Link>
                {Object.entries(
                  tools.reduce<Record<string, typeof tools>>((acc, tool) => {
                    (acc[tool.gameCategory] ??= []).push(tool);
                    return acc;
                  }, {})
                ).map(([category, categoryTools]) => {
                  const isActive = categoryTools.some((t) => location.pathname === t.href)
                  return (
                    <DropdownMenu key={category}>
                      <DropdownMenuTrigger
                        openOnHover
                        delay={100}
                        closeDelay={0}
                        className={`relative text-sm font-medium px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 ${
                          isActive
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        }`}
                      >
                        {category}
                        <ChevronDown className="h-4 w-4" />
                        {isActive && (
                          <span className="absolute -bottom-px inset-x-3 h-0.5 rounded-sm bg-primary" />
                        )}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {categoryTools.map((tool) => {
                          const Icon = tool.icon;
                          return (
                            <DropdownMenuItem
                              key={tool.href}
                              render={<Link to={tool.href} />}
                              className={location.pathname === tool.href ? "border-l-2 border-primary pl-1 text-foreground font-medium" : ""}
                            >
                              <Icon className="h-4 w-4" />
                              {tool.title}
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )
                })}
              </nav>
            </div>
            <ThemeToggle />
          </header>
          <main className="flex flex-1 min-h-0 min-w-0 overflow-auto">
            <Outlet />
          </main>
          <footer className="flex py-2 items-center justify-end border-t bg-background px-4 text-xs text-muted-foreground">
            &#10004; Deployed at:{" "}
            {formattedDate}
          </footer>
        </div>
      </TooltipProvider>
    </ThemeProvider>
  );
}
