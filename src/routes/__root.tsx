import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { CatalystProvider } from "@/context/CatalystContext";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-mono font-bold text-cyan glow-text">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The route you're looking for doesn't exist in CatalystIQ.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="btn-glow inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
          >
            Return to Query
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CatalystIQ — AI-Accelerated Molecular Discovery" },
      { name: "description", content: "AI-accelerated catalyst discovery for sustainable Ethanol-to-Jet fuel synthesis." },
      { name: "author", content: "GPS Renewables" },
      { property: "og:title", content: "CatalystIQ — AI-Accelerated Molecular Discovery" },
      { property: "og:description", content: "AI-accelerated catalyst discovery for sustainable Ethanol-to-Jet fuel synthesis." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap",
      },
    ],
    scripts: [
      { src: "https://3dmol.org/build/3Dmol-min.js", async: true },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <CatalystProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Toaster />
      </div>
    </CatalystProvider>
  );
}
