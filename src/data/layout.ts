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

export interface LayoutBlock {
  /** Which section-block to render. */
  type: BlockType
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
