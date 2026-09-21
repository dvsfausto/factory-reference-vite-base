/**
 * ★ THE LOGO ROW DRAWS EVERY LOGO IN ONE BOX (the owner, 2026-09-21). Each Partners*Block is rendered inside a real
 * (memory) router with three partners, and every <img> in the row must carry the SAME fixed height and width with
 * object-contain — so a wide wordmark and a square mark take the same space whatever the file's pixel size. Before
 * this the width was `w-auto` and followed each file. npm run test:logo-row
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { createRootRoute, createRouter, createMemoryHistory, RouterProvider } from '@tanstack/react-router'
import { readdirSync } from 'node:fs'
import { SITE } from '~/data/site'

async function inRouter(node: () => unknown) {
  const root = createRootRoute({ component: () => node() as never })
  const router = createRouter({ routeTree: root, history: createMemoryHistory({ initialEntries: ['/'] }) })
  await router.load()
  return renderToStaticMarkup(createElement(RouterProvider, { router } as never))
}
const partners = [
  { name: 'Square', logo: 'https://x/square-900x900.png' },
  { name: 'Wide', logo: 'https://x/wordmark-1200x200.png' },
  { name: 'Tall', logo: 'https://x/tall-200x600.png' },
]
const names = readdirSync(new URL('../../src/components/blocks/', import.meta.url)).filter((f) => /^Partners\w*Block\.tsx$/.test(f)).map((f) => f.replace('.tsx', ''))
let bad = 0
for (const name of names) {
  const mod = await import(`../../src/components/blocks/${name}.tsx`)
  const html = await inRouter(() => createElement(mod[name] as never, { site: { ...SITE, partners } } as never))
  const cls = [...html.matchAll(/<img[^>]*src="https:\/\/x\/[^"]*"[^>]*class="([^"]+)"/g)].map((m) => m[1]!)
  /* ★ the owner's colour choice (partner_logo_colour): default = the grey row exactly as before; "full" = no grey, same box */
  const fullHtml = await inRouter(() => createElement(mod[name] as never, { site: { ...SITE, partners, partnersLogoColor: 'full' } } as never))
  const fullCls = [...fullHtml.matchAll(/<img[^>]*src="https:\/\/x\/[^"]*"[^>]*class="([^"]+)"/g)].map((m) => m[1]!)
  const greyByDefault = cls.every((c) => /\bgrayscale\b/.test(c))
  const fullColour = fullCls.length === partners.length && fullCls.every((c) => !/grayscale|opacity-/.test(c)) && fullCls.every((c, i) => c.match(/\bh-\d+ w-\d+\b/)?.[0] === cls[i]?.match(/\bh-\d+ w-\d+\b/)?.[0])
  const sizes = cls.map((c) => `${c.match(/\bh-\d+\b/)?.[0] ?? '?'} ${c.match(/\bw-(\d+|auto)\b/)?.[0] ?? '?'} ${/\bobject-contain\b/.test(c) ? 'contain' : 'NO-contain'}`)
  const ok = cls.length === partners.length && new Set(sizes).size === 1 && !/w-auto|\?|NO-contain/.test(sizes[0] ?? '?') && greyByDefault && fullColour
  if (!ok) bad++
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name.padEnd(24)} ${cls.length} logos · ${[...new Set(sizes)].join(' | ')} · default ${greyByDefault ? 'grey' : 'NOT grey'} · full ${fullColour ? 'colour, same box' : 'WRONG'}`)
}
console.log(bad ? `\n${bad} FAILED` : `\nall ${names.length} pass`)
process.exit(bad ? 1 : 0)
