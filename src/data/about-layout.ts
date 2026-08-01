import type { BlockType } from './layout'

// Per-page composition for /about — the inner-page analogue of HOMEPAGE_LAYOUT.
// The about route maps over this array instead of hardcoding its sections, so the
// page's structure is a data dial (reorder / add / remove a section with no
// component edit), reusing the existing section library + the new team block.
//
// AboutBlock reuses the homepage BlockType vocabulary (so it can compose any
// existing section + 'team') and adds an 'intro' block specific to this page. This
// file is ADDITIVE — the scaffolder never emits or overwrites it (it only emits
// src/data/layout.ts's HOMEPAGE_LAYOUT array) — so block-composing the about page
// needs no scaffolder change.
export type AboutBlockType = BlockType | 'intro'

export interface AboutBlock {
  type: AboutBlockType
  variant?: string
  params?: Record<string, unknown>
}

export const ABOUT_LAYOUT: AboutBlock[] = [
  { type: 'intro' },
  { type: 'team', variant: 'grid' },
  { type: 'trustBar', variant: 'glow-cards' },
  { type: 'cta', variant: 'aurora-glow' },
]
