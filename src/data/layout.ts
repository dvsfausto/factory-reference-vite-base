// Homepage layout contract (Path A seed — Sprint Prompt 1).
//
// The homepage renders by mapping over an ordered array of section-blocks.
// This makes page STRUCTURE a data dial: order is the array index, and a block
// is present iff it appears in the array (omission = remove the entry — there is
// no separate `omit` flag, so the array reads top-to-bottom as the page).
//
// Data-conditional auto-omit still lives INSIDE each block (e.g. the reviews
// block returns null when there are no reviews), exactly as the old
// `{cond && <section>}` did — so a block listed here may still self-omit.
//
// `params` is an OPTIONAL per-block override channel for future use
// (Sprint Prompts 2/3). The DEFAULT layout below uses no params: every block
// falls back to its built-in (verbatim) content, which is what keeps the
// rendered page byte-identical to the pre-refactor hardcoded homepage.
//
// Reused by: Prompt 2 (shared-wiring extraction) and Prompt 3 (generalize to
// other templates + I-1 brand palette). Keep this minimal and inspectable.

export type BlockType =
  | 'hero'
  | 'taglineBar'
  | 'localBar'
  | 'trustBar'
  | 'servicesPreview'
  | 'serviceAreas'
  | 'reviews'
  | 'faq'
  | 'cta'
  // 'team' is a first-class section type (TEAM_VARIANTS), composable on any page.
  // No vertical's homepage DNA emits it today, so HOMEPAGE_LAYOUT is unchanged and
  // the emitted layout.ts (which preserves this union verbatim) gains only this
  // additive member; the about page composes it via its own ABOUT_LAYOUT.
  | 'team'
  // First-class section types (each has a *_VARIANTS map + a renderBlock case),
  // composable on any page. No homepage DNA emits them, so HOMEPAGE_LAYOUT is
  // unchanged; the emitted layout.ts gains only these additive union members.
  | 'pricing'
  | 'gallery'
  | 'process'
  | 'faqSection'
  | 'story'
  | 'forms'
  // Gap-analysis section types (batch 2): each has a *_VARIANTS map + renderBlock
  // case, composable on any page. Additive union members — no homepage DNA emits
  // them, so HOMEPAGE_LAYOUT and every emitted layout.ts stay unchanged.
  | 'membership'
  | 'packages'
  | 'caseStudies'
  | 'videoTestimonials'
  | 'promotions'
  | 'financing'
  | 'partners'
  | 'map'
  | 'blog'
  // Native self-service BOOKING section (Arc 4a · Stage 2). A real on-page scheduler
  // (service → date → time → confirmed) that books without leaving the site, reading
  // live bookable services + availability under the anon key and posting create-booking.
  // Additive union member — HOMEPAGE_LAYOUT is unchanged; the scaffolder splices
  // { type: 'booking' } into the emitted layout ONLY for solo-appointment business
  // types (site.ts BOOKING.enabled), so no-booking builds stay byte-identical.
  | 'booking'

export interface LayoutBlock {
  /** Which section-block to render. */
  type: BlockType
  /**
   * Optional component VARIANT for this block. Selects an alternate composition
   * of the same block type (e.g. a 'bold-fullbleed' hero) via the render path's
   * per-type variant map. Absent/unknown → the block's default component
   * (backward-compat: verticals that don't set a variant render exactly as
   * before). Driven by design_dna.layout per industry.
   */
  variant?: string
  /** Optional per-block overrides. Omitted → block uses its built-in defaults. */
  params?: Record<string, unknown>
}

/**
 * The default homepage layout: today's sections, in today's exact order.
 * Changing this array (reorder / remove an entry) changes the page structure
 * with NO component edits — that is the whole point of Path A.
 */
export const HOMEPAGE_LAYOUT: LayoutBlock[] = [
  { type: 'hero' },
  { type: 'taglineBar' },
  { type: 'localBar' },
  { type: 'trustBar' },
  { type: 'servicesPreview' },
  { type: 'serviceAreas' },
  { type: 'reviews' },
  { type: 'faq' },
  { type: 'cta' },
]
