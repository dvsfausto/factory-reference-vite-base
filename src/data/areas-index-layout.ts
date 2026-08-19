import type { BlockType } from './layout'

// Per-page composition for /areas (Arc 3 · Stage B), mirroring about-layout.ts.
// The areas-index route maps over this array via the shared renderer. Adds an 'intro'
// block (the shared WOW page-intro) and a page-specific 'areasIndex' block that
// renders the FULL service-areas list (ALL areas) — NOT the homepage preview — so no
// content is dropped. ADDITIVE: the scaffolder never emits or overwrites it.
export type AreasIndexBlockType = BlockType | 'intro' | 'areasIndex'

export interface AreasIndexBlock {
  type: AreasIndexBlockType
  variant?: string
  params?: Record<string, unknown>
}

export const AREAS_INDEX_LAYOUT: AreasIndexBlock[] = [
  { type: 'intro' },
  { type: 'areasIndex' },
  {
    type: 'cta',
    variant: 'aurora-glow',
    params: {
      title: "Don't see your area?",
      subtitle: 'Call us, we often travel for the right project.',
    },
  },
]
