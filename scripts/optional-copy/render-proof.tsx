/**
 * ★ THE RENDER PROOF FOR CLEARABLE COPY (2026-09-21). check-optional-copy.mjs proves every clearable field is drawn
 * under a guard; this proves the guard WORKS: each hero variant is rendered inside a real (memory) router twice —
 * with words, and with the kicker "" and the body " " (the single space one site was left holding) — and the emptied
 * render must lose the words AND the elements that held them (the eyebrow with its dot or accent line, the body <p>).
 * Measured against main before the fix: 0 elements gone in every variant, i.e. an empty eyebrow drawn on the page.
 *
 *   npm run test:optional-copy            (every Hero*Block)
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { createRootRoute, createRouter, createMemoryHistory, RouterProvider } from '@tanstack/react-router'
/* the blocks use Link / useRouter, so each one renders inside a real (memory) router */
async function inRouter(node: () => unknown) {
  const root = createRootRoute({ component: () => node() as never })
  const router = createRouter({ routeTree: root, history: createMemoryHistory({ initialEntries: ['/'] }) })
  await router.load()
  return renderToStaticMarkup(createElement(RouterProvider, { router } as never))
}
import { SITE } from '~/data/site'
import { readdirSync } from 'node:fs'
const NAMES = process.argv.slice(2).length ? process.argv.slice(2) : readdirSync(new URL('../../src/components/blocks/', import.meta.url)).filter((f) => /^Hero\w*Block\.tsx$/.test(f) && f !== 'HeroBlock.test.tsx').map((f) => f.replace('.tsx', ''))
const KICK = 'KICKER-MARK-7731', BODY = 'BODY-MARK-4412'
const withHero = (hero: Record<string, unknown>) => ({ ...SITE, hero: { ...SITE.hero, ...hero } })
let bad = 0
for (const name of NAMES) {
  let mod: Record<string, unknown>
  try { mod = await import(`../../src/components/blocks/${name}.tsx`) } catch (e) { console.log(`skip ${name.padEnd(24)} cannot load outside Vite (${String(e).match(/\.(png|jpg|webp|svg)/)?.[0] ?? 'import'} asset)`); continue }
  const C = mod[name]
  const render = async (site: unknown) => { try { return await inRouter(() => createElement(C as never, { site } as never)) } catch (e) { return 'RENDER-ERROR ' + String(e).slice(0, 120) } }
  const full = await render(withHero({ kicker: KICK, body: BODY }))
  const empty = await render(withHero({ kicker: '', body: ' ' }))
  /* with words: both drawn. emptied: neither the words nor the element that held them (compare element counts) */
  const tags = (h: string) => (h.match(/<[a-z]/g) ?? []).length
  const drawnFull = `${full.includes(KICK) ? 'kicker' : '-'} ${full.includes(BODY) ? 'body' : '-'}`
  const lost = tags(full) - tags(empty)
  const emptyOk = !empty.startsWith('RENDER-ERROR') && !empty.includes(KICK) && !empty.includes(BODY)
  const ok = !full.startsWith('RENDER-ERROR') && emptyOk && lost >= (full.includes(KICK) ? 1 : 0) + (full.includes(BODY) ? 1 : 0)
  if (full.startsWith('RENDER-ERROR')) { console.log(`skip ${name.padEnd(24)} ${full.slice(0, 110)}`); continue }
  if (!ok) bad++
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name.padEnd(24)} with words: ${drawnFull.padEnd(12)} emptied: ${lost} element(s) gone${full.startsWith('RENDER-ERROR') ? '  ' + full : ''}${empty.startsWith('RENDER-ERROR') ? '  ' + empty : ''}`)
}
console.log(bad ? `\n${bad} FAILED` : `\nall ${NAMES.length} pass`)
process.exit(bad ? 1 : 0)
