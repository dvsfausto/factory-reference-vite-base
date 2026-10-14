import type { CSSProperties } from 'react'

// ★ THE INVERSE TONE (2026-10-14): a section painted in the site's own pair the other way round, the text colour as its
// ground and the page ground as its text. On a dark site that is a light band, on a light site a dark one, so a layout
// that alternates bands needs no colour of its own. Every value derives from the family tokens; nothing is a literal.
export const INVERSE_GROUND: CSSProperties = { backgroundColor: 'var(--color-fam-ink)', color: 'var(--color-fam-page)' }
/** body text on the inverse ground: the page ground mixed a little towards the ground (about 7:1 on a cream band) */
export const INVERSE_MUTED: CSSProperties = { color: 'color-mix(in oklab, var(--color-fam-page) 74%, var(--color-fam-ink))' }
/** a card lifted off the inverse ground */
export const INVERSE_CARD: CSSProperties = { backgroundColor: 'color-mix(in oklab, var(--color-fam-page) 7%, var(--color-fam-ink))' }
/** a rule on the inverse ground */
export const INVERSE_LINE = 'color-mix(in oklab, var(--color-fam-page) 30%, var(--color-fam-ink))'
