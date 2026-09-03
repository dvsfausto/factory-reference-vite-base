#!/usr/bin/env node
// PERF-1 — imageSrc() routes Supabase Storage public-object URLs through the transform
// endpoint and leaves everything else byte-for-byte alone. Runs against the compiled
// helper via a tiny inline transpile (no test runner in this repo).
//
// Usage:  node scripts/check-image-transform.mjs      → exit 0 all green, 1 on any miss
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = readFileSync(join(root, 'src/lib/asset-url.ts'), 'utf8')
  .replace(/^export /gm, '')
  .replace(/: string/g, '')
const imageSrc = new Function(`${src}; return imageSrc;`)()

const S = 'https://nldfnnyhrovytkuvtuby.supabase.co/storage/v1'
const cases = [
  [`${S}/object/public/public-assets/b/image/hero.jpg`, `${S}/render/image/public/public-assets/b/image/hero.jpg?width=1600&resize=contain&quality=70`, 'owner hero → transform (contain, not cover)'],
  [`${S}/object/public/business-logos/o/logo.png`, `${S}/render/image/public/business-logos/o/logo.png?width=1600&resize=contain&quality=70`, 'logo png → transform (alpha kept, never upscaled)'],
  [`${S}/object/public/public-assets/b/image/mark.svg`, `${S}/object/public/public-assets/b/image/mark.svg`, 'svg untouched'],
  [`${S}/object/public/public-assets/b/image/anim.gif`, `${S}/object/public/public-assets/b/image/anim.gif`, 'gif untouched'],
  [`${S}/object/public/public-assets/b/image/x.jpg?token=1`, `${S}/object/public/public-assets/b/image/x.jpg?token=1`, 'URL that already carries a query untouched'],
  [`${S}/render/image/public/public-assets/b/image/x.jpg?width=800`, `${S}/render/image/public/public-assets/b/image/x.jpg?width=800`, 'already-transformed URL not double-wrapped'],
  ['https://images.pexels.com/photos/1/a.jpeg', 'https://images.pexels.com/photos/1/a.jpeg', 'external URL untouched'],
  ['/images/hero.webp', '/images/hero.webp', 'absolute static path untouched'],
  ['hero-sparkle.webp', '/images/hero-sparkle.webp', 'bare filename → /images/'],
]
let fail = 0
for (const [input, want, name] of cases) {
  const got = imageSrc(input)
  const ok = got === want
  if (!ok) fail++
  console.log(`  ${ok ? '✓' : '✗'} ${name}${ok ? '' : `\n      want ${want}\n      got  ${got}`}`)
}
// Lazy below the fold: every NON-hero block that renders through imageSrc() must declare
// loading="lazy" (hero blocks stay eager — they are the fold). Header/logo <img>s are not
// imageSrc() callers and are out of scope here.
import { readdirSync } from 'node:fs'
const blocks = join(root, 'src/components/blocks')
for (const f of readdirSync(blocks)) {
  if (!f.endsWith('.tsx') || f.startsWith('Hero')) continue
  const t = readFileSync(join(blocks, f), 'utf8')
  if (!t.includes('imageSrc(')) continue
  const ok = /loading=["']lazy["']/.test(t)
  if (!ok) fail++
  console.log(`  ${ok ? '✓' : '✗'} ${f}: below-the-fold imageSrc() image is loading="lazy"`)
}
console.log(fail ? `check-image-transform FAILED (${fail})` : 'check-image-transform OK')
process.exit(fail ? 1 : 0)
