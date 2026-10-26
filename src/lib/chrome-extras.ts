import { SITE } from '~/data/site'

/**
 * Optional chrome settings, set per business (Session 9, 2026-10-26, first asked by M&D; ZB-451). The factory emits each
 * one ONLY when the business set it in design_dna.chrome, so a site without them renders exactly as before.
 *   announcement { text, bg?, fg? } : a strip at the very top of every page (inside the header, so it stays pinned with it)
 *   logoHeight (32 to 96)          : the header logo's height in px, capped per header bar so it never sticks out
 *   showStreet (true)              : the street leads the place line in the footer and the contact block
 * The functions are pure over an `extras` object (default: this site's SITE) so scripts/check-chrome-extras.ts can test them.
 */
export type ChromeExtras = { announcement?: { text?: unknown; bg?: unknown; fg?: unknown }; logoHeight?: unknown; showStreet?: unknown }
const SITE_EXTRAS = SITE as unknown as ChromeExtras
const HEX = /^#[0-9a-fA-F]{6}$/
const hex = (v: unknown): string | undefined => (typeof v === 'string' && HEX.test(v) ? v : undefined)

/** Relative luminance of #rrggbb (WCAG). */
function luminance(h: string): number {
  const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4))
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}
/** White or near-black, whichever reads better on the ground. */
export function textOn(bg: string): string {
  const l = luminance(bg)
  return (1.05 / (l + 0.05)) >= ((l + 0.05) / (0.00516 + 0.05)) ? '#ffffff' : '#111111'
}

export function announcementOf(x: ChromeExtras = SITE_EXTRAS): { text: string; bg?: string; fg?: string } | null {
  const text = typeof x.announcement?.text === 'string' ? x.announcement.text.trim() : ''
  if (!text) return null
  const bg = hex(x.announcement?.bg)
  if (!bg) return { text }
  return { text, bg, fg: hex(x.announcement?.fg) ?? textOn(bg) }
}
export const ANNOUNCEMENT = announcementOf()

/** The header logo height: the business's own setting capped to fit its bar (24px of air, room for a plate), else the layout's default. */
export function logoHeight(fallback: number, barPx: number, x: ChromeExtras = SITE_EXTRAS): number {
  const h = Number(x.logoHeight)
  if (x.logoHeight == null || !Number.isFinite(h) || h < 32 || h > 96) return fallback
  return Math.min(Math.round(h), barPx - 24)
}

/** "Jr. Andahuaylas 381, Lima" when the business turned the street on, else the line unchanged; never twice. */
export function streetFirst(line: string, site: { address?: { street?: string } } = SITE, x: ChromeExtras = SITE_EXTRAS): string {
  const street = x.showStreet === true ? (site.address?.street ?? '').trim() : ''
  if (!street) return line
  if (line.toLowerCase().includes(street.toLowerCase())) return line
  return line ? `${street}, ${line}` : street
}
