import type { BlockType } from './layout'
import { familyOr } from '~/lib/family-variant'

// Per-page composition for /reviews (Arc 3 · Stage B), mirroring about-layout.ts.
// The reviews route maps over this array via the shared renderer instead of
// hardcoding its sections. Adds an 'intro' block (the shared WOW page-intro) and a
// page-specific 'reviewsIndex' block that renders the FULL reviews list (ALL reviews,
// count 50) — NOT the homepage's 6-item preview, so no content is dropped. ADDITIVE:
// the scaffolder never emits or overwrites it.
export type ReviewsBlockType = BlockType | 'intro' | 'reviewsIndex'

export interface ReviewsBlock {
  type: ReviewsBlockType
  variant?: string
  params?: Record<string, unknown>
}

export const REVIEWS_LAYOUT: ReviewsBlock[] = [
  { type: 'intro' },
  { type: 'reviewsIndex' },
  { type: 'cta', variant: familyOr('aurora-glow'), params: { title: 'Want to work together?' } },
]
