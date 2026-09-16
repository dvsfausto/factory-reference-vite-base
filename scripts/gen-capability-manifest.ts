// gen:capability — THE CAPABILITY MANIFEST, generated from the templates' own catalog (website-surface arc,
// Stage 1, 2026-09-16). One JSON that says, for every block the renderer knows: what it is called, where it may
// go, what data it reads, which layout variants it has, which fields (text / image / list / money…) that data has,
// and which of those fields are photo targets. NOTHING here is hand-listed per block: the vocabulary is
// layout.ts BlockType (via block-contract.ts BLOCK_NEEDS), the variants are variant-manifest.ts, the shapes are
// the exported TypeScript interfaces the blocks themselves read, the display copy is found by scanning each
// block's own component source for SITE.<key>. Add a block to the template and it appears here on the next
// `npm run gen:capability`; `lint:capability` (in `build`) fails when the committed JSON lags the sources.
//
// Consumers: editor-api reads src/data/capability-manifest.json from each site's cloned repo (per build, like
// variant-manifest.ts) and wa-api asks editor-api — so the assistant's map of the site is the site's own.
//
// Hand-written parts, and why they are allowed: (1) LABELS — human names in en/es (a name is not a tool; a
// block with no label FAILS the generator so it cannot ship nameless); (2) SHAPE_OF — which exported interface
// an untyped SITE array is read AS (team → TeamMember…), validated against the component scan; (3) two literal
// shapes (stats, milestones) the story blocks read inline, validated the same way. Everything else is derived.
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import ts from 'typescript'
import { BLOCK_NEEDS, PLACEMENT, INTO_KIND, PAGE_KINDS } from '../src/data/block-contract.ts'
import { VARIANT_MANIFEST } from '../src/data/variant-manifest.ts'
import { SITE } from '../src/data/site.ts'

const OUT = 'src/data/capability-manifest.json'
const CHECK = process.argv.includes('--check')

// ── 1. labels (en from variant-manifest where it has one; es always here) ─────────────────────────────
const LABELS: Record<string, { en?: string; es: string }> = {
  hero: { es: 'Portada (hero)' }, taglineBar: { en: 'Tagline bar', es: 'Barra de lema' },
  localBar: { en: 'Neighbourhood strip', es: 'Franja de zonas' }, emergencyBar: { es: 'Barra de emergencia' },
  menu: { es: 'Menú' }, productGrid: { es: 'Productos' }, classSchedule: { es: 'Horario de clases' },
  trustBar: { es: 'Barra de confianza (Por qué elegirnos)' }, servicesPreview: { es: 'Servicios' },
  serviceAreas: { es: 'Zonas de servicio' }, reviews: { es: 'Reseñas' }, faq: { es: 'Preguntas frecuentes' },
  cta: { es: 'Llamado a la acción' }, team: { es: 'Nuestro equipo' }, pricing: { es: 'Precios' },
  gallery: { es: 'Galería' }, process: { es: 'Cómo trabajamos' }, faqSection: { es: 'Sección de preguntas' },
  story: { es: 'Nuestra historia' }, forms: { es: 'Formulario' }, membership: { es: 'Membresías' },
  packages: { es: 'Paquetes' }, caseStudies: { es: 'Casos de éxito' }, videoTestimonials: { es: 'Testimonios en video' },
  promotions: { es: 'Promociones' }, financing: { es: 'Financiamiento' }, partners: { es: 'Aliados' },
  map: { es: 'Mapa' }, blog: { es: 'Blog' }, booking: { es: 'Reservas' },
  intro: { en: 'Page intro', es: 'Introducción de página' }, richText: { en: 'Text block', es: 'Bloque de texto' },
  serviceWhatWeCover: { en: 'Service overview', es: 'Resumen del servicio' }, serviceDetails: { en: 'Service details', es: 'Detalles del servicio' },
  relatedServices: { en: 'Related services', es: 'Servicios relacionados' }, areaAbout: { en: 'About this area', es: 'Sobre esta zona' },
  areaDetails: { en: 'Area details', es: 'Detalles de la zona' }, relatedAreas: { en: 'Related areas', es: 'Zonas relacionadas' },
  infoArticle: { en: 'Info article', es: 'Artículo informativo' }, relatedInfo: { en: 'Related info pages', es: 'Páginas relacionadas' },
  servicesIndex: { en: 'All services', es: 'Todos los servicios' }, areasIndex: { en: 'All service areas', es: 'Todas las zonas' },
  reviewsIndex: { en: 'All reviews', es: 'Todas las reseñas' }, contactForm: { en: 'Contact form', es: 'Formulario de contacto' },
}

// ── 2. which exported interface each untyped SITE array/object is read AS ────────────────────────────
const SHAPE_OF: Record<string, string> = {
  team: 'TeamMember', plans: 'PricingPlan', steps: 'ProcessStep', posts: 'BlogPost', memberships: 'Membership',
  packages: 'ServicePackage', caseStudies: 'CaseStudy', videoTestimonials: 'VideoTestimonial', promotions: 'Promotion',
  partners: 'Partner', financing: 'Financing', products: 'Product', classSchedule: 'ClassSession', trustItems: 'TrustItem',
  SERVICES: 'ServiceRef', AREAS: 'AreaRef', REVIEWS: 'Review', PROJECTS: 'GalleryItem',
}
// the story blocks read these two inline (s.value / m.year…) — declared, then VALIDATED against the scan below
const DECLARED_SHAPES: Record<string, Array<[string, string]>> = {
  stats: [['value', 'text'], ['label', 'text']],
  milestones: [['year', 'text'], ['title', 'text'], ['description', 'text']],
}
const IMAGE_NAME = /^(image|image_url|photo|logo|poster|avatar|beforeImage|afterImage|thumbnail|ogImage)$/
const URL_NAME = /(href|url|Url)$/

// ── 3. parse every exported interface the blocks/lib/data declare (TypeScript compiler, not regex) ────
type Field = { path: string; kind: string; required: boolean }
const shapes: Record<string, Field[]> = {}
function kindOf(name: string, t: ts.TypeNode | undefined, src: ts.SourceFile): string {
  if (!t) return 'text'
  const txt = t.getText(src)
  if (IMAGE_NAME.test(name)) return 'image'
  if (ts.isArrayTypeNode(t)) return ts.isTypeLiteralNode(t.elementType) ? 'items' : 'list'
  if (ts.isTypeLiteralNode(t)) return 'object'
  if (/^'/.test(txt) || txt.includes(" | '")) return 'enum'
  if (txt === 'number') return name.toLowerCase().includes('price') ? 'money' : 'number'
  if (txt === 'boolean') return 'boolean'
  if (URL_NAME.test(name)) return 'url'
  if (/price|Price/.test(name) && txt === 'string') return 'money'
  return 'text'
}
function walkMembers(members: ts.NodeArray<ts.TypeElement>, src: ts.SourceFile, prefix: string, out: Field[]) {
  for (const m of members) {
    if (!ts.isPropertySignature(m) || !m.name) continue
    const name = m.name.getText(src)
    const path = prefix ? `${prefix}.${name}` : name
    const t = m.type
    if (t && ts.isTypeLiteralNode(t)) { walkMembers(t.members, src, path, out); continue }
    if (t && ts.isArrayTypeNode(t) && ts.isTypeLiteralNode(t.elementType)) { walkMembers(t.elementType.members, src, `${path}[]`, out); continue }
    out.push({ path, kind: kindOf(name, t, src), required: !m.questionToken })
  }
}
function harvest(file: string) {
  const text = readFileSync(file, 'utf8')
  const src = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true)
  src.forEachChild((n) => {
    if (ts.isInterfaceDeclaration(n) && n.modifiers?.some((x) => x.kind === ts.SyntaxKind.ExportKeyword)) {
      const out: Field[] = []; walkMembers(n.members, src, '', out); shapes[n.name.text] = out
    }
  })
}
for (const f of readdirSync('src/components/blocks').filter((f) => f.endsWith('.ts'))) harvest(`src/components/blocks/${f}`)
for (const f of readdirSync('src/lib').filter((f) => f.endsWith('.ts'))) harvest(`src/lib/${f}`)
harvest('src/lib/types/page-types.ts'); harvest('src/data/projects.ts')

// ── 4. the SITE literal's own leaves (hero.headline…, social.instagram…) ──────────────────────────────
function literalLeaves(v: unknown, prefix: string, out: Field[]) {
  if (Array.isArray(v)) { if (v.length && typeof v[0] === 'object') literalLeaves(v[0], `${prefix}[]`, out); else out.push({ path: prefix, kind: 'list', required: false }); return }
  if (v && typeof v === 'object') { for (const [k, x] of Object.entries(v as object)) literalLeaves(x, prefix ? `${prefix}.${k}` : k, out); return }
  const name = prefix.split('.').pop() ?? prefix
  out.push({ path: prefix, kind: IMAGE_NAME.test(name) ? 'image' : URL_NAME.test(name) || /^(instagram|facebook|yelp|google|domain)$/.test(name) ? 'url' : typeof v === 'boolean' ? 'boolean' : typeof v === 'number' ? 'number' : 'text', required: false })
}
const siteLeaves: Record<string, Field[]> = {}
for (const [k, v] of Object.entries(SITE as Record<string, unknown>)) { const out: Field[] = []; literalLeaves(v, k, out); siteLeaves[k] = out }

// ── 5. each block's component files → the SITE keys it actually reads (the scan) ───────────────────────
const rs = readFileSync('src/components/render-section.tsx', 'utf8')
const importPath: Record<string, string> = {}
for (const m of rs.matchAll(/import \{([^}]+)\} from '~\/components\/([^']+)'/g)) for (const id of m[1].split(',')) { const p = `src/components/${m[2]}.tsx`; if (existsSync(p)) importPath[id.trim()] = p }
const inlineMaps: Record<string, string[]> = {}
for (const m of rs.matchAll(/const ([A-Z_]+_VARIANTS)[^=]*=\s*\{([\s\S]*?)\n\}/g)) inlineMaps[m[1]] = [...m[2].matchAll(/:\s*([A-Z]\w+)/g)].map((x) => x[1])
function variantsFileComponents(mapName: string): string[] {
  for (const f of readdirSync('src/components/blocks').filter((f) => f.endsWith('-variants.ts'))) {
    const t = readFileSync(`src/components/blocks/${f}`, 'utf8')
    if (!t.includes(`export const ${mapName}`)) continue
    const files: string[] = []
    for (const m of t.matchAll(/import \{([^}]+)\} from '\.\/([^']+)'/g)) for (const id of m[1].split(',')) { const p = `src/components/blocks/${m[2]}.tsx`; if (existsSync(p)) files.push(p) }
    return files
  }
  return []
}
const filesOf: Record<string, string[]> = {}
for (const m of rs.matchAll(/case '([a-zA-Z]+)':([\s\S]*?)(?=\n\s+case '|\n\s*default:)/g)) {
  const type = m[1]; const body = m[2]; const files = new Set<string>()
  for (const v of body.matchAll(/\b([A-Z_]+_VARIANTS)\[/g)) {
    const map = v[1]
    if (inlineMaps[map]) for (const id of inlineMaps[map]) { if (importPath[id]) files.add(importPath[id]) }
    else for (const f of variantsFileComponents(map)) files.add(f)
  }
  for (const c of body.matchAll(/<([A-Z]\w+)\b/g)) if (importPath[c[1]]) files.add(importPath[c[1]])
  filesOf[type] = [...files]
}
const COPY_KEYS = new Set(['hero', 'homeServices', 'homeAreas', 'homeReviews', 'homeCta', 'about', 'pricing', 'tagline', 'story', 'quoteForm', 'headerCtaLabel', 'ctaLabel', 'description', 'social', 'hours', 'phone', 'phoneDisplay', 'email', 'address', 'name', 'logo_url', 'logo_light_url'])
function scanProps(files: string[], key: string): string[] {
  const s = new Set<string>()
  for (const f of files) for (const m of readFileSync(f, 'utf8').matchAll(new RegExp(`\\b${key}\\??\\.([a-zA-Z_]+)`, 'g'))) if (!/^(map|length|slice|filter|some|every|join|trim|split)$/.test(m[1])) s.add(m[1])
  return [...s].sort()
}
function readsOf(files: string[]): string[] {
  const s = new Set<string>()
  const KNOWN = new Set([...Object.keys(SITE as object), ...Object.keys(INTO_KIND), ...Object.keys(SHAPE_OF)])
  for (const f of files) {
    const t = readFileSync(f, 'utf8')
    for (const m of t.matchAll(/\b(?:SITE|site)\??\.([a-zA-Z_]+)/g)) if (KNOWN.has(m[1])) s.add(m[1])
    for (const m of t.matchAll(/\(\s*(?:SITE|site) as [^)]*\)\??\.([a-zA-Z_]+)/g)) if (KNOWN.has(m[1])) s.add(m[1])
  }
  return [...s].sort()
}
// story blocks read stats/milestones inline — validate the declared shapes against what the files touch
for (const [key, fields] of Object.entries(DECLARED_SHAPES)) {
  const text = (filesOf.story ?? []).map((f) => readFileSync(f, 'utf8')).join('\n')
  for (const [prop] of fields) if (!new RegExp(`\\.${prop}\\b`).test(text)) throw new Error(`DECLARED_SHAPES.${key}.${prop} is not read by any story block — the declaration lies`)
}

// ── 6. assemble ───────────────────────────────────────────────────────────────────────────────────────
const variantsBySection = Object.fromEntries(VARIANT_MANIFEST.map((s) => [s.section, s]))
const blocks = Object.keys(BLOCK_NEEDS).map((type) => {
  const need = BLOCK_NEEDS[type as keyof typeof BLOCK_NEEDS]
  const vm = variantsBySection[type]
  const lab = LABELS[type]
  const en = lab?.en ?? vm?.label
  if (!en || !lab?.es) throw new Error(`block '${type}' has no label (en=${en ?? '∅'} es=${lab?.es ?? '∅'}) — name it in LABELS`)
  const files = filesOf[type] ?? []
  const reads = readsOf(files)
  const fields: Array<Field & { of: string }> = []
  const seen = new Set<string>()
  const push = (f: Field, of: string) => { if (!seen.has(f.path)) { seen.add(f.path); fields.push({ ...f, of }) } }
  // (a) the data this block owns: its `site` keys (INTO_KIND arrays/objects → item shapes; literal keys → leaves)
  for (const key of need.site) {
    if (siteLeaves[key]) { for (const f of siteLeaves[key]) push(f, 'site') ; continue }
    const iface = SHAPE_OF[key]
    if (iface && shapes[iface]) { for (const f of shapes[iface]) push({ ...f, path: `${key}[].${f.path}` }, 'item'); continue }
    if (DECLARED_SHAPES[key]) { for (const [p, k] of DECLARED_SHAPES[key]) push({ path: `${key}[].${p}`, kind: k, required: true }, 'item'); continue }
    if (key === 'IMAGES') continue
    // an object the reference literal does not carry (story, quoteForm — emitted only when a build has one):
    // its shape is what THIS block's components read off it (`story?.quote`, `quoteForm?.heading`…)
    const scanned = scanProps(files, key)
    if (scanned.length) { for (const p of scanned) push({ path: `${key}.${p}`, kind: IMAGE_NAME.test(p) ? 'image' : 'text', required: false }, 'site'); continue }
    throw new Error(`block '${type}' reads SITE.${key} but no shape is known for it — export an interface the block reads it as, then map it in SHAPE_OF`)
  }
  for (const into of need.into ?? []) { // object-into keys (story: about/story/stats/milestones) beyond `site`
    if (seen.size && need.site.includes(into)) continue
    if (siteLeaves[into]) for (const f of siteLeaves[into]) push(f, 'site')
    else if (DECLARED_SHAPES[into]) for (const [p, k] of DECLARED_SHAPES[into]) push({ path: `${into}[].${p}`, kind: k, required: true }, 'item')
  }
  // (b) the display copy this block's components read from SITE (found by scanning their source)
  for (const key of reads) if (COPY_KEYS.has(key) && siteLeaves[key]) for (const f of siteLeaves[key]) push(f, 'copy')
  // (c) page-record blocks: the page's own record
  const pageRecord = need.ctx === 'service' ? 'ServicePageData' : need.ctx === 'area' ? 'ServiceAreaPageData' : need.ctx === 'info' ? 'InfoPageData' : null
  if (pageRecord && shapes[pageRecord]) for (const f of shapes[pageRecord]) push({ ...f, path: `${need.ctx}.${f.path}` }, 'page')
  // (d) the per-block PARAMS copy channel: `params?.heading` / `.label` / `.body`… the components read (the
  // scaffolder emits these per section — "Places we plan" is gallery.params.label — and the site's layout row
  // carries them; they override the SITE copy at render). Data slots (need.params) and layout knobs are not copy.
  const KNOBS = new Set(['style', 'forceEnabled', 'servicesLayout', 'decorativeAsset', ...Object.keys(INTO_KIND), ...Object.values(BLOCK_NEEDS).map((n) => n.params).filter((x): x is string => Boolean(x))])
  for (const key of scanProps(files, 'params')) if (!KNOBS.has(key)) push({ path: `params.${key}`, kind: 'text', required: false }, 'params')
  const photo_targets = fields.filter((f) => f.kind === 'image').map((f) => f.path)
  return {
    type, label: { en, es: lab.es }, scope: need.scope,
    pages: PLACEMENT[type as keyof typeof PLACEMENT] === 'any' ? 'any' : PLACEMENT[type as keyof typeof PLACEMENT],
    data: { site_keys: need.site, ctx: need.ctx ?? null, params: need.params ?? null, into: need.into ?? null, kind: need.into?.[0] ? (INTO_KIND[need.into[0]] ?? 'array') : null, fallback: need.fallback === true },
    variants: (vm?.variants ?? []).map((v) => ({ id: v.id, label: v.label, default: v.default === true, wow: v.wow === true })),
    fields, photo_targets, reads, files: files.length,
  }
})

// site-wide chrome fields (not any one block's): identity + contact + social + images.ts slots
const chrome = Object.entries(siteLeaves).filter(([k]) => ['name', 'logo_url', 'logo_light_url', 'domain', 'phone', 'phoneDisplay', 'email', 'address', 'hours', 'tagline', 'description', 'social', 'headerCtaLabel'].includes(k)).flatMap(([, v]) => v)
const image_slots = [
  { id: 'hero', path: 'hero.image_url', per: 'site' }, { id: 'editorial', path: 'EDITORIAL_IMAGE', per: 'site' },
  { id: 'service', path: 'SERVICE_IMAGES[slug]', per: 'service' }, { id: 'area', path: 'AREA_IMAGES[slug]', per: 'area' }, { id: 'page', path: 'PAGE_IMAGES[slug]', per: 'infoPage' },
]
const custom_pages = { ref: shapes.CustomPageRef ?? [], data: shapes.CustomPageData ?? [], block: shapes.CustomPageBlock ?? [] }

const inputs = ['src/data/block-contract.ts', 'src/data/variant-manifest.ts', 'src/data/site.ts', 'src/data/layout.ts', 'src/components/render-section.tsx', 'src/lib/types/page-types.ts', 'src/data/projects.ts', ...readdirSync('src/components/blocks').map((f) => `src/components/blocks/${f}`), ...readdirSync('src/lib').filter((f) => f.endsWith('.ts')).map((f) => `src/lib/${f}`)]
const inputs_hash = createHash('sha256').update(inputs.sort().map((f) => readFileSync(f)).join('\n')).digest('hex').slice(0, 16)
const allFields = blocks.flatMap((b) => b.fields.map((f) => f.path))
const counts = {
  blocks: blocks.length,
  variants: blocks.reduce((n, b) => n + b.variants.length, 0),
  fields: new Set(allFields).size,
  fields_by_kind: Object.fromEntries([...new Set(blocks.flatMap((b) => b.fields.map((f) => f.kind)))].sort().map((k) => [k, new Set(blocks.flatMap((b) => b.fields.filter((f) => f.kind === k).map((f) => f.path))).size])),
  photo_targets: new Set([...blocks.flatMap((b) => b.photo_targets), ...image_slots.map((s) => s.path)]).size,
  chrome_fields: chrome.length,
  pages: PAGE_KINDS.length,
  blocks_without_variants: blocks.filter((b) => !b.variants.length).length,
  blocks_without_files: blocks.filter((b) => !b.files).map((b) => b.type),
}
const manifest = { version: 1, inputs_hash, counts, pages: PAGE_KINDS, blocks, chrome, image_slots, custom_pages }
const json = JSON.stringify(manifest, null, 2) + '\n'
if (CHECK) {
  const cur = existsSync(OUT) ? readFileSync(OUT, 'utf8') : ''
  if (cur !== json) { console.error(`lint:capability — ${OUT} lags its sources. Run: npm run gen:capability`); process.exit(1) }
  console.log(`lint:capability ok — ${counts.blocks} blocks / ${counts.variants} variants / ${counts.fields} fields / ${counts.photo_targets} photo targets (inputs ${inputs_hash})`)
} else {
  writeFileSync(OUT, json)
  console.log(JSON.stringify(counts, null, 2))
}
