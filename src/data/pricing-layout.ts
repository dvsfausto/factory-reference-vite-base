import type { BlockType } from './layout'

// Per-page composition for /pricing — the inner-page analogue of HOMEPAGE_LAYOUT,
// mirroring src/data/about-layout.ts. The pricing route maps over this array
// instead of hardcoding its sections, so the page's structure is a data dial
// (reorder / add / remove a section with no component edit), reusing the existing
// section library.
//
// PricingBlock reuses the homepage BlockType vocabulary (so it can compose any
// existing section) and adds an 'intro' block specific to this page. This file is
// ADDITIVE — the scaffolder never emits or overwrites it (it only emits
// src/data/layout.ts's HOMEPAGE_LAYOUT array) — so block-composing the pricing
// page needs no scaffolder change.
export type PricingBlockType = BlockType | 'intro'

export interface PricingBlock {
  type: PricingBlockType
  variant?: string
  params?: Record<string, unknown>
}

export const PRICING_LAYOUT: PricingBlock[] = [
  { type: 'intro' },
  { type: 'pricing', variant: 'luxe-glass' },
  { type: 'trustBar', variant: 'glow-cards' },
  { type: 'faq', variant: 'glass-accordion' },
  { type: 'cta', variant: 'aurora-glow' },
]
