import { SITE } from '~/data/site'

/**
 * ★ THE EDITORIAL THEME (ZB-147 W1.1, 2026-10-06). A selectable look any business can choose (the owner's setting
 * `site.theme = 'editorial'`, emitted by the factory as `SITE.theme`): cream and beige bands, a charcoal-green statement
 * band, a near-black close, gold italic accent lines in the headings, uppercase tracked kickers, square buttons with an
 * arrow. It is a PALETTE and a set of section VARIANTS: the tokens live in app.css under html[data-site-theme="editorial"],
 * the variants are ordinary entries in the *_VARIANTS maps (editor-swappable one by one), and the header/footer carry an
 * 'editorial' theme. A site without the setting has no `theme` key and renders exactly as before.
 */
export const SITE_THEME: string = typeof (SITE as { theme?: unknown }).theme === 'string' ? ((SITE as { theme?: string }).theme as string) : ''
export const isEditorial = (): boolean => SITE_THEME === 'editorial'

/** The arrow every Editorial button and link carries (U+2197). One glyph, one place. */
export const ARROW = '↗'

/**
 * A heading written as "first line. / second line." splits into a roman first line and an italic accent second line,
 * the way the Editorial look sets every heading. Owner copy is never changed: the split only happens at the first
 * sentence end when there is a second sentence; otherwise the whole heading is the first line.
 */
export function splitHeading(text: string): { first: string; second: string } {
  const t = (text ?? '').trim()
  const m = t.match(/^(.+?[.!?])\s+(\S.*)$/s)
  if (!m) return { first: t, second: '' }
  return { first: m[1].trim(), second: m[2].trim() }
}
