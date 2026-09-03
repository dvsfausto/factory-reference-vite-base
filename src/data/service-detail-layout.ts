import type { BlockType } from './layout'
import { familyOr } from '~/lib/family-variant'

// Per-item composition for /services/$slug — the service-DETAIL analogue of
// HOMEPAGE_LAYOUT / ABOUT_LAYOUT. The service route maps over this array (via the
// shared SectionList) instead of the fixed ServicePageTemplate, so the detail page's
// structure is a data dial (reorder / add / remove a section with no component edit),
// reusing the existing section library + three new per-item service blocks.
//
// ServiceDetailBlock reuses the homepage BlockType vocabulary (so it can compose any
// existing section, hero, faq, cta, …) and adds three service-specific block types.
// Those blocks read THIS service's content from ctx.service (SectionContext), so the
// SAME layout renders every service page with its own copy. This file is ADDITIVE —
// the scaffolder never emits or overwrites it (it only emits src/data/layout.ts's
// HOMEPAGE_LAYOUT array), so block-composing the service page needs no scaffolder
// change and it ships verbatim with the reference.
export type ServiceDetailBlockType =
  | BlockType
  | 'serviceWhatWeCover'
  | 'serviceDetails'
  | 'relatedServices'

export interface ServiceDetailBlock {
  /**
   * C1a — stable block-instance identity. The factory emits it (persisted id, else `<type>` /
   * `<type>-N` by ordinal) so the editor addresses a section by instance, not by type. Inert at
   * render time; absent on carried (un-emitted) layouts.
   */
  id?: string
  type: ServiceDetailBlockType
  variant?: string
  params?: Record<string, unknown>
}

export const SERVICE_DETAIL_LAYOUT: ServiceDetailBlock[] = [
  { type: 'hero', variant: 'banner' },
  { type: 'serviceWhatWeCover' },
  { type: 'serviceDetails' },
  { type: 'relatedServices' },
  { type: 'faq', variant: 'glass-accordion' },
  { type: 'cta', variant: familyOr('aurora-glow') },
]
