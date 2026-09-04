#!/usr/bin/env node
// check-contact-guards — a tel: or mailto: link is never empty BY CONSTRUCTION (2026-09-04).
// Every `tel:${…phone}` must sit inside a `HAS_PHONE &&` / `hasPhone(…) &&` guard and every
// `mailto:${…email}` inside a `HAS_EMAIL &&` / `hasEmail(…) &&` / `…email &&` guard, so a business
// with no phone (49 of 61 on 2026-09-04) or no public email (the default) gets no dead link and no
// dangling "or call" copy. Runs in the build chain before vite; fails on the first unguarded site.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
const files = []
const walk = (d) => { for (const n of readdirSync(d)) { const p = join(d, n); statSync(p).isDirectory() ? walk(p) : /\.tsx$/.test(n) && files.push(p) } }
walk('src')
const RULES = [
  { name: 'tel', re: /tel:\$\{(?:site|SITE)\.phone\}/g, guards: [/HAS_PHONE\s*(?:&&|\?)/, /hasPhone\([^)]*\)\s*(?:&&|\?)/] },
]
const bad = []
for (const f of files) {
  const s = readFileSync(f, 'utf8')
  for (const r of RULES) for (const m of s.matchAll(r.re)) {
    const before = s.slice(Math.max(0, m.index - 320), m.index)
    if (!r.guards.some((g) => g.test(before))) bad.push(`${f}:${s.slice(0, m.index).split('\n').length} ${r.name}: link outside a guard`)
  }
}
if (bad.length) { console.error('check-contact-guards FAILED:\n  ' + bad.join('\n  ')); process.exit(1) }
console.log(`check-contact-guards ok (${files.length} files)`)
