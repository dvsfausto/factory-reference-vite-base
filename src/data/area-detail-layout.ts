import type { BlockType } from './layout'

// Per-item composition for /areas/$slug — the area-DETAIL analogue of
// HOMEPAGE_LAYOUT / ABOUT_LAYOUT and the Stage-D mirror of SERVICE_DETAIL_LAYOUT. The
// area route maps over this array (via the shared SectionList) instead of the fixed
// ServiceAreaPageTemplate, so the detail page's structure is a data dial (reorder /
// add / remove a section with no component edit), reusing the existing section library
// + three new per-item area blocks.
//
// AreaDetailBlock reuses the homepage BlockType vocabulary (so it can compose any
// existing section, hero, faq, cta, …) and adds three area-specific block types.
// Those blocks read THIS area's content from ctx.area (SectionContext), so the SAME
// layout renders every area page with its own copy. This file is ADDITIVE — the
// scaffolder never emits or overwrites it (it only emits src/data/layout.ts's
// HOMEPAGE_LAYOUT array), so block-composing the area page needs no scaffolder change
// and it ships verbatim with the reference.
//
// NOTE: areas carry no own image field; the shared renderer feeds the hero a fallback
// image, so the area blocks here never touch the hero.
export type AreaDetailBlockType =
  | BlockType
  | 'areaAbout'
  | 'areaDetails'
  | 'relatedAreas'

export interface AreaDetailBlock {
  type: AreaDetailBlockType
  variant?: string
  params?: Record<string, unknown>
}

export const AREA_DETAIL_LAYOUT: AreaDetailBlock[] = [
  { type: 'hero', variant: 'aurora' },
  { type: 'areaAbout' },
  { type: 'areaDetails' },
  { type: 'relatedAreas' },
  { type: 'faq', variant: 'glass-accordion' },
  { type: 'cta', variant: 'aurora-glow' },
]
