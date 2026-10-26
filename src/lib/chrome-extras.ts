import { SITE } from '~/data/site'

/**
 * Optional chrome settings, set per business (Session 9, 2026-10-26, first asked by M&D; ZB-451). The factory emits each
 * one ONLY when the business set it in design_dna.chrome, so a site without them renders exactly as before.
 *   announcement { text, bg?, fg? } : a strip at the very top of every page (inside the header, so it stays pinned with it)
 *   logoHeight (32 to 96)          : the header logo's height in px, every header layout, phone and desktop
 *   showStreet (true)              : the street leads the place line in the footer and the contact block
 */
type Extras = { announcement?: { text?: unknown; bg?: unknown; fg?: unknown }; logoHeight?: unknown; showStreet?: unknown }
const x = SITE as unknown as Extras
const HEX = /^#[0-9a-fA-F]{6}$/
const hex = (v: unknown): string | undefined => (typeof v === 'string' && HEX.test(v) ? v : undefined)

const annText = typeof x.announcement?.text === 'string' ? x.announcement.text.trim() : ''
export const ANNOUNCEMENT: { text: string; bg?: string; fg?: string } | null = annText
  ? { text: annText, bg: hex(x.announcement?.bg), fg: hex(x.announcement?.fg) }
  : null

/** The header logo height: the business's own setting, else the layout's default. */
export function logoHeight(fallback: number): number {
  const h = Number(x.logoHeight)
  return Number.isFinite(h) && h >= 32 && h <= 96 ? Math.round(h) : fallback
}

/** "Jr. Andahuaylas 381, Lima" when the business turned the street on, else the line unchanged. */
export function streetFirst(line: string, site: { address?: { street?: string } } = SITE): string {
  const street = x.showStreet === true ? (site.address?.street ?? '').trim() : ''
  if (!street) return line
  return line ? `${street}, ${line}` : street
}
