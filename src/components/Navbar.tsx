import { Link, useLocation } from "@tanstack/react-router";
import { Bell, Menu, X, Atom } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Query" },
  { to: "/results", label: "Results" },
  { to: "/log", label: "Log Results" },
  { to: "/models", label: "Model Versions" },
  { to: "/provenance", label: "Provenance" },
] as const;

export function Navbar() {
  const loc = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 panel border-b border-[color:var(--panel-border)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-md bg-[color:var(--cyan)]/10 border border-[color:var(--cyan)]/40">
            <Atom className="h-5 w-5 text-cyan" />
            <span className="absolute inset-0 rounded-md bg-cyan/20 blur-md opacity-60 group-hover:opacity-100 transition" />
          </div>
          <div className="font-mono text-lg font-semibold tracking-tight">
            Catalyst<span className="text-cyan">IQ</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = loc.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-colors",
                  active ? "text-cyan" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {l.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-[2px] bg-cyan rounded-full shadow-[0_0_8px_var(--cyan-glow)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button className="relative p-2 rounded-md hover:bg-muted transition" aria-label="Notifications">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_6px_var(--cyan-glow)]" />
          </button>
          <div className="flex items-center gap-2 pl-3 border-l border-border">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[color:var(--cyan)] to-[color:var(--purple-tag)] flex items-center justify-center text-xs font-semibold text-background">
              PS
            </div>
            <div className="text-xs leading-tight">
              <div className="font-medium">Dr. P. Sharma</div>
              <div className="text-muted-foreground font-mono">Lead Researcher</div>
            </div>
          </div>
        </div>

        <button
          className="md:hidden p-2 rounded-md hover:bg-muted"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-card">
          <nav className="flex flex-col px-4 py-2">
            {links.map((l) => {
              const active = loc.pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-3 py-3 text-sm rounded-md",
                    active ? "text-cyan bg-cyan/10" : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
