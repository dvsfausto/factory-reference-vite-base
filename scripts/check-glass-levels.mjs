#!/usr/bin/env node
// check-glass-levels — the glass panel's three tints are literal classes (Tailwind emits them), the floor stays at 25% on a
// wide screen and 50% on a phone (the lightest that reads over a black-averaging photo), and the served panel carries its level.
import { readFileSync } from 'node:fs'
const s = readFileSync('src/components/blocks/HeroGlassBlock.tsx', 'utf8')
const fails = []
const m = s.match(/export const GLASS_LEVELS = \{([\s\S]*?)\} as const/)
if (!m) fails.push('GLASS_LEVELS missing')
else {
  const body = m[1]
  for (const [name, phone, wide] of [['standard', 80, 55], ['lighter', 65, 40], ['lightest', 50, 25]]) {
    const re = new RegExp(`${name}: 'bg-fam-card/(\\d+) sm:bg-fam-card/(\\d+)'`)
    const mm = body.match(re)
    if (!mm) { fails.push(`${name}: not a literal class pair`); continue }
    if (Number(mm[1]) !== phone || Number(mm[2]) !== wide) fails.push(`${name}: expected ${phone}/${wide}, got ${mm[1]}/${mm[2]}`)
    if (Number(mm[2]) < 25 || Number(mm[1]) < 50) fails.push(`${name}: below the legibility floor (wide ≥ 25, phone ≥ 50)`)
  }
}
if (!/data-glass-level=\{glassLevelOf\(site\)\}/.test(s)) fails.push('the served panel must carry data-glass-level')
if (!/GLASS_LEVELS\[glassLevelOf\(site\)\]/.test(s)) fails.push('the panel class must come from GLASS_LEVELS')
if (fails.length) { console.error('check-glass-levels:\n  ' + fails.join('\n  ')); process.exit(1) }
console.log('check-glass-levels: ok')
