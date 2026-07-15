import { Outlet, Link, useLocation } from "@tanstack/react-router";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Gamepad2 } from "lucide-react";
import { ThemeProvider, useTheme } from "@/context/theme-context";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/7dtd/biome-map-converter", label: "Biome Map Converter" },
  { href: "/7dtd/biome-layout-generator", label: "Biome Layout Generator" },
  { href: "/7dtd/sandbox-codec", label: "Sandbox Codec" },
];

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
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                      location.pathname === item.href
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
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
