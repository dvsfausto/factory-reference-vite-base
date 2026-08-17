// Scaffolder contract: page data shapes the factory emits, the components consume.
// FAQ uses { question, answer } (Zmode canonical, matches cars-spanish reference).

export interface FAQ {
  question: string
  answer: string
}

// CANONICAL Testimonial contract (M4.2). Source of truth:
// factory-build/factory/contracts/testimonial.ts. Keep shape-identical to it
// and to the painter template — enforced by scripts/check-contract-parity.ts.
export interface Testimonial {
  text: string
  author: string
  location?: string
  rating?: number
}

export interface RelatedLink {
  href: string
  label: string
}

export interface ServiceRef {
  slug: string
  name: string
  short: string
  tagline?: string
  /**
   * Publish state. Absent === published (backward-compatible). The editor sets `false` to
   * UNPUBLISH a service: `visibleServices()` (src/data/services-view.ts) filters it out of every
   * UI consumer, and the /services/$slug loader 301-redirects it. Restore un-sets the flag.
   */
  published?: boolean
  /**
   * Paging state — the three-way separation (visible ≠ has-a-page). Absent === paged
   * (backward-compatible: any ≤8-service build is byte-identical to today). The scaffolder sets
   * `false` for services beyond the top-8 (by display_order) so they stay VISIBLE (list/grid/
   * pricing render the ref) and fully EDITABLE (servicesData is still emitted) but get NO dedicated
   * page: `PAGED_SERVICES` (services-view.ts) drops them from nav + sitemap, the /services/$slug
   * loader 301-redirects them, and the index renders them as a card, not an anchor. A customer
   * override (design_dna.services.paged) can force this on or off and survives rebuild.
   */
  paged?: boolean
  /**
   * Catalog affordance — the generated `services.action` (buy/collect/quote/book/inquire) forwarded
   * by the scaffolder from the owner's catalog. Drives which catalog-reading widgets offer this
   * service: the quote form lists only `action === 'quote'`, booking only `'book'`, etc. Absent ===
   * unknown (older builds) → catalog widgets fall back to offering all visible services.
   */
  action?: 'buy' | 'collect' | 'quote' | 'book' | 'inquire'
}

export interface AreaRef {
  slug: string
  name: string
  tier?: 'home-base' | 'primary' | 'secondary'
  zipCodes?: string[]
}

export interface InfoPageRef {
  slug: string
  name: string
}

// ── CUSTOM PAGES (Phase 2 — add/remove whole pages) ──────────────────────────
// A customer-created routable page served by the generic /p/$slug catch-all route
// and rendered through the SAME SectionList as every other page. Content comes from
// (a) the page's own supplied copy (ctx.intro + each block's params) and (b) any
// existing global-data blocks the layout composes — never a new content store.
// AUTO-GENERATED into src/data/custom-pages.ts from design_dna.customPages; absent
// → the reference ships empty arrays (no /p pages, no custom nav) → byte-identical.
export interface CustomPageRef {
  slug: string
  title: string
  /** Show a header/footer nav link for this page. Default true; false → reachable by URL only. */
  nav?: boolean
}

export interface CustomPageBlock {
  type: string
  variant?: string
  params?: Record<string, unknown>
}

export interface CustomPageData {
  slug: string
  /** Page title — the <title>/meta title and the nav label. */
  title: string
  /** Meta description for this page's <head>. */
  description: string
  /** Page header copy, rendered by the shared `intro` block via ctx.intro. */
  intro?: { eyebrow?: string; heading: string; body?: string }
  /** The page's section list — composed from the shared block library (incl. `richText`). */
  layout: CustomPageBlock[]
}

export interface ServicePageData {
  slug: string
  title: string
  description: string
  hero: {
    h1: string
    subhead: string
    trustLine?: string
  }
  whatWeBuy: {
    title: string
    body: string
    items: string[]
  }
  howPrice: {
    title: string
    body: string
    factors: { title: string; text: string }[]
  }
  scenarios: {
    title: string
    intro: string
    cards: { title: string; text: string }[]
  }
  pricing: {
    title: string
    body: string
    ranges?: { label: string; range: string }[]
    notes: string[]
  }
  coverage: {
    title: string
    intro: string
    areas: RelatedLink[]
  }
  localContext?: {
    title?: string
    body: string[]
  }
  testimonial?: Testimonial
  faqs: FAQ[]
  relatedServices: RelatedLink[]
}

export interface ServiceAreaPageData {
  slug: string
  title: string
  description: string
  name: string
  tier?: 'home-base' | 'primary' | 'secondary'
  zipCodes?: string[]
  hero: {
    h1: string
    subhead: string
  }
  about: {
    title: string
    body: string[]
  }
  servicesHere: {
    title: string
    intro: string
    featured: string[]
  }
  landmarks: {
    title: string
    intro: string
    items: string[]
  }
  localContext?: {
    title?: string
    body: string[]
  }
  testimonial?: Testimonial
  faqs: FAQ[]
  relatedAreas: RelatedLink[]
}

export interface InfoPageSection {
  heading: string
  body: string[]
  list?: string[]
}

export interface InfoPageData {
  slug: string
  title: string
  description: string
  hero: {
    h1: string
    subhead: string
  }
  intro: string[]
  sections: InfoPageSection[]
  faqs: FAQ[]
  relatedInfo: RelatedLink[]
  relatedServices: RelatedLink[]
}

// CANONICAL Review contract (M4.1). Source of truth:
// factory-build/factory/contracts/review.ts. Keep shape-identical to it and to
// the painter template — enforced by scripts/check-contract-parity.ts.
export interface Review {
  id: string
  text: string
  author: string
  rating: number
  location?: string
  service?: string
  date?: string
  source?: 'google' | 'yelp' | 'manual' | 'direct' | 'hybrid'
  avatar?: string
}
