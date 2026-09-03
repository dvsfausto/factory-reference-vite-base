import type { BlockType } from './layout'
import { familyOr } from '~/lib/family-variant'

// Per-page composition for /reviews (Arc 3 · Stage B), mirroring about-layout.ts.
// The reviews route maps over this array via the shared renderer instead of
// hardcoding its sections. Adds an 'intro' block (the shared WOW page-intro) and a
// page-specific 'reviewsIndex' block that renders the FULL reviews list (ALL reviews,
// count 50) — NOT the homepage's 6-item preview, so no content is dropped. ADDITIVE:
// the scaffolder never emits or overwrites it.
// Half B · P1a: alias of the ONE block vocabulary (src/data/layout.ts). This page's own
// members live in that union now; placement is data in src/data/block-contract.ts.
export type ReviewsBlockType = BlockType

export interface ReviewsBlock {
  /**
   * C1a — stable block-instance identity. The factory emits it (persisted id, else `<type>` /
   * `<type>-N` by ordinal) so the editor addresses a section by instance, not by type. Inert at
   * render time; absent on carried (un-emitted) layouts.
   */
  id?: string
  type: ReviewsBlockType
  variant?: string
  params?: Record<string, unknown>
}

export const REVIEWS_LAYOUT: ReviewsBlock[] = [
  { type: 'intro' },
  { type: 'reviewsIndex' },
  { type: 'cta', variant: familyOr('aurora-glow'), params: { title: 'Want to work together?' } },
]
