import { SITE } from '~/data/site'

/**
 * ★ COMING-SOON MODE (Fausto 2026-10-30, a Website setting for every business, off by default). The factory emits
 * SITE.comingSoon = true only when the owner's design_dna.chrome.comingSoon is true; absent on every other site, so
 * nothing below changes a page. While on: no header, footer or floating bars; the home page shows only the logo, the
 * hero and the form; every other page except /privacy answers a temporary redirect to '/'; /privacy carries noindex.
 * Optional copy: SITE.comingSoonCopy { title, text } (the owner's content keys), else the site-language default.
 */
export const COMING_SOON = (SITE as { comingSoon?: boolean }).comingSoon === true

/** the only paths a visitor can open while the mode is on */
export function comingSoonAllows(pathname: string): boolean {
  const p = pathname.replace(/\/+$/, '') || '/'
  return p === '/' || p === '/privacy'
}

export function comingSoonCopy(): { title?: string; text?: string } {
  const c = (SITE as { comingSoonCopy?: { title?: unknown; text?: unknown } }).comingSoonCopy
  const s = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : undefined)
  return { title: s(c?.title), text: s(c?.text) }
}
