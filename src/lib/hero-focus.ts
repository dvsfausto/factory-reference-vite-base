// ★ THE HERO PHOTO KEEPS WHAT MATTERS (the owner, 2026-09-25: a photographer's hero with a head cut off is worse than no photo).
// Every hero variant draws the photo with object-fit: cover into a fixed box, and until today the crop was always the centre
// (object-position 50% 50%), so a portrait photo in a landscape box lost a quarter of its height at the top AND the bottom.
//
// Two rules now decide the crop:
//   1. an explicit focal point on the site data (SITE.hero.image_focus, "x% y%"), set by the owner by asking
//      ("show more of the top", "centre it lower") through the editor; it wins, and it survives rebuilds;
//   2. with no explicit point, a PORTRAIT photo is anchored towards its top (50% 22%) once it has loaded
//      (hero-focus-runtime.ts), because heads live in the upper part of a portrait; landscape photos keep the centre.
import type { CSSProperties } from 'react'

const FOCUS_RE = /^\s*(\d{1,3})%\s+(\d{1,3})%\s*$/

/** "50% 25%" → "50% 25%", anything else → null (the runtime rule then decides) */
// the site's hero type is the scaffolded literal (no image_focus on most sites), so the read is deliberately loose
export function heroFocus(site: { hero?: object | null } | null | undefined): string | null {
  const raw = (site?.hero as { image_focus?: unknown } | null | undefined)?.image_focus
  if (typeof raw !== 'string') return null
  const m = FOCUS_RE.exec(raw)
  if (!m) return null
  const clamp = (n: string) => Math.max(0, Math.min(100, Number(n)))
  return `${clamp(m[1])}% ${clamp(m[2])}%`
}

/** the inline style for a hero <img>: the explicit focal point when the site carries one, nothing otherwise */
export function heroFocusStyle(site: Parameters<typeof heroFocus>[0]): CSSProperties | undefined {
  const f = heroFocus(site)
  return f ? { objectPosition: f } : undefined
}

/** the object-position a portrait photo gets when the owner has set nothing */
export const PORTRAIT_DEFAULT_FOCUS = '50% 22%'
