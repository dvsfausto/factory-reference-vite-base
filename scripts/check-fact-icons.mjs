// Stage B guard (2026-09-10): trust-bar icons come from the fact-kind registry, never from position. Every kind in
// src/lib/fact-icons.ts has an icon; no TrustBar variant indexes an icon list by i.
import { readFileSync, readdirSync } from 'node:fs'
const reg = readFileSync('src/lib/fact-icons.ts', 'utf8')
const kinds = [...reg.matchAll(/^\s*\|\s*'([a-z]+)'/gm)].map((m) => m[1]).concat([...reg.matchAll(/^export type FactKind =\s*\|?\s*'([a-z]+)'/gm)].map((m) => m[1]))
const union = reg.match(/export type FactKind =([\s\S]*?)\n\n/)?.[1] ?? ''
const declared = [...union.matchAll(/'([a-z]+)'/g)].map((m) => m[1])
const table = reg.match(/FACT_ICONS[\s\S]*?= \{([\s\S]*?)\n\}/)?.[1] ?? ''
const mapped = [...table.matchAll(/^\s*([a-z]+):/gm)].map((m) => m[1])
const missing = declared.filter((k) => !mapped.includes(k))
const bad = []
for (const f of readdirSync('src/components/blocks').filter((f) => /^TrustBar.*\.tsx$/.test(f))) {
  const s = readFileSync('src/components/blocks/' + f, 'utf8')
  if (/icons\[i\]|ICONS\[i|icons\[i % /.test(s)) bad.push(f + ': icon by position')
  if (/lucide-react/.test(s) && !/factIcon/.test(s) && /<Icon\b/.test(s)) bad.push(f + ': renders an Icon without the registry')
}
if (missing.length || bad.length) { console.error(`check-fact-icons: ${missing.length ? 'kinds without an icon: ' + missing.join(', ') : ''} ${bad.join('; ')}`); process.exit(1) }
console.log(`✓ fact icons: ${declared.length} kinds, every one mapped; no trust variant picks an icon by position`)
