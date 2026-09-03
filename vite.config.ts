import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      srcDirectory: 'src',
    }),
    viteReact(),
    nitro({
      preset: 'vercel',
      // PERF-1 (2026-09-03): /images/* are the pipeline's per-site hero/service/area files.
      // Vercel served them `max-age=0, must-revalidate` (a 304 round-trip per image per visit).
      // Their names are NOT content-hashed and a rebuild may replace one, so never `immutable`
      // (that is reserved for /assets/*): a day fresh, a week stale-while-revalidate. Lands in
      // .vercel/output/config.json routes — the same place the /assets/ rule comes from.
      routeRules: {
        '/images/**': { headers: { 'cache-control': 'public, max-age=86400, stale-while-revalidate=604800' } },
      },
    }),
  ],
})
