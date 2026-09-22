#!/usr/bin/env node
// check-built-assets-syntax — every client script the build emitted parses at the phone floor (ES2020) (2026-09-22).
// One token newer than a phone's engine is a SyntaxError that stops the whole page: white hero, dead menu. Vite lowers
// the bundle (build.target in vite.config.ts); this proves the output, not the setting. Runs after `vite build`.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import * as acorn from 'acorn'

const ROOTS = ['.output/public/assets', '.vercel/output/static/assets', 'dist/assets', 'dist/client/assets']
const found = []
for (const r of ROOTS) if (existsSync(r)) for (const n of readdirSync(r)) if (/\.js$/.test(n) && statSync(join(r, n)).isFile()) found.push(join(r, n))
if (found.length === 0) { console.error(`✗ check-built-assets-syntax: no built client scripts under ${ROOTS.join(', ')}`); process.exit(1) }
let bad = 0
for (const f of found) {
  const js = readFileSync(f, 'utf8')
  try { acorn.parse(js, { ecmaVersion: 2020, sourceType: 'module' }) }
  catch (e) { bad++; console.error(`✗ ${f}: not ES2020 — ${e.message} :: ${js.slice(Math.max(0, e.pos - 60), e.pos + 40).replace(/\n/g, ' ')}`) }
}
if (bad) process.exit(1)
console.log(`✓ check-built-assets-syntax: ${found.length} client scripts parse at ES2020`)
