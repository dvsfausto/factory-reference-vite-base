import type { BlockType } from './layout'
import { familyOr } from '~/lib/family-variant'

// Per-page composition for /about — the inner-page analogue of HOMEPAGE_LAYOUT.
// The about route maps over this array instead of hardcoding its sections, so the
// page's structure is a data dial (reorder / add / remove a section with no
// component edit), reusing the existing section library + the new team block.
//
// AboutBlock reuses the homepage BlockType vocabulary (so it can compose any
// existing section + 'team') and adds an 'intro' block specific to this page. This
// file is ADDITIVE, the scaffolder never emits or overwrites it (it only emits
// src/data/layout.ts's HOMEPAGE_LAYOUT array) — so block-composing the about page
// needs no scaffolder change.
export type AboutBlockType = BlockType | 'intro'

export interface AboutBlock {
  /**
   * C1a — stable block-instance identity. The factory emits it (persisted id, else `<type>` /
   * `<type>-N` by ordinal) so the editor addresses a section by instance, not by type. Inert at
   * render time; absent on carried (un-emitted) layouts.
   */
  id?: string
  type: AboutBlockType
  variant?: string
  params?: Record<string, unknown>
}

export const ABOUT_LAYOUT: AboutBlock[] = [
  { type: 'intro' },
  { type: 'team', variant: 'grid' },
  { type: 'trustBar', variant: familyOr('glow-cards') },
  { type: 'cta', variant: familyOr('aurora-glow') },
]
