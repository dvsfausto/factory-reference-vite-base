import type { BlockType } from './layout'

// Per-page composition for /services (Arc 3 · Stage B), mirroring about-layout.ts.
// The services-index route maps over this array via the shared renderer. Adds an
// 'intro' block (the shared WOW page-intro) and a page-specific 'servicesIndex' block
// that renders the FULL services list (ALL services) — NOT the homepage's 3-item
// preview, so no content is dropped. ADDITIVE: the scaffolder never emits or
// overwrites it.
export type ServicesIndexBlockType = BlockType | 'intro' | 'servicesIndex'

export interface ServicesIndexBlock {
  type: ServicesIndexBlockType
  variant?: string
  params?: Record<string, unknown>
}

export const SERVICES_INDEX_LAYOUT: ServicesIndexBlock[] = [
  { type: 'intro' },
  { type: 'servicesIndex' },
  { type: 'cta', variant: 'aurora-glow', params: { title: 'Need a quote?' } },
]
