import type { BlockType } from './layout'

// Per-page composition for /contact (Arc 3 · Stage B), mirroring about-layout.ts.
// The contact route maps over this array via the shared renderer. Adds an 'intro'
// block (the shared WOW page-intro) and a page-specific 'contactForm' block that
// renders the EXACT LeadForm (untouched fields + frozen Supabase envelope handler)
// beside a brand-surfaced info card of the REAL contact details, each row omitting
// when empty. ADDITIVE: the scaffolder never emits or overwrites it.
export type ContactBlockType = BlockType | 'intro' | 'contactForm'

export interface ContactBlock {
  /**
   * C1a — stable block-instance identity. The factory emits it (persisted id, else `<type>` /
   * `<type>-N` by ordinal) so the editor addresses a section by instance, not by type. Inert at
   * render time; absent on carried (un-emitted) layouts.
   */
  id?: string
  type: ContactBlockType
  variant?: string
  params?: Record<string, unknown>
}

export const CONTACT_LAYOUT: ContactBlock[] = [
  { type: 'intro' },
  { type: 'contactForm' },
]
