import { Outlet, Link, useLocation } from "@tanstack/react-router";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import { Button } from "@/shared/ui/button";
import { MoonIcon, SunIcon, Gamepad2Icon, ChevronDownIcon } from "lucide-react";
import { ThemeProvider, useTheme } from "@/app/theme/theme-context";
import { tools } from "@/shared/tool-registry/tool-list";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shared/ui/dropdown-menu";

/* Nav style — active = full weight + primary underline sweep */
const navItemClass = (active: boolean) =>
  `relative flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition-all duration-200 after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:origin-left after:bg-primary after:transition-transform after:duration-300 after:ease-out ${
    active
      ? "font-semibold text-foreground after:scale-x-100"
      : "text-muted-foreground after:scale-x-0 hover:bg-accent/50 hover:text-foreground hover:after:scale-x-100"
  }`;

function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="group h-8 w-8 text-muted-foreground transition-all hover:text-foreground active:scale-90"
        >
          {/* crossfade + rotate between sun/moon, tilts on hover */}
          <span className="relative flex h-4 w-4 items-center justify-center transition-transform duration-500 ease-out group-hover:rotate-45">
            <SunIcon
              className={`absolute h-4 w-4 transition-all duration-500 ${
                isDark
                  ? "rotate-0 scale-100 opacity-100"
                  : "-rotate-90 scale-0 opacity-0"
              }`}
            />
            <MoonIcon
              className={`absolute h-4 w-4 transition-all duration-500 ${
                isDark
                  ? "rotate-90 scale-0 opacity-0"
                  : "rotate-0 scale-100 opacity-100"
              }`}
            />
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {"Switch to " + (isDark ? "light" : "dark") + " mode"}
      </TooltipContent>
    </Tooltip>
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
        <div className="flex min-h-screen flex-col bg-background text-foreground bg-[radial-gradient(color-mix(in_oklab,currentColor_5%,transparent)_1px,transparent_1px)] bg-size-[22px_22px]">
          {/* brand accent line */}
          <div className="h-0.5 bg-primary" />

          <header className="flex h-14 items-center justify-between border-b bg-background px-4">
            <div className="flex items-center gap-6">
              {/* brand */}
              <Link to="/" className="group flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary transition-transform duration-300 ease-out group-hover:-rotate-12">
                  <Gamepad2Icon className="h-4 w-4" />
                </span>
                <span className="flex items-baseline gap-2">
                  <span className="text-sm font-bold tracking-tight">
                    Game Tools<span className="text-primary">.</span>
                  </span>
                </span>
              </Link>

              {/* nav */}
              <nav className="flex items-center gap-1">
                <Link to="/" className={navItemClass(location.pathname === "/")}>
                  Home
                </Link>
                {Object.entries(
                  tools.reduce<Record<string, typeof tools>>((acc, tool) => {
                    (acc[tool.gameCategory] ??= []).push(tool);
                    return acc;
                  }, {}),
                ).map(([category, categoryTools]) => {
                  const isActive = categoryTools.some(
                    (t) => location.pathname === t.href,
                  );
                  return (
                    <DropdownMenu key={category}>
                      <DropdownMenuTrigger
                        openOnHover
                        delay={100}
                        closeDelay={0}
                        className={`group ${navItemClass(isActive)}`}
                      >
                        {category}
                        <ChevronDownIcon className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="min-w-44">
                        {categoryTools.map((tool) => {
                          const Icon = tool.icon;
                          const active = location.pathname === tool.href;
                          return (
                            <DropdownMenuItem
                              key={tool.href}
                              render={<Link to={tool.href} />}
                              className={`group/item border-l-2 pl-1 ${
                                active
                                  ? "border-primary font-medium text-foreground"
                                  : "border-transparent"
                              }`}
                            >
                              <Icon
                                className={`h-4 w-4 transition-transform duration-200 group-hover/item:-rotate-12 ${
                                  active ? "text-primary" : ""
                                }`}
                              />
                              {tool.title}
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              {/* live route readout — updates as you navigate */}
              <code className="hidden border px-2 py-1 font-mono text-[10px] tracking-wider text-muted-foreground md:inline-block">
                <span className="text-primary">~</span>
                {location.pathname}
              </code>
              <ThemeToggle />
            </div>
          </header>

          <main className="flex min-h-0 min-w-0 flex-1 overflow-auto">
            {/* keyed on path → subtle rise/fade on every route change */}
            <div
              key={location.pathname}
              className="flex min-w-0 flex-1 flex-col transition-all duration-300 ease-out starting:translate-y-2 starting:opacity-0"
            >
              <Outlet />
            </div>
          </main>

          <footer className="flex items-center justify-between border-t bg-background px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              System ready
            </span>
            <span>
              Deployed · <span className="text-foreground/80">{formattedDate}</span>
            </span>
          </footer>
        </div>
      </TooltipProvider>
    </ThemeProvider>
  );
}
