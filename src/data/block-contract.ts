// ── BLOCK CONTRACT (Half B · P1a) ────────────────────────────────────────────
// One table that says, for every member of the ONE block vocabulary (layout.ts
// BlockType), (a) where its content comes from today and (b) on which pages it may
// be placed. P1a writes the table and proves it compiles; NOTHING reads it yet.
//   · P1b makes the fixed-source blocks read `params.<key> → ctx.<key> → SITE.<key>`
//     in the order this table names (the codemod's specification).
//   · P5 makes PLACEMENT the refusal point for an off-page block (the scaffolder's
//     homepage guard accepts any union member now that the unions are one).
// Type-only + data-only: no route, component or default layout imports this file, so
// every emitted site is byte-identical to the pre-P1a reference (gate: test:ssr-identity).
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
}

/** Every BlockType, exactly once (lint:blocks asserts the switch and this table agree). */
export const BLOCK_NEEDS: Readonly<Record<BlockType, BlockNeed>> = {
  // homepage core
  hero: { scope: 'site', site: ['hero', 'REVIEWS', 'IMAGES'], params: 'hero' },
  taglineBar: { scope: 'chrome', site: ['tagline'] },
  localBar: { scope: 'chrome', site: ['address', 'hours', 'phone'] },
  trustBar: { scope: 'site', site: ['trustItems'], params: 'items' },
  servicesPreview: { scope: 'site', site: ['homeServices', 'SERVICES'], params: 'services' },
  serviceAreas: { scope: 'site', site: ['AREAS'], params: 'areas' },
  reviews: { scope: 'site', site: ['REVIEWS'], params: 'reviews' },
  faq: { scope: 'page', site: ['homeFaqs'], ctx: 'faqs', params: 'faqs' },
  cta: { scope: 'site', site: ['homeCta', 'hero'], params: 'cta' },
  // composable content sections
  team: { scope: 'site', site: ['team'], params: 'team' },
  pricing: { scope: 'site', site: ['plans'], params: 'plans' },
  gallery: { scope: 'site', site: ['PROJECTS'], params: 'projects' },
  process: { scope: 'site', site: ['steps'], params: 'steps' },
  faqSection: { scope: 'site', site: ['homeFaqs'], ctx: 'faqs', params: 'faqs' },
  story: { scope: 'site', site: ['about', 'story', 'stats', 'milestones', 'IMAGES'], params: 'story' },
  forms: { scope: 'site', site: ['quoteForm'], params: 'form' },
  membership: { scope: 'site', site: ['memberships'], params: 'memberships' },
  packages: { scope: 'site', site: ['packages'], params: 'packages' },
  caseStudies: { scope: 'site', site: ['caseStudies'], params: 'caseStudies' },
  videoTestimonials: { scope: 'site', site: ['videoTestimonials'], params: 'videoTestimonials' },
  promotions: { scope: 'site', site: ['promotions'], params: 'promotions' },
  financing: { scope: 'site', site: ['financing'], params: 'financing' },
  partners: { scope: 'site', site: ['partners'], params: 'partners' },
  map: { scope: 'site', site: ['AREAS'], params: 'areas' },
  blog: { scope: 'site', site: ['posts'], params: 'posts' },
  booking: { scope: 'params', site: [] },
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
  servicesIndex: { scope: 'site', site: ['SERVICES'] },
  areasIndex: { scope: 'site', site: ['AREAS'] },
  reviewsIndex: { scope: 'site', site: ['REVIEWS'] },
  contactForm: { scope: 'chrome', site: ['phone', 'email', 'address', 'hours'] },
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
