// Prerender TanStack Start routes to static HTML for SPA-style hosting (Vercel).
// Runs after `vite build`. Uses the SSR worker entry to render each route once,
// then writes <route>/index.html into dist/client. The client bundle hydrates
// and TanStack Router takes over for subsequent client-side navigations.

import path from "node:path";
import fs from "node:fs";
import { pathToFileURL } from "node:url";

const clientDir = path.resolve("dist/client");
const serverEntryPath = path.resolve("dist/server/index.js");

if (!fs.existsSync(serverEntryPath)) {
  console.error("[prerender] server entry not found at", serverEntryPath);
  process.exit(1);
}

const mod = await import(pathToFileURL(serverEntryPath).href);
const handler = mod.default;
if (!handler || typeof handler.fetch !== "function") {
  console.error("[prerender] server entry has no default.fetch handler");
  process.exit(1);
}

// Static routes to prerender. Add new top-level routes here.
const ROUTES = ["/", "/results", "/models", "/log", "/provenance"];

let failures = 0;

for (const route of ROUTES) {
  try {
    const res = await handler.fetch(new Request("http://localhost" + route));
    if (!res.ok) {
      console.warn(`[prerender] ${route} -> HTTP ${res.status}, skipping`);
      failures++;
      continue;
    }
    const html = await res.text();
    const outPath =
      route === "/"
        ? path.join(clientDir, "index.html")
        : path.join(clientDir, route.slice(1), "index.html");
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, html);
    console.log(`[prerender] wrote ${path.relative(process.cwd(), outPath)} (${html.length} bytes)`);
  } catch (e) {
    console.error(`[prerender] ${route} failed:`, e?.message || e);
    failures++;
  }
}

if (failures > 0) {
  console.warn(`[prerender] completed with ${failures} failures`);
}
