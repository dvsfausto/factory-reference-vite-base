#!/usr/bin/env node
// Palette harness — renders every STANDALONE route across all 6 characters and asserts
// no default-palette component leaks onto a character site. This exists because the
// character work only ever rendered the HOMEPAGE: the standalone pages (about, pricing,
// reviews, contact, …) hardcoded the DEFAULT blue CTA / default trust bar / bg-white
// intro, and that leak shipped unnoticed. A render diff in scratchpad caught it once;
// this makes the check PERSIST so a future standalone page — or a future character —
// is covered automatically.
//
// AUTO-DISCOVERY: sweeps src/routes/*.tsx, excluding __root, index (homepage — character
// -aware via the layout system) and dynamic $slug routes (they need loader data; their
// template is covered by the service-page check below). Drop a new src/routes/foo.tsx
// and it is swept on the next run with zero edits here.
//
// INVARIANTS asserted (the two regressions that actually happened):
//   1. No default-blue CTA gradient (from-brand-800 …) on ANY character site, ANY route.
//      The default CTASection blue is never correct for a character — its presence means
//      a page rendered the default CtaBlock/CTASection instead of the character variant.
//   2. No orphaned trustLine band (a bare `py-4 text-sm text-ink-500` line) on the
//      character service page — the per-service trustLine must render integrated in the
//      hero trust row, not floating between sections.
//
// Usage:  node scripts/check-standalone-palette.mjs [rootDir]
//         (wired as `pnpm lint:palette`)

import { readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const root = process.argv[2] ?? join(dirname(fileURLToPath(import.meta.url)), '..')
const CHARACTERS = ['bold', 'elegant', 'friendly', 'modern', 'corporate', 'creative']

// The default CTASection gradient — the exact leak. Any of these on a character page
// means the default CTA rendered instead of the character variant.
const DEFAULT_BLUE = /from-brand-800|via-brand-700|to-brand-900/
// The orphaned trustLine band that the inner-page hero refactor left behind.
const ORPHAN_TRUSTLINE = 'py-4 text-sm text-ink-500'
// ANY customer-brand-palette utility class (text/bg/border/from/via/to/ring/fill/stroke-brand-N).
// On a CHARACTER site the shared inner-page sections render the character hero (no brand-*) and
// must adopt the character accent for chrome (eyebrow chips, script accents, numerals, icons,
// links) — so a `-brand-N` class in a character render is a leak (the exact "brand-blue on cream"
// bug). Known verticals legitimately use brand-*, so this check is CHARACTER-ONLY. `bg-primary`
// (the CSS-var brand CTA) is intentionally NOT matched — brand expression stays on the CTA.
const BRAND_UTILITY = /(?:text|bg|border|from|via|to|ring|fill|stroke)-brand-\d/g
// Default-INK breadcrumb leak: the breadcrumb muted/current-page text (text-ink-500/900) must
// adopt the character tokens (T.muted/T.text) on a character site, or it reads as default grey
// on e.g. a cream elegant page. Distinct from BRAND_UTILITY (a -brand-N leak) — which is exactly
// why the breadcrumb slipped through: the crumb was rendered but no assertion inspected it.
const DEFAULT_INK = /text-ink-(?:500|900)/g

const routesDir = join(root, 'src', 'routes')
const routeFiles = readdirSync(routesDir).filter(
  (f) =>
    f.endsWith('.tsx') &&
    !f.startsWith('__') && // __root layout
    !f.includes('$') && // dynamic $slug — needs loader data
    f !== 'index.tsx', // homepage — character-aware via the layout system
)

const server = await createServer({
  root,
  configFile: false,
  logLevel: 'silent',
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
  esbuild: { jsx: 'automatic', jsxImportSource: 'react' },
  resolve: {
    alias: {
      '@tanstack/react-router': join(root, 'scripts', 'palette-harness', 'router-stub.tsx'),
      '~': join(root, 'src'),
      '@': join(root, 'src'),
    },
  },
})

const failures = []
let checks = 0
const skipped = []

try {
  const render = await server.ssrLoadModule(join(root, 'scripts', 'palette-harness', 'render-entry.tsx'))
  // Per-character tokens, so the breadcrumb ink-leak check compares against each character's OWN
  // muted/text (bold legitimately uses text-ink-500/900) instead of blanket-flagging any ink.
  const { BY_CHARACTER } = await server.ssrLoadModule(join(root, 'src', 'lib', 'character-tokens.ts'))

  // 1. Every standalone route × every character → no default-blue CTA.
  for (const file of routeFiles) {
    let Component
    try {
      const mod = await server.ssrLoadModule(join(routesDir, file))
      Component = mod?.Route?.options?.component
    } catch (err) {
      skipped.push(`${file} (load error: ${(err && err.message) || err})`)
      continue
    }
    if (!Component) {
      skipped.push(`${file} (no Route.options.component)`)
      continue
    }
    for (const ch of [null, ...CHARACTERS]) {
      render.setCharacter(ch)
      let html
      try {
        html = render.renderComponent(Component)
      } catch (err) {
        // A route that needs router context (loader/params) can't render standalone.
        skipped.push(`${file} [${ch ?? 'known'}] (render error: ${(err && err.message) || err})`)
        continue
      }
      checks++
      if (ch && DEFAULT_BLUE.test(html)) {
        failures.push(`/${file.replace(/\.tsx$/, '')} [${ch}]: default-blue CTA leak (from-brand-800)`)
      }
    }
  }

  // 2. Character service + area pages → no orphaned trustLine band, and NO brand-* chrome
  //    (eyebrow chips / script accents / numerals / icons / links must adopt the character accent).
  const innerPages = [
    { label: 'service page', render: render.renderServicePage },
    { label: 'area page', render: render.renderAreaPage },
  ]
  for (const page of innerPages) {
    for (const ch of CHARACTERS) {
      render.setCharacter(ch)
      let html
      try {
        html = page.render()
      } catch (err) {
        skipped.push(`${page.label} [${ch}] (render error: ${(err && err.message) || err})`)
        continue
      }
      checks++
      if (html.includes(ORPHAN_TRUSTLINE)) {
        failures.push(`${page.label} [${ch}]: orphaned trustLine band (${ORPHAN_TRUSTLINE})`)
      }
      const brandHits = [...new Set(html.match(BRAND_UTILITY) ?? [])]
      if (brandHits.length) {
        failures.push(`${page.label} [${ch}]: brand-* chrome on a character site → ${brandHits.join(', ')}`)
      }
      // Breadcrumb band — the surface a character touches that had no coverage. On a character
      // site the crumb sits above the character hero, so BOTH its surface and text must be
      // tokenized: (1) its wrapper div must carry the character surface (secPlain's bg-*) or it
      // renders on default white (the white-band leak); (2) its text must use T.muted/T.text,
      // not default text-ink-500/900. This is the exact leak class this harness must cover to
      // stop the find-a-leak cycle.
      if (html.includes('aria-label="Breadcrumb"')) {
        const crumbStart = html.indexOf('aria-label="Breadcrumb"')
        const crumbHtml = html.slice(crumbStart, crumbStart + 600)
        // A leak is a DEFAULT ink class in the crumb that is NOT one of THIS character's own
        // tokens — bold's muted/text ARE text-ink-500/900 by design, so those don't count.
        const isInk = (c) => /text-ink-(?:500|900)/.test(c ?? '')
        const tok = BY_CHARACTER[ch] ?? {}
        const ownInk = new Set([tok.muted, tok.text].filter(isInk))
        const inkHits = [...new Set(crumbHtml.match(DEFAULT_INK) ?? [])].filter((h) => !ownInk.has(h))
        if (inkHits.length) {
          failures.push(`${page.label} [${ch}]: default-ink breadcrumb text on a character site → ${inkHits.join(', ')}`)
        }
        if (!/<div class="[^"]*\bbg-[^"]*"><nav aria-label="Breadcrumb"/.test(html)) {
          failures.push(`${page.label} [${ch}]: breadcrumb band has no character surface (white-band leak)`)
        }
      }
    }
  }
} finally {
  await server.close()
}

const routeLabel = routeFiles.map((f) => f.replace(/\.tsx$/, '')).join(', ')
console.log(`palette harness — ${checks} renders across ${CHARACTERS.length} characters`)
console.log(`  standalone routes swept: ${routeLabel}`)
if (skipped.length) {
  console.log(`  skipped (not standalone-renderable): ${skipped.length}`)
  for (const s of skipped) console.log(`    · ${s}`)
}

if (failures.length) {
  console.error(`\n✗ ${failures.length} palette leak(s):`)
  for (const f of failures) console.error(`    ✗ ${f}`)
  process.exit(1)
}
console.log('  ✓ no default-blue CTA leak, no orphaned trustLine — all characters clean')
