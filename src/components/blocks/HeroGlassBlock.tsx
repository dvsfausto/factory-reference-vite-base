import { useEffect, useRef } from 'react'
import { PrimaryCta } from './PrimaryCta'
import { tr } from '~/lib/i18n'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'
import { heroFocusStyle } from '~/lib/hero-focus'

import { hasPhone } from '~/lib/phone'
import { hasText } from '~/lib/has-text'
// Hero LAYOUT: 'glass', THE PHOTO SHOWS THROUGH THE WORDS (the owner, 2026-09-26): the third way to put words on a photo,
// beside 'bold-fullbleed' (the dark one) and 'background' (the light panel). A full-bleed photo kept bright, and the words on
// a see-through, softly blurred panel, so the picture shows behind them instead of being covered.
//
// LEGIBILITY OVER ANY PHOTO, BUSY OR BRIGHT OR DARK, is not left to the picture:
//   1. backdrop-blur-2xl (40 px) pulls whatever is behind the panel to one smooth mean tone: a busy beach or a lace dress
//      becomes a soft wash, so no edge competes with a letter;
//   2. a fixed light tint (bg-fam-card/55 from sm up) sits between photo and ink. Over pure black that tint yields a mid grey
//      (~#8c8c8c, luminance ≈ 0.27) under ink (luminance ≈ 0.01): a 5.3:1 contrast, above WCAG AA for body text; over white
//      it is ~21:1. Every photo lands between those two;
//   3. on a phone the panel takes most of the screen and the blur has less photo to average, so the tint is heavier there
//      (bg-fam-card/80 below sm): the words read first, the photo shows around and through the edges.
// The photo carries the site's focal point (lib/hero-focus.ts) like every other hero photo.
//
// TOKEN DISCIPLINE as HeroBackgroundBlock: bg-cta / text-cta-foreground, fam-accent(-text), fam-card, fam-ink(-muted),
// fam-hairline, rounded-* (DNA), font-display (DNA), elev-5. Never bg-brand-* / .btn-primary / .btn.
// Props identical to HeroBlock; decorativeAsset accepted for parity but unused. Returns an Element (no null).
/* ★ HOW SEE-THROUGH THE GLASS IS, SET BY THE OWNER (2026-09-29: a photographer could not see the couple behind the panel).
   Three levels, each a literal class pair so Tailwind emits them. THE FLOOR FOLLOWS THE PHOTO, not a fixed number: measured on
   her own bright beach photo the lightest tint (25%) still reads at 6.2:1, while over a photo that averages to black behind
   the blur only the standard tint reads (4.9:1; lighter falls to 3.0:1, lightest to 1.7:1). So the owner's chosen level is the
   wish (SSR renders it, data-glass-level), and once the photo has loaded the panel measures the tone behind itself and keeps
   the lightest of the owner's level or heavier that still gives body text 4.5:1 (data-glass-applied). It only ever gets
   heavier than asked, never lighter, so nothing flashes and a page without JavaScript shows the asked level. On a phone the
   panel covers most of the screen and the blur has less photo to average, so each level keeps a heavier tint there. Set by
   asking ("make it lighter", "more transparent"); absent → standard, byte-identical to before. */
export const GLASS_LEVELS = {
  standard: 'bg-fam-card/80 sm:bg-fam-card/55',
  lighter: 'bg-fam-card/65 sm:bg-fam-card/40',
  lightest: 'bg-fam-card/50 sm:bg-fam-card/25',
} as const
export type GlassLevel = keyof typeof GLASS_LEVELS
export function glassLevelOf(site: { hero?: { glass_level?: unknown } }): GlassLevel {
  const v = site?.hero?.glass_level
  return typeof v === 'string' && v in GLASS_LEVELS ? (v as GlassLevel) : 'standard'
}
/** the white tint each level mixes over the blurred photo: [phone, wide] */
export const GLASS_ALPHA: Record<GlassLevel, [number, number]> = { standard: [0.8, 0.55], lighter: [0.65, 0.4], lightest: [0.5, 0.25] }
const ORDER: GlassLevel[] = ['standard', 'lighter', 'lightest']
const srgb = (c: number) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }
const luminance = (rgb: [number, number, number]) => 0.2126 * srgb(rgb[0]) + 0.7152 * srgb(rgb[1]) + 0.0722 * srgb(rgb[2])
/** the lightest level, from the asked one downward, whose panel keeps body text at 4.5:1 over this photo tone; pure */
export function legibleGlassLevel(asked: GlassLevel, photoMean: [number, number, number], ink: [number, number, number], wide: boolean): GlassLevel {
  const inkL = luminance(ink)
  for (let i = ORDER.indexOf(asked); i >= 0; i--) {
    const level = ORDER[i]!
    const a = GLASS_ALPHA[level][wide ? 1 : 0]
    const panel: [number, number, number] = [a * 255 + (1 - a) * photoMean[0], a * 255 + (1 - a) * photoMean[1], a * 255 + (1 - a) * photoMean[2]]
    const L = luminance(panel)
    const contrast = (Math.max(L, inkL) + 0.05) / (Math.min(L, inkL) + 0.05)
    if (contrast >= 4.5) return level
  }
  return 'standard'
}
/** the mean tone of the photo behind the panel: the panel's own box, mapped onto the image as object-cover draws it */
function photoToneBehind(img: HTMLImageElement, panel: HTMLElement): [number, number, number] | null {
  try {
    const ir = img.getBoundingClientRect(); const pr = panel.getBoundingClientRect()
    if (!img.naturalWidth || !ir.width || !pr.width) return null
    const scale = Math.max(ir.width / img.naturalWidth, ir.height / img.naturalHeight)
    const dw = img.naturalWidth * scale; const dh = img.naturalHeight * scale
    const ox = (ir.width - dw) / 2; const oy = (ir.height - dh) / 2
    const sx = Math.max(0, (pr.left - ir.left - ox) / scale); const sy = Math.max(0, (pr.top - ir.top - oy) / scale)
    const sw = Math.min(img.naturalWidth - sx, pr.width / scale); const sh = Math.min(img.naturalHeight - sy, pr.height / scale)
    const c = document.createElement('canvas'); c.width = 24; c.height = 16
    const ctx = c.getContext('2d'); if (!ctx) return null
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, 24, 16)
    const d = ctx.getImageData(0, 0, 24, 16).data
    let r = 0, g = 0, b = 0; const n = d.length / 4
    for (let i = 0; i < d.length; i += 4) { r += d[i]!; g += d[i + 1]!; b += d[i + 2]! }
    return [r / n, g / n, b / n]
  } catch { return null /* a photo the canvas may not read (cross-origin without CORS): the asked level stands */ }
}
function useLegibleGlass(asked: GlassLevel) {
  const panelRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const panel = panelRef.current; if (!panel) return
    const section = panel.closest('section'); const img = section?.querySelector<HTMLImageElement>('img[data-hero-photo]')
    if (!img) return
    const apply = () => {
      const tone = photoToneBehind(img, panel); if (!tone) return
      const h1 = panel.querySelector('h1'); const inkCss = h1 ? getComputedStyle(h1).color : ''
      const m = inkCss.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
      const ink: [number, number, number] = m ? [Number(m[1]), Number(m[2]), Number(m[3])] : [28, 26, 24]
      const level = legibleGlassLevel(asked, tone, ink, window.innerWidth >= 640)
      panel.setAttribute('data-glass-applied', level)
      if (level !== asked) { panel.classList.remove(...GLASS_LEVELS[asked].split(' ')); panel.classList.add(...GLASS_LEVELS[level].split(' ')) }
    }
    if (img.complete && img.naturalWidth) apply(); else img.addEventListener('load', apply, { once: true })
  }, [asked])
  return panelRef
}
export function HeroGlassBlock({
  site = SITE,
  trustItems = [tr('trust.freeEstimates'), tr('trust.onSchedule'), tr('trust.localTeam'), tr('trust.satisfactionGuaranteed')],
}: {
  site?: typeof SITE
  trustItems?: string[]
  decorativeAsset?: string
}) {
  const panelRef = useLegibleGlass(glassLevelOf(site))
  return (
    <section className="relative isolate flex min-h-[34rem] flex-col overflow-hidden bg-fam-panel md:min-h-[40rem]">
      <img
        src={imageSrc(site.hero.image_url)}
        alt={HERO_ALT}
        className="absolute inset-0 -z-20 h-full w-full object-cover" data-hero-photo="" style={heroFocusStyle(site)} />

      <div className="container-x relative flex flex-1 items-end py-section">
        <div
          data-enter="up"
          ref={panelRef}
          data-hero-panel="glass"
          data-glass-level={glassLevelOf(site)}
          className={`max-w-2xl rounded-3xl border border-fam-card/70 ${GLASS_LEVELS[glassLevelOf(site)]} p-7 elev-5 backdrop-blur-2xl backdrop-saturate-150 sm:p-9`}
        >
          {hasText(site.hero.kicker) && (
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-fam-accent-text">
              <span className="h-px w-7 bg-fam-accent" />
              {site.hero.kicker}
            </span>
          )}

          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-fam-ink sm:text-5xl lg:text-6xl">
            {site.hero.headline}
          </h1>

          {hasText(site.hero.subheadline) && (
            <p className="mt-4 text-xl leading-relaxed text-fam-ink">
              {site.hero.subheadline}
            </p>
          )}

          {hasText(site.hero.body) && (
            <p className="mt-3 max-w-xl text-lg leading-relaxed text-fam-ink-muted">
              {site.hero.body}
            </p>
          )}

          <div className="mt-7 flex flex-wrap gap-4">
            <PrimaryCta
              className="inline-flex h-[52px] items-center gap-2 rounded-xl bg-cta px-7 font-display text-base font-semibold text-cta-foreground transition-[filter] hover:brightness-(--hov-shade)"
            >
              {site.hero.cta_primary_label} <ArrowRight className="h-4 w-4" />
            </PrimaryCta>
            {hasPhone(site.phone) && (<a
              href={`tel:${site.phone}`}
              className="inline-flex h-[52px] items-center gap-2 rounded-xl border border-fam-hairline px-6 font-display font-semibold text-fam-ink transition-colors hover:border-fam-accent"
            >
              <Phone className="h-4 w-4 text-fam-accent-text" /> {site.phoneDisplay}
            </a>)}
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-fam-ink-muted">
            {trustItems.map((t) => (
              <span key={t} className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-fam-accent" /> {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
