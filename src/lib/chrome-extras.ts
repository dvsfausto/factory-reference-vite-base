import { SITE } from '~/data/site'

/**
 * Optional chrome settings, set per business (Session 9, 2026-10-26, first asked by M&D; ZB-451). The factory emits each
 * one ONLY when the business set it in design_dna.chrome, so a site without them renders exactly as before.
 *   announcement { text, bg?, fg? } : a strip at the very top of every page (inside the header, so it stays pinned with it)
 *   logoHeight (32 to 96)          : the header logo's height in px, capped per header bar so it never sticks out
 *   showStreet (true)              : the street leads the place line in the footer and the contact block
 * The functions are pure over an `extras` object (default: this site's SITE) so scripts/check-chrome-extras.ts can test them.
 */
export type ChromeExtras = { announcement?: { text?: unknown; bg?: unknown; fg?: unknown }; logoHeight?: unknown; showStreet?: unknown; logoSize?: unknown; theme?: unknown }
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

/**
 * ★ THE LOGO SIZE (2026-10-29, Fausto: "the logo must be big and readable"). SITE.logoSize = 'small' | 'medium' | 'large', a
 * setting for every business. Precedence: the owner's exact SITE.logoHeight (above) wins; then SITE.logoSize; then the theme's
 * default (the Showcase theme = 'large'); else null = today's size exactly (the header renders the same markup as before).
 */
export type LogoSize = 'small' | 'medium' | 'large'
export function logoSizeOf(x: ChromeExtras = SITE_EXTRAS): LogoSize | null {
  const h = Number(x.logoHeight)
  if (x.logoHeight != null && Number.isFinite(h) && h >= 32 && h <= 96) return null // the owner's own height is used as is
  if (x.logoSize === 'small' || x.logoSize === 'medium' || x.logoSize === 'large') return x.logoSize
  if (x.theme === 'showcase') return 'large'
  return null
}
/** The three steps, per bar: 'medium' = the layout's own default; 'small' a little under it; 'large' 80px on a desktop bar and
 *  56px on a phone bar (never under the default). A large desktop logo grows its bar (see LOGO_BAR_GROWN), the phone bars hold it. */
export const LOGO_LARGE = { desktop: 80, phone: 56 } as const
/** ★ Fausto 2026-10-30 (Adrian: "logo larger at the top and the bottom"): 'large' is about a third over the layout's own size, never under
 *  LOGO_LARGE, on desktop bars (which grow to hold it); phone bars keep today's large, except the Showcase split bar, which grows itself
 *  (Header.tsx); before, a layout whose default was already large (the Showcase split bar) showed no difference at all */
export const LOGO_LARGE_SCALE = 1.3
export function sizedLogoHeight(fallback: number, place: 'desktop' | 'phone', size: LogoSize): number {
  if (size === 'small') return Math.max(28, Math.round(fallback * 0.82))
  /* phone bars never grow (the gate's rule), so the phone keeps today's large; the desktop gets the larger step */
  if (size === 'large') return place === 'phone' ? Math.max(fallback, LOGO_LARGE.phone) : Math.max(Math.round(fallback * LOGO_LARGE_SCALE), LOGO_LARGE.desktop)
  return fallback
}
/** the footer's logo follows the same setting (Fausto 2026-10-30); nothing set = the footer's own height, exactly as before */
export function footerLogoHeight(h: number, x: ChromeExtras = SITE_EXTRAS): number {
  const size = logoSizeOf(x)
  return size ? sizedLogoHeight(h, 'desktop', size) : h
}
/** the class a desktop bar takes to hold a logo needing `needPx` (12px air above and below); whole literals so the CSS scanner sees
 *  every one; '' when the bar already fits */
export function grownBarClass(barPx: number, needPx: number): string {
  if (needPx <= barPx) return ''
  if (needPx <= 104) return 'lg:h-[104px]'
  if (needPx <= 128) return 'lg:h-[128px]'
  if (needPx <= 144) return 'lg:h-[144px]'
  return 'lg:h-[160px]'
}
/** The height a desktop bar needs to hold a logo with 12px of air above and below: the bar's own height when it already fits. */
export function logoBarPx(barPx: number, logoPx: number): number {
  return Math.max(barPx, logoPx + 24)
}

/** "Jr. Andahuaylas 381, Lima" when the business turned the street on, else the line unchanged; never twice. */
export function streetFirst(line: string, site: { address?: { street?: string } } = SITE, x: ChromeExtras = SITE_EXTRAS): string {
  const street = x.showStreet === true ? (site.address?.street ?? '').trim() : ''
  if (!street) return line
  if (line.toLowerCase().includes(street.toLowerCase())) return line
  return line ? `${street}, ${line}` : street
}
