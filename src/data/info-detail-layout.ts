import type { BlockType } from './layout'

// Per-item composition for /info/$slug — the info-DETAIL analogue of
// HOMEPAGE_LAYOUT / SERVICE_DETAIL_LAYOUT. The info route maps over this array (via the
// shared SectionList) instead of the fixed InfoPageTemplate, so the info page's
// structure is a data dial (reorder / add / remove a section with no component edit),
// reusing the existing section library + two new per-item info blocks.
//
// InfoDetailBlock reuses the homepage BlockType vocabulary (so it can compose any
// existing section, hero, faq, cta, …) and adds two info-specific block types. Those
// blocks read THIS info page's content from ctx.info (SectionContext), so the SAME
// layout renders every info page with its own copy. This file is ADDITIVE — the
// scaffolder never emits or overwrites it (it only emits src/data/layout.ts's
// HOMEPAGE_LAYOUT array), so block-composing the info page needs no scaffolder change
// and it ships verbatim with the reference.
export type InfoDetailBlockType = BlockType | 'infoArticle' | 'relatedInfo'

export interface InfoDetailBlock {
  /**
   * C1a — stable block-instance identity. The factory emits it (persisted id, else `<type>` /
   * `<type>-N` by ordinal) so the editor addresses a section by instance, not by type. Inert at
   * render time; absent on carried (un-emitted) layouts.
   */
  id?: string
  type: InfoDetailBlockType
  variant?: string
  params?: Record<string, unknown>
}

export const INFO_DETAIL_LAYOUT: InfoDetailBlock[] = [
  { type: 'hero', variant: 'banner' },
  { type: 'infoArticle' },
  { type: 'relatedInfo' },
  { type: 'faq', variant: 'glass-accordion' },
  { type: 'cta', variant: 'aurora-glow' },
]
