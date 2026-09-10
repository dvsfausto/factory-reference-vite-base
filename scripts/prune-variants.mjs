// PRUNE VARIANTS — visual elevation Stage C (2026-09-10).
//
// THE WEIGHT. render-section.tsx and the blocks/*-variants.ts maps import every layout variant
// statically (≈170 components), so every site shipped the whole catalogue in one 562–577 KB
// client chunk whatever its layouts render. A site renders ten or so.
//
// THE SPLIT. At `vite build` (never in dev), a Vite plugin evaluates the site's LAYOUT DATA —
// src/data/*layout*.ts (homepage + the nine inner pages, `familyOr()` resolved against the
// baked SITE.headerVariant) and src/data/custom-pages.ts (book / quote / /p/$slug) — collects
// every (section type → variant id) the site can render, and REMOVES from each variant map the
// entries the site never selects, plus the imports those entries alone referenced. The maps are
// the ONLY thing touched: the render path, the fallbacks (`?? HeroBlock`), the section switch and
// every component are byte-identical, so the server-rendered HTML is byte-identical too (gate:
// test:ssr-identity / render-check on both settings). A variant the site does not select was
// unreachable on this site anyway — an unknown id already fell to the section default.
//
// WHY NOT React.lazy. The site is SSR (TanStack Start + Nitro on Vercel). A lazy component needs
// a Suspense boundary, which changes the served markup (boundary comments, streamed segments) —
// "a split that changes what the page serves is not a split". Removing unreachable map entries
// changes nothing the server emits.
//
// THE EDITOR. The AI editor swaps a variant by patching src/data/layout.ts and pushing, which
// rebuilds the site; that build evaluates the new layout and keeps the new variant. The editor's
// manifest (src/data/variant-manifest.ts) is data and is not pruned.
//
// SELF-CHECK. After pruning, every (section, variant) the layouts select MUST still be present in
// its map when it was present before — else the build fails loudly. Summary printed per build.
//
// OFF SWITCH: PRUNE_VARIANTS=0.

import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join, basename, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const SECTION_BY_MAP = {
  HERO_VARIANTS: 'hero',
  SERVICE_HERO_VARIANTS: 'hero',
  SERVICES_VARIANTS: 'servicesPreview',
  CTA_VARIANTS: 'cta',
  TRUST_VARIANTS: 'trustBar',
  REVIEWS_VARIANTS: 'reviews',
  AREAS_VARIANTS: 'serviceAreas',
  FAQ_VARIANTS: 'faq',
  BOOKING_VARIANTS: 'booking',
  EMERGENCY_BAR_VARIANTS: 'emergencyBar',
  MENU_VARIANTS: 'menu',
  PRODUCT_GRID_VARIANTS: 'productGrid',
  CLASS_SCHEDULE_VARIANTS: 'classSchedule',
  TEAM_VARIANTS: 'team',
  PRICING_VARIANTS: 'pricing',
  GALLERY_VARIANTS: 'gallery',
  PROCESS_VARIANTS: 'process',
  FAQSECTION_VARIANTS: 'faqSection',
  STORY_VARIANTS: 'story',
  FORMS_VARIANTS: 'forms',
  MEMBERSHIP_VARIANTS: 'membership',
  PACKAGES_VARIANTS: 'packages',
  CASE_STUDIES_VARIANTS: 'caseStudies',
  VIDEO_TESTIMONIALS_VARIANTS: 'videoTestimonials',
  PROMOTIONS_VARIANTS: 'promotions',
  FINANCING_VARIANTS: 'financing',
  PARTNERS_VARIANTS: 'partners',
  MAP_VARIANTS: 'map',
  BLOG_VARIANTS: 'blog',
}

/** Evaluate the site's layout data and return { section → Set(variant) }. Uses Vite's own module
 *  runner (`runnerImport`) so the `~` alias, TS and the baked SITE resolve exactly as the build sees them. */
export async function collectVariantUsage(root) {
  const { runnerImport } = await import('vite')
  const dataDir = join(root, 'src/data')
  const files = readdirSync(dataDir)
    .filter((f) => /layout\.ts$/.test(f) || f === 'custom-pages.ts')
    .map((f) => join(dataDir, f))
  const used = new Map()
  const add = (type, variant) => {
    if (typeof type !== 'string') return
    if (!used.has(type)) used.set(type, new Set())
    if (typeof variant === 'string' && variant) used.get(type).add(variant)
  }
  const walk = (v) => {
    if (!Array.isArray(v)) return
    for (const b of v) if (b && typeof b === 'object' && typeof b.type === 'string') add(b.type, b.variant)
  }
  for (const f of files) {
    const { module: ns } = await runnerImport(f, { root, logLevel: 'silent', configFile: false, resolve: { tsconfigPaths: true } })
    for (const v of Object.values(ns)) {
      if (Array.isArray(v)) walk(v)
      else if (v && typeof v === 'object') for (const page of Object.values(v)) if (page && Array.isArray(page.layout)) walk(page.layout)
    }
  }
  return used
}

/** { MAP_NAME → Set(keys) } for every variant map in a source file. */
export function parseMaps(code) {
  const lines = code.split('\n')
  const maps = {}
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(?:export )?const ([A-Z_]+_VARIANTS)\b/)
    if (!m || !(m[1] in SECTION_BY_MAP)) continue
    let j = i
    while (j < lines.length && !/=\s*\{\s*$/.test(lines[j])) j++
    const keys = new Set()
    for (let k = j + 1; k < lines.length && !/^\}/.test(lines[k]); k++) {
      const e = lines[k].match(ENTRY_RE)
      if (e) keys.add(e[2].replace(/^'|'$/g, ''))
    }
    maps[m[1]] = keys
    i = j
  }
  return maps
}

const ENTRY_RE = /^(\s*)('?[\w-]+'?)\s*:\s*([A-Za-z_$][\w$]*)\s*,?\s*(\/\/.*)?$/

/** Prune the variant maps in one source file. Returns { code, removed: [{map,key,ident}], kept } or null when untouched. */
export function pruneSource(code, used, file) {
  const lines = code.split('\n')
  const removed = []
  const keptByMap = {}
  const totalByMap = {}
  let i = 0
  while (i < lines.length) {
    const m = lines[i].match(/^(?:export )?const ([A-Z_]+_VARIANTS)\b/)
    if (!m || !(m[1] in SECTION_BY_MAP)) { i++; continue }
    const map = m[1]
    const section = SECTION_BY_MAP[map]
    // find the opening `= {` (may sit on a later line for a multi-line type annotation)
    let j = i
    while (j < lines.length && !/=\s*\{\s*$/.test(lines[j])) j++
    if (j >= lines.length) throw new Error(`prune-variants: ${file}: cannot find "= {" for ${map}`)
    let k = j + 1
    keptByMap[map] = 0
    totalByMap[map] = 0
    while (k < lines.length && !/^\}/.test(lines[k])) {
      const e = lines[k].match(ENTRY_RE)
      if (e) {
        totalByMap[map]++
        const key = e[2].replace(/^'|'$/g, '')
        const usedHere = used.get(section)
        if (usedHere && usedHere.has(key)) keptByMap[map]++
        else { removed.push({ map, key, ident: e[3], line: k }); lines[k] = null }
      }
      k++
    }
    i = k + 1
  }
  if (removed.length === 0) return null
  let out = lines.filter((l) => l !== null).join('\n')
  // Drop imports whose identifiers no longer appear anywhere else in the file.
  const candidates = new Set(removed.map((r) => r.ident))
  const stillUsed = (ident, body) => new RegExp(`(?<![\\w$])${ident}(?![\\w$])`).test(body)
  // Fold multi-line `import {\n a,\n b\n} from '…'` blocks onto one line so one rule handles both shapes.
  out = out.replace(/^import \{([^}]*)\} from (['"][^'"]+['"]);?[ \t]*$/gm, (all, names, from) => `import { ${names.split(',').map((s) => s.trim()).filter(Boolean).join(', ')} } from ${from}`)
  const importLines = out.split('\n')
  for (let n = 0; n < importLines.length; n++) {
    const im = importLines[n].match(/^import \{([^}]*)\} from (['"][^'"]+['"]);?\s*$/)
    if (!im) continue
    const names = im[1].split(',').map((s) => s.trim()).filter(Boolean)
    if (!names.some((nm) => candidates.has(nm.split(/\s+as\s+/).pop()))) continue
    const rest = importLines.slice(0, n).concat(importLines.slice(n + 1)).join('\n')
    const keep = names.filter((nm) => {
      const local = nm.split(/\s+as\s+/).pop()
      return !candidates.has(local) || stillUsed(local, rest)
    })
    if (keep.length === names.length) continue
    importLines[n] = keep.length ? `import { ${keep.join(', ')} } from ${im[2]}` : null
  }
  out = importLines.filter((l) => l !== null).join('\n')
  // Self-check: every used (section, variant) the ORIGINAL map carried is still in the pruned map.
  const before = parseMaps(code)
  const after = parseMaps(out)
  for (const [map, keys] of Object.entries(before)) {
    for (const v of used.get(SECTION_BY_MAP[map]) ?? []) {
      if (keys.has(v) && !(after[map]?.has(v))) throw new Error(`prune-variants: ${file}: ${map} lost used variant "${v}"`)
    }
  }
  return { code: out, removed, keptByMap, totalByMap }
}


/** Second pass, render-section.tsx only: a `case '<type>'` the site's layouts never place can never run, so the
 *  components ONLY that case references (its default block, its helpers) are replaced by an inert stub and their
 *  imports dropped. Identifiers referenced anywhere else in the file — a placed case, a map entry that survived,
 *  a helper outside the switch — are untouched. Same guarantee as the map pass: nothing reachable changes. */
export function pruneCases(code, used, file) {
  const lines = code.split('\n')
  const start = lines.findIndex((l) => /^export function renderSection\(/.test(l))
  if (start < 0) return null
  // case regions: [caseType, fromLine, toLine)
  const regions = []
  let cur = null
  for (let i = start; i < lines.length; i++) {
    const c = lines[i].match(/^    case '([\w-]+)':/)
    const d = /^    default:/.test(lines[i])
    if (c || d) { if (cur) { cur.to = i; regions.push(cur) } cur = c ? { type: c[1], from: i } : null }
    if (/^\}$/.test(lines[i]) && i > start && cur) { cur.to = i; regions.push(cur); cur = null; break }
  }
  if (cur) { cur.to = lines.length; regions.push(cur) }
  const unused = regions.filter((r) => !used.has(r.type))
  if (unused.length === 0) return null
  const isUnused = (i) => unused.some((r) => i >= r.from && i < r.to)
  // component imports: `import { A, B } from '~/components/…'` (single-line after folding)
  const imports = []
  for (let i = 0; i < lines.length; i++) {
    const im = lines[i].match(/^import \{([^}]*)\} from (['"](?:~\/components|\.)[^'"]*['"]);?\s*$/)
    if (im) imports.push({ line: i, names: im[1].split(',').map((s) => s.trim()).filter(Boolean), from: im[2] })
  }
  const importedNames = new Set(imports.flatMap((im) => im.names.map((n) => n.split(/\s+as\s+/).pop())))
  const outside = lines.filter((l, i) => !isUnused(i) && !imports.some((im) => im.line === i)).join('\n')
  const stub = new Set()
  for (const r of unused) {
    const body = lines.slice(r.from, r.to).join('\n')
    for (const id of body.match(/\b[A-Z][A-Za-z0-9_]*\b/g) ?? []) {
      if (!importedNames.has(id) || stub.has(id)) continue
      if (new RegExp(`(?<![\\w$])${id}(?![\\w$])`).test(outside)) continue
      stub.add(id)
    }
  }
  if (stub.size === 0) return null
  for (const im of imports) {
    const keep = im.names.filter((n) => !stub.has(n.split(/\s+as\s+/).pop()))
    if (keep.length === im.names.length) continue
    lines[im.line] = keep.length ? `import { ${keep.join(', ')} } from ${im.from}` : null
  }
  const lastImport = Math.max(...imports.map((im) => im.line))
  lines[lastImport] = (lines[lastImport] ?? '') + '\n// prune-variants: components of section cases this site never places (unreachable here).\n' +
    [...stub].map((id) => `const ${id}: any = () => null`).join('\n')
  return { code: lines.filter((l) => l !== null).join('\n'), stubbed: [...stub], unusedTypes: unused.map((r) => r.type) }
}

export function pruneVariantsPlugin() {
  let root = process.cwd()
  let used = null
  const summary = { files: 0, removed: 0, kept: 0, total: 0, perMap: {} }
  const enabled = process.env.PRUNE_VARIANTS !== '0'
  return {
    name: 'prune-variants',
    enforce: 'pre',
    apply: 'build',
    configResolved(config) { root = config.root },
    async buildStart() {
      if (!enabled) { this.info?.('[prune-variants] OFF (PRUNE_VARIANTS=0)'); return }
      if (!used) used = await collectVariantUsage(root)
    },
    transform(code, id) {
      if (!enabled || !used) return null
      const f = id.split('?')[0]
      const isMapFile = /\/src\/components\/render-section\.tsx$/.test(f) || /\/src\/components\/blocks\/[\w-]+-variants\.ts$/.test(f)
      if (!isMapFile) return null
      const r = pruneSource(code, used, f)
      let out = r ? r.code : code
      if (r) {
        summary.files++
        summary.removed += r.removed.length
        for (const [map, kept] of Object.entries(r.keptByMap)) {
          summary.perMap[map] = { kept, total: r.totalByMap[map] }
          summary.kept += kept
          summary.total += r.totalByMap[map]
        }
      }
      if (/render-section\.tsx$/.test(f)) {
        const c = pruneCases(out, used, f)
        if (c) { out = c.code; summary.stubbed = c.stubbed; summary.unusedTypes = c.unusedTypes }
      }
      return out === code ? null : { code: out, map: null }
    },
    buildEnd() {
      if (!enabled || !used) return
      const usedList = [...used.entries()].map(([t, s]) => `${t}${s.size ? '=' + [...s].join('|') : ''}`).join(' ')
      console.log(`[prune-variants] layouts select: ${usedList}`)
      const maps = Object.entries(summary.perMap).map(([m, v]) => `${m.replace(/_VARIANTS$/, '').toLowerCase()} ${v.kept}/${v.total}`).join(', ')
      if (summary.stubbed) console.log(`[prune-variants] ${summary.unusedTypes.length} section types never placed → ${summary.stubbed.length} components stubbed: ${summary.stubbed.join(', ')}`)
      console.log(`[prune-variants] kept ${summary.kept} of ${summary.total} map entries (${summary.removed} removed) — ${maps}`)
      summary.files = 0; summary.removed = 0; summary.kept = 0; summary.total = 0; summary.perMap = {}; summary.stubbed = null; summary.unusedTypes = null
    },
  }
}

// CLI: `node scripts/prune-variants.mjs` prints what a build of THIS checkout would keep.
if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  const root = process.cwd()
  const used = await collectVariantUsage(root)
  console.log([...used.entries()].map(([t, s]) => `${t}: ${[...s].join(', ') || '(default)'}`).join('\n'))
  const files = [join(root, 'src/components/render-section.tsx'), ...readdirSync(join(root, 'src/components/blocks')).filter((f) => /-variants\.ts$/.test(f)).map((f) => join(root, 'src/components/blocks', f))]
  let removed = 0, kept = 0, total = 0
  for (const f of files) {
    if (!existsSync(f)) continue
    const r = pruneSource(readFileSync(f, 'utf8'), used, f)
    if (!r) continue
    removed += r.removed.length
    for (const m of Object.keys(r.keptByMap)) { kept += r.keptByMap[m]; total += r.totalByMap[m] }
  }
  console.log(`\nwould keep ${kept} of ${total} map entries (${removed} removed)`)
  void pathToFileURL
}
