# Catalyst AI Explorer

TanStack Start SSR app for catalyst exploration.

## Local verification before deploy

```bash
npm install
npm run build
npm run preview
```

Then verify these routes load:

- `/`
- `/results`
- `/models`

If local routing works but production deep links 404, the issue is deploy/domain routing config.

## Cloudflare deployment (recommended)

This repository is server-rendered (TanStack Start) and should be deployed to **Cloudflare Workers/Pages with SSR**, not plain static hosting.

Current Worker entry is configured in `wrangler.jsonc`:

- `main: "@tanstack/react-start/server-entry"`

Use:

- Build command: `npm run build`
- Pages output directory (if required by the UI): prefer framework SSR preset; otherwise use built client assets (`dist/client`).

## Static-host fallback (if deployed as SPA)

If you intentionally host as static output on Vercel/Netlify, deep links must rewrite to app entry:

- `/* -> /index.html`

This repo includes fallback configs:

- `vercel.json`
- `netlify.toml`

## Domain mapping verification checklist

1. Confirm the exact active production URL in Cloudflare.
2. If using a custom domain, ensure DNS points to the active deployment/project.
3. Re-test `/`, `/results`, `/models` after redeploy.
