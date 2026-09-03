import type { BlockType } from './layout'
import { familyOr } from '~/lib/family-variant'

// Per-page composition for /services (Arc 3 · Stage B), mirroring about-layout.ts.
// The services-index route maps over this array via the shared renderer. Adds an
// 'intro' block (the shared WOW page-intro) and a page-specific 'servicesIndex' block
// that renders the FULL services list (ALL services) — NOT the homepage's 3-item
// preview, so no content is dropped. ADDITIVE: the scaffolder never emits or
// overwrites it.
export type ServicesIndexBlockType = BlockType | 'intro' | 'servicesIndex'

export interface ServicesIndexBlock {
  /**
   * C1a — stable block-instance identity. The factory emits it (persisted id, else `<type>` /
   * `<type>-N` by ordinal) so the editor addresses a section by instance, not by type. Inert at
   * render time; absent on carried (un-emitted) layouts.
   */
  id?: string
  type: ServicesIndexBlockType
  variant?: string
  params?: Record<string, unknown>
}

export const SERVICES_INDEX_LAYOUT: ServicesIndexBlock[] = [
  { type: 'intro' },
  { type: 'servicesIndex' },
  { type: 'cta', variant: familyOr('aurora-glow'), params: { title: 'Need a quote?' } },
]
