import type { Config } from "tailwindcss";

// Tailwind v4 reads its config from `src/styles.css` (@import "tailwindcss"
// + @theme blocks). This stub exists only so external tooling that expects a
// legacy tailwind.config.ts file can resolve it without errors.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
} satisfies Config;
