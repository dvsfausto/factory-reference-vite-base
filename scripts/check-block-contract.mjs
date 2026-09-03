// lint:blocks — the block contract and the renderer must name the same vocabulary.
// Fails when a renderSection `case '<type>':` has no BLOCK_NEEDS/PLACEMENT entry, or an
// entry has no case; and when a BlockType union member is missing from either. Not part
// of `build` (the emitted package.json / Vercel build must not change) — run by the
// factory's identity gate and by hand.
import { readFileSync } from 'node:fs'
const layout = readFileSync(new URL('../src/data/layout.ts', import.meta.url), 'utf8')
const contract = readFileSync(new URL('../src/data/block-contract.ts', import.meta.url), 'utf8')
const renderer = readFileSync(new URL('../src/components/render-section.tsx', import.meta.url), 'utf8')

// drop whole comment LINES (incl. newline) exactly as the scaffolder's layout-guard does, so a
// stripped comment never leaves a blank line that reads as the union's terminator
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^[ \t]*\/\/.*\n/gm, '')
const unionSrc = strip(layout).match(/export type BlockType\b[^=]*=([\s\S]*?)(?:;|\n\s*\n)/)?.[1] ?? ''
const union = [...unionSrc.matchAll(/'([^']+)'/g)].map((m) => m[1])

const tableBody = (name) =>
  strip(contract).match(new RegExp(`export const ${name}\\b[^=]*=\\s*\\{([\\s\\S]*?)\\n\\}`))?.[1] ?? ''
// BLOCK_NEEDS: one entry per line, `key: {` at line start (nested `site: [` never starts a line)
const needs = [...tableBody('BLOCK_NEEDS').matchAll(/^\s*([A-Za-z][A-Za-z0-9]*)\s*:\s*\{/gm)].map((m) => m[1])
// PLACEMENT: several per line; a value is either 'any' or a [PageKind] list
const placement = [...tableBody('PLACEMENT').matchAll(/([A-Za-z][A-Za-z0-9]*)\s*:\s*(?:'any'|\[)/g)].map((m) => m[1])

const sw = renderer.match(/switch \(block\.type\) \{([\s\S]*)/)?.[1] ?? ''
const cases = [...new Set([...sw.matchAll(/^\s*case '([^']+)':/gm)].map((m) => m[1]))]

const diff = (a, b) => a.filter((x) => !b.includes(x))
const problems = []
const check = (label, xs) => xs.length && problems.push(`${label}: ${xs.join(', ')}`)
check('in union, missing from BLOCK_NEEDS', diff(union, needs))
check('in BLOCK_NEEDS, not in union', diff(needs, union))
check('in union, missing from PLACEMENT', diff(union, placement))
check('in PLACEMENT, not in union', diff(placement, union))
check('rendered (case) but not in union', diff(cases, union))
check('in union but no renderSection case', diff(union, cases))
const dup = (xs) => xs.filter((x, i) => xs.indexOf(x) !== i)
check('duplicate BLOCK_NEEDS keys', dup(needs))
check('duplicate PLACEMENT keys', dup(placement))
// P1b: every `into` SITE key has an INTO_KIND entry (the four array modules are exempt), and no stale entry
const ARRAY_MODULES = ['SERVICES', 'AREAS', 'REVIEWS', 'PROJECTS']
const intoKeys = [...new Set([...tableBody('BLOCK_NEEDS').matchAll(/into:\s*\[([^\]]*)\]/g)].flatMap((m) => [...m[1].matchAll(/'([^']+)'/g)].map((k) => k[1])))]
  .filter((k) => !ARRAY_MODULES.includes(k))
const kinds = [...tableBody('INTO_KIND').matchAll(/^\s*([A-Za-z][A-Za-z0-9]*)\s*:\s*'(array|object|string)'/gm)].map((m) => m[1])
check('into SITE key without INTO_KIND', diff(intoKeys, kinds))
check('INTO_KIND key no block writes into', diff(kinds, intoKeys))

// B1 (custom-page h1): every component a `forms` / `booking` / `richText` case can dispatch to
// must honour `headingLevel` (SectionList passes 1 to the first block of a custom page whose
// layout names no `intro`). The list is DERIVED from the variant maps + the richText case, so a
// new form variant that renders a hard `<h2>` fails here rather than shipping a page with no h1.
const formsSrc = readFileSync(new URL('../src/components/blocks/forms-variants.ts', import.meta.url), 'utf8')
const headingBearing = [...new Set([
  ...[...strip(formsSrc).matchAll(/^import \{ (\w+Block) \} from '\.\/(\w+)'/gm)].map((m) => m[2]),
  ...[...(renderer.match(/const BOOKING_VARIANTS[^{]*\{([\s\S]*?)\n\}/)?.[1] ?? '').matchAll(/:\s*(\w+Block)/g)].map((m) => m[1]),
  'BookingWizardBlock',
  'RichTextBlock',
])]
const noHeadingLevel = headingBearing.filter((name) => {
  const src = readFileSync(new URL(`../src/components/blocks/${name}.tsx`, import.meta.url), 'utf8')
  return !(/headingLevel\s*=\s*2/.test(src) && /const Heading = headingLevel === 1 \? 'h1' : 'h2'/.test(src) && !/<h2\b/.test(src))
})
check('heading-bearing block without headingLevel → Heading (or a stray <h2>)', noHeadingLevel)
check('headingLevel not passed by the renderer case', ['forms', 'booking', 'richText'].filter((t) => {
  const body = sw.match(new RegExp(`case '${t}':([\\s\\S]*?)\\n    case '`))?.[1] ?? ''
  return !body.includes('headingLevel={opts?.headingLevel}')
}))

if (problems.length) {
  console.error(`lint:blocks FAIL\n  ${problems.join('\n  ')}`)
  process.exit(1)
}
console.log(`lint:blocks ok — ${union.length} block types · ${cases.length} renderer cases · needs ${needs.length} · placement ${placement.length} · headingLevel ${headingBearing.length} blocks`)
