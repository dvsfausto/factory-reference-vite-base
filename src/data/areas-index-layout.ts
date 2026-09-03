import type { BlockType } from './layout'
import { familyOr } from '~/lib/family-variant'

// Per-page composition for /areas (Arc 3 · Stage B), mirroring about-layout.ts.
// The areas-index route maps over this array via the shared renderer. Adds an 'intro'
// block (the shared WOW page-intro) and a page-specific 'areasIndex' block that
// renders the FULL service-areas list (ALL areas) — NOT the homepage preview — so no
// content is dropped. ADDITIVE: the scaffolder never emits or overwrites it.
// Half B · P1a: alias of the ONE block vocabulary (src/data/layout.ts). This page's own
// members live in that union now; placement is data in src/data/block-contract.ts.
export type AreasIndexBlockType = BlockType

export interface AreasIndexBlock {
  /**
   * C1a — stable block-instance identity. The factory emits it (persisted id, else `<type>` /
   * `<type>-N` by ordinal) so the editor addresses a section by instance, not by type. Inert at
   * render time; absent on carried (un-emitted) layouts.
   */
  id?: string
  type: AreasIndexBlockType
  variant?: string
  params?: Record<string, unknown>
}

export const AREAS_INDEX_LAYOUT: AreasIndexBlock[] = [
  { type: 'intro' },
  { type: 'areasIndex' },
  {
    type: 'cta',
    variant: familyOr('aurora-glow'),
    params: {
      title: "Don't see your area?",
      subtitle: 'Call us, we often travel for the right project.',
    },
  },
]
