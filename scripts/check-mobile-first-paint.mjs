#!/usr/bin/env node
// check-mobile-first-paint — the page reads and the menu opens BEFORE the bundle runs, and without it (2026-09-22).
//
// A customer opened her new site on a phone: every hero white, the menu button dead. The server had rendered
// framer-motion's initial state (`style="opacity:0"`) inline on every hero, and the mobile menu was a React click
// handler, so nothing showed and nothing opened until ~700 KB of JavaScript had arrived and hydrated — and never
// if it failed. This check makes the template safe BY CONSTRUCTION:
//   1. no content element starts hidden through framer-motion (`initial={{ opacity: 0 …}}`, `initial="hidden"`,
//      `initial={reduce ? undefined : 'hidden'}`); the hero entrance is the CSS `data-enter` animation in app.css,
//      which ends visible whatever the bundle does; a decorative element (aria-hidden) may still fade in;
//   2. the mobile menu in Header.tsx is a native <details> with its links inside — it opens with no JS at all;
//   3. vite.config.ts lowers the client bundle to a phone syntax floor (es2020 / safari14 / ios14), so one modern
//      token cannot become a SyntaxError that stops the whole page on an older phone.
// Runs in the build chain; the first violation fails the build. scripts/check-built-assets-syntax.mjs is the
// second half: it parses the built assets at that floor.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const problems = []
const files = []
const walk = (d) => { for (const n of readdirSync(d)) { const p = join(d, n); statSync(p).isDirectory() ? walk(p) : /\.tsx$/.test(n) && files.push(p) } }
walk('src')

// any framer `initial` that is not exactly `initial={false}` starts the element in a state the server renders inline
const HIDDEN = [/\binitial=(?!\{false\})/]
for (const f of files) {
  const lines = readFileSync(f, 'utf8').split('\n')
  lines.forEach((line, i) => {
    if (!HIDDEN.some((re) => re.test(line))) return
    // a decorative element may start hidden: its opening tag (within the 8 lines above) carries aria-hidden
    const tag = lines.slice(Math.max(0, i - 8), i + 1).join('\n')
    if (/aria-hidden/.test(tag)) return
    // a crossfade whose FIRST frame mounts visible: <AnimatePresence initial={false}> above it skips the initial state
    if (/<AnimatePresence[^>]*initial=\{false\}/.test(lines.slice(Math.max(0, i - 14), i).join('\n'))) return
    problems.push(`${f}:${i + 1}: content starts hidden until JavaScript runs — use data-enter="up" (CSS) instead: ${line.trim()}`)
  })
}

const header = readFileSync('src/components/Header.tsx', 'utf8')
const d0 = header.indexOf('<details'), d1 = header.indexOf('</details>')
if (d0 < 0 || d1 < 0) problems.push('src/components/Header.tsx: the mobile menu must be a <details> element (it opens before hydration)')
else {
  const inside = header.slice(d0, d1)
  if (!/<summary/.test(inside)) problems.push('Header.tsx: the <details> mobile menu has no <summary> trigger')
  const links = (inside.match(/<Link\b/g) || []).length
  if (links < 3) problems.push(`Header.tsx: the <details> mobile menu holds ${links} links; the nav must live inside it`)
}
if (/\{open && \(/.test(header)) problems.push('Header.tsx: the mobile menu must not depend on React state to open')

const vite = readFileSync('vite.config.ts', 'utf8')
if (!/target:\s*\[[^\]]*'safari14'[^\]]*\]/.test(vite)) problems.push("vite.config.ts: build.target must include 'safari14' (the phone syntax floor)")

if (problems.length) {
  console.error('✗ check-mobile-first-paint: the page must read and the menu must open before (and without) JavaScript')
  for (const p of problems) console.error('  ' + p)
  process.exit(1)
}
console.log(`✓ check-mobile-first-paint: ${files.length} components start visible; the mobile menu is a <details>; syntax floor set`)
