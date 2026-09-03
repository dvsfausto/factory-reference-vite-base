// ── BLOCK CONTRACT (Half B · P1a) ────────────────────────────────────────────
// One table that says, for every member of the ONE block vocabulary (layout.ts
// BlockType), (a) where its content comes from today and (b) on which pages it may
// be placed. P1a writes the table and proves it compiles; NOTHING reads it yet.
//   · P1b (DONE): every data-bearing block component takes optional site/services/areas/
//     reviews/projects props defaulting to the module read; render-section.tsx resolveData()
//     fills them from `params.<params> → ctx.<ctx> → (nothing → module default)` using `into`.
//   · P5 makes PLACEMENT the refusal point for an off-page block (the scaffolder's
//     homepage guard accepts any union member now that the unions are one).
// Data-only: render-section.tsx reads BLOCK_NEEDS (P1b); no default layout names a params
// slice, so every emitted site is byte-identical to the pre-P1a reference (gate: test:ssr-identity).
import type { BlockType } from './layout'

/** The routable page kinds a block can be placed on. `custom` = /p/$slug pages. */
export type PageKind =
  | 'home'
  | 'about'
  | 'contact'
  | 'pricing'
  | 'reviews'
  | 'servicesIndex'
  | 'areasIndex'
  | 'serviceDetail'
  | 'areaDetail'
  | 'infoDetail'
  | 'custom'

export const PAGE_KINDS: readonly PageKind[] = [
  'home',
  'about',
  'contact',
  'pricing',
  'reviews',
  'servicesIndex',
  'areasIndex',
  'serviceDetail',
  'areaDetail',
  'infoDetail',
  'custom',
]

/**
 * Where a block's content comes from.
 *   site   — a fixed SITE.* key / generated array (SERVICES, AREAS, REVIEWS, PROJECTS);
 *            the same content on every page it is placed on until P1b lets params/ctx win.
 *   page   — the page's own record via SectionContext (ctx.service / ctx.area / ctx.info /
 *            ctx.intro / ctx.faqs); meaningless on a page that supplies no such record.
 *   params — reads its own `params` only (label/heading-level knobs, or a live read).
 *   chrome — brand/contact chrome (name, phone, address, hours); never page-scoped.
 */
export type BlockScope = 'site' | 'page' | 'params' | 'chrome'

export interface BlockNeed {
  scope: BlockScope
  /** SITE.* keys (or generated-array names) the block's variants read today. */
  site: readonly string[]
  /** SectionContext key the block reads (or will read, P1b) before falling back to `site`. */
  ctx?: 'service' | 'area' | 'info' | 'intro' | 'faqs'
  /** The `params` key P1b resolves FIRST (the block-instance's own data). Absent = params-only knobs today. */
  params?: string
  /**
   * P1b · what `params.<params>` supplies. ONE entry → the param value replaces that SITE key
   * (or, for SERVICES/AREAS/REVIEWS/PROJECTS, is passed as that array). Several entries (only
   * `story`) → the param is an object whose listed keys overlay SITE. Absent → params-only knobs.
   * Resolution order at render (render-section.tsx resolveData): params.<params> → ctx.<ctx> → SITE.
   * A supplied value whose JS kind differs from INTO_KIND[key] is ignored (→ default read).
   */
  into?: readonly string[]
  /**
   * P5 · the block renders BUILT-IN copy when every key in `site` is empty (hero/cta/trustBar/forms
   * default strings; contactForm's form; booking's live widget) — it never self-omits. Absent = the
   * block returns null (or renders nothing visible) when its deciding key is empty. The editor's
   * placement matrix offers a `fallback` block regardless of data; test:placement-probe proves it.
   */
  fallback?: true
}

/**
 * P1b · the JS kind every `into` SITE key must have. resolveData drops a supplied value of any other
 * kind instead of writing it into `site` — a string where a variant does `.slice().map()` is an SSR
 * crash, not a fallback. The four array modules (SERVICES/AREAS/REVIEWS/PROJECTS) are always arrays
 * and are not listed. lint:blocks asserts every `into` SITE key has an entry.
 */
export const INTO_KIND: Readonly<Record<string, 'array' | 'object' | 'string'>> = {
  hero: 'object',
  homeCta: 'object',
  quoteForm: 'object',
  financing: 'object',
  story: 'object',
  about: 'string',
  homeFaqs: 'array',
  trustItems: 'array',
  team: 'array',
  plans: 'array',
  steps: 'array',
  stats: 'array',
  milestones: 'array',
  posts: 'array',
  memberships: 'array',
  packages: 'array',
  caseStudies: 'array',
  videoTestimonials: 'array',
  promotions: 'array',
  partners: 'array',
}

/** Every BlockType, exactly once (lint:blocks asserts the switch and this table agree). */
export const BLOCK_NEEDS: Readonly<Record<BlockType, BlockNeed>> = {
  // homepage core
  hero: { scope: 'site', site: ['hero', 'REVIEWS', 'IMAGES'], params: 'hero', into: ['hero'], fallback: true },
  taglineBar: { scope: 'chrome', site: ['tagline'] },
  // reads AREAS (the neighbourhood strip), not the contact chrome — corrected in P5 by the placement probe
  localBar: { scope: 'site', site: ['AREAS'], params: 'areas', into: ['AREAS'] },
  trustBar: { scope: 'site', site: ['trustItems'], params: 'items', into: ['trustItems'], fallback: true },
  servicesPreview: { scope: 'site', site: ['SERVICES', 'homeServices'], params: 'services', into: ['SERVICES'] },
  serviceAreas: { scope: 'site', site: ['AREAS'], params: 'areas', into: ['AREAS'] },
  reviews: { scope: 'site', site: ['REVIEWS'], params: 'reviews', into: ['REVIEWS'] },
  faq: { scope: 'page', site: ['homeFaqs'], ctx: 'faqs', params: 'faqs', into: ['homeFaqs'] },
  cta: { scope: 'site', site: ['homeCta', 'hero'], params: 'cta', into: ['homeCta'], fallback: true },
  // composable content sections
  team: { scope: 'site', site: ['team'], params: 'team', into: ['team'] },
  pricing: { scope: 'site', site: ['plans'], params: 'plans', into: ['plans'] },
  gallery: { scope: 'site', site: ['PROJECTS'], params: 'projects', into: ['PROJECTS'] },
  process: { scope: 'site', site: ['steps'], params: 'steps', into: ['steps'] },
  faqSection: { scope: 'site', site: ['homeFaqs'], ctx: 'faqs', params: 'faqs', into: ['homeFaqs'] },
  story: { scope: 'site', site: ['about', 'story', 'stats', 'milestones', 'IMAGES'], params: 'story', into: ['about', 'story', 'stats', 'milestones'] },
  forms: { scope: 'site', site: ['quoteForm'], params: 'form', into: ['quoteForm'], fallback: true },
  membership: { scope: 'site', site: ['memberships'], params: 'memberships', into: ['memberships'] },
  packages: { scope: 'site', site: ['packages'], params: 'packages', into: ['packages'] },
  caseStudies: { scope: 'site', site: ['caseStudies'], params: 'caseStudies', into: ['caseStudies'] },
  videoTestimonials: { scope: 'site', site: ['videoTestimonials'], params: 'videoTestimonials', into: ['videoTestimonials'] },
  promotions: { scope: 'site', site: ['promotions'], params: 'promotions', into: ['promotions'] },
  financing: { scope: 'site', site: ['financing'], params: 'financing', into: ['financing'] },
  partners: { scope: 'site', site: ['partners'], params: 'partners', into: ['partners'] },
  map: { scope: 'site', site: ['AREAS'], params: 'areas', into: ['AREAS'] },
  blog: { scope: 'site', site: ['posts'], params: 'posts', into: ['posts'] },
  booking: { scope: 'params', site: [], fallback: true },
  richText: { scope: 'params', site: [] },
  // page-record blocks (were the inner unions' own members)
  intro: { scope: 'page', site: [], ctx: 'intro' },
  serviceWhatWeCover: { scope: 'page', site: [], ctx: 'service' },
  serviceDetails: { scope: 'page', site: [], ctx: 'service' },
  relatedServices: { scope: 'page', site: ['SERVICES'], ctx: 'service' },
  areaAbout: { scope: 'page', site: [], ctx: 'area' },
  areaDetails: { scope: 'page', site: [], ctx: 'area' },
  relatedAreas: { scope: 'page', site: ['AREAS'], ctx: 'area' },
  infoArticle: { scope: 'page', site: [], ctx: 'info' },
  relatedInfo: { scope: 'page', site: [], ctx: 'info' },
  // full-list index blocks
  servicesIndex: { scope: 'site', site: ['SERVICES'], params: 'services', into: ['SERVICES'] },
  areasIndex: { scope: 'site', site: ['AREAS'], params: 'areas', into: ['AREAS'] },
  reviewsIndex: { scope: 'site', site: ['REVIEWS'] },
  contactForm: { scope: 'chrome', site: ['phone', 'email', 'address', 'hours'], fallback: true },
}

/**
 * PLACEMENT — today's eligibility, made data. 'any' = every PageKind (the former base
 * union members). A page-record block is only meaningful where its record exists; the
 * index blocks and contactForm stay on their own page. P5 reads this to refuse.
 */
export const PLACEMENT: Readonly<Record<BlockType, 'any' | readonly PageKind[]>> = {
  hero: 'any', taglineBar: 'any', localBar: 'any', trustBar: 'any', servicesPreview: 'any',
  serviceAreas: 'any', reviews: 'any', faq: 'any', cta: 'any', team: 'any', pricing: 'any',
  gallery: 'any', process: 'any', faqSection: 'any', story: 'any', forms: 'any',
  membership: 'any', packages: 'any', caseStudies: 'any', videoTestimonials: 'any',
  promotions: 'any', financing: 'any', partners: 'any', map: 'any', blog: 'any', booking: 'any',
  intro: ['about', 'pricing', 'contact', 'reviews', 'servicesIndex', 'areasIndex', 'custom'],
  serviceWhatWeCover: ['serviceDetail'],
  serviceDetails: ['serviceDetail'],
  relatedServices: ['serviceDetail'],
  areaAbout: ['areaDetail'],
  areaDetails: ['areaDetail'],
  relatedAreas: ['areaDetail'],
  infoArticle: ['infoDetail'],
  relatedInfo: ['infoDetail'],
  servicesIndex: ['servicesIndex'],
  areasIndex: ['areasIndex'],
  reviewsIndex: ['reviews'],
  contactForm: ['contact'],
  // params-only copy block; today only custom-page layouts (typed `type: string`) can name it
  richText: ['custom'],
}

/** May `type` be placed on `page`? Unknown type → false (never "any" by accident). */
export function isPlaceable(type: string, page: PageKind): boolean {
  const rule = (PLACEMENT as Record<string, 'any' | readonly PageKind[] | undefined>)[type]
  if (!rule) return false
  return rule === 'any' || rule.includes(page)
}

/** Every block type this contract knows — the vocabulary as data. */
export const BLOCK_TYPES: readonly BlockType[] = Object.keys(BLOCK_NEEDS) as BlockType[]
