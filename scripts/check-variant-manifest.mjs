// lint:manifest — every variant id the renderer can dispatch is in the editor's manifest, and every manifest
// id dispatches. Reach without truth is a guess (the editor named ids nobody rendered); truth without reach
// is a variant nobody can pick. Fails on either gap. niche arc 2b, 2026-09-08.
import { readFileSync, readdirSync } from 'node:fs'
const rs = readFileSync('src/components/render-section.tsx', 'utf8')
const man = readFileSync('src/data/variant-manifest.ts', 'utf8')
const CHAR = ['bold', 'elegant', 'friendly', 'modern', 'corporate', 'creative']
const idsOf = (body) => [...body.matchAll(/^\s*'?([a-z][a-z0-9-]*)'?\s*:/gm)].map((m) => m[1])
// renderer maps: inline consts in render-section + the *-variants.ts modules, keyed by the block type each case uses
const maps = {}
for (const m of rs.matchAll(/const ([A-Z_]+)_VARIANTS[^=]*=\s*\{([\s\S]*?)\n\}/g)) maps[m[1]] = idsOf(m[2])
for (const f of readdirSync('src/components/blocks').filter((f) => f.endsWith('-variants.ts'))) {
  const t = readFileSync('src/components/blocks/' + f, 'utf8')
  const m = t.match(/export const ([A-Z_]+)_VARIANTS[^=]*=\s*\{([\s\S]*?)\n\}/)
  if (m) maps[m[1]] = idsOf(m[2])
}
const usage = {}
for (const m of rs.matchAll(/case '([a-zA-Z]+)':([\s\S]*?)(?=case '|\n\s*default:)/g)) {
  const names = [...m[2].matchAll(/\b([A-Z_]+)_VARIANTS\[/g)].map((x) => x[1]).filter((n) => n !== 'SERVICE_HERO')
  if (names.length) usage[m[1]] = names[0]
}
// manifest per section, resolving the CHARACTER_VARIANTS spread
const manifest = {}
for (const m of man.matchAll(/section:\s*'([a-zA-Z]+)'[\s\S]*?variants:\s*\[([\s\S]*?)\n\s*\],?\n\s*\}/g)) {
  const body = m[2]
  const ids = [...body.matchAll(/id:\s*'([a-z0-9-]+)'/g)].map((x) => x[1])
  const spread = body.match(/\.\.\.CHARACTER_VARIANTS(?:\.filter\(\(v\) => ([^)]*)\))?/)
  if (spread) { const excluded = spread[1] ? [...spread[1].matchAll(/'([a-z]+)'/g)].map((x) => x[1]) : []; for (const c of CHAR) if (!excluded.includes(c)) ids.push(c) }
  manifest[m[1]] = ids
}
let bad = 0
const sections = Object.keys(usage).filter((t) => maps[usage[t]])
for (const t of sections) {
  const render = new Set(maps[usage[t]]); const listed = new Set(manifest[t] ?? [])
  const unreachable = [...render].filter((v) => !listed.has(v)); const phantom = [...listed].filter((v) => !render.has(v))
  const ok = unreachable.length === 0 && phantom.length === 0
  if (!ok) bad++
  console.log(`${ok ? '  ✓' : '  ✗'} ${t.padEnd(18)} renders ${render.size}  manifest ${listed.size}${unreachable.length ? `  UNREACHABLE (rendered, not listed): ${unreachable.join(', ')}` : ''}${phantom.length ? `  PHANTOM (listed, not rendered): ${phantom.join(', ')}` : ''}`)
}
const total = sections.reduce((n, t) => n + maps[usage[t]].length, 0)
console.log(`${bad ? 'FAIL' : 'OK'} — ${sections.length} sections with variant maps, ${total} variants, ${bad} section(s) out of sync`)
process.exit(bad ? 1 : 0)
