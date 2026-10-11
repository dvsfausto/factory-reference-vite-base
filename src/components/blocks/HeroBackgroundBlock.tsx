import { PrimaryCta } from './PrimaryCta'
import { tr } from '~/lib/i18n'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { heroImageSrc, heroImageSrcSet } from '~/lib/asset-url'
import { heroFocusStyle } from '~/lib/hero-focus'

import { hasPhone } from '~/lib/phone'
import { hasText } from '~/lib/has-text'
// Hero LAYOUT: 'background', THE PHOTOGRAPH IS THE PAGE (the owner, 2026-09-25, for photographers, restaurants and venues):
// a full-bleed photo kept BRIGHT, and the headline, sub, CTAs and trust row on a light panel. The earlier version laid two
// dark gradient scrims over the whole photo; it was readable but it dimmed every picture to dusk, which is the opposite of
// what an owner who chose this layout wants. Nothing darkens the photo.
//
// ★ THE PANEL NEVER COVERS THE PICTURE (ZB-154, 2026-10-11). The panel used to float over the photo, bottom-left: on a
// phone and a tablet it covered almost all of it, and on a laptop it sat over the left half, so a portrait with the
// subject on that side lost its face (Uplift Your Career: "you cannot see her face"). Now the photo and the panel share
// the section and never overlap: on a phone the photo comes first (4:5, the focal point kept), the panel follows; on a
// tablet the photo is 16:10 above the panel; from lg the photo fills the right seven twelfths to the viewport edge and
// the panel sits in the left five, both full height. The focal point (lib/hero-focus.ts) decides the crop at every width.
//
// LEGIBILITY OVER ANY PICTURE, LIGHT OR DARK: the words sit on a near-opaque light panel (bg-fam-card/92, a hairline),
// ink text on a light surface, the same contrast every light-surface hero has.
//
// TOKEN DISCIPLINE: primary CTA -> bg-cta / text-cta-foreground (BRAND-owned). Accent -> fam-accent-text (kicker), fam-accent
// (rule + dots). Surface -> fam-card, ink -> fam-ink / fam-ink-muted, hairline -> fam-hairline. Radius -> rounded-* (DNA).
// Font -> font-display (DNA). Never bg-brand-* / .btn-primary / .btn.
//
// Props identical to HeroBlock; decorativeAsset accepted for parity but unused. Returns an Element (no null).
export function HeroBackgroundBlock({
  site = SITE,
  trustItems = [tr('trust.freeEstimates'), tr('trust.onSchedule'), tr('trust.localTeam'), tr('trust.satisfactionGuaranteed')],
}: {
  site?: typeof SITE
  trustItems?: string[]
  decorativeAsset?: string
}) {
  return (
    <section className="relative isolate overflow-hidden bg-fam-panel">
      <div className="lg:grid lg:min-h-[40rem] lg:grid-cols-12">
        {/* The photo: first on a phone and a tablet, the right seven twelfths from lg, never under the words. */}
        <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:order-2 lg:col-span-7 lg:aspect-auto lg:min-h-[40rem]">
          <img
            src={heroImageSrc(site.hero.image_url)}
            srcSet={heroImageSrcSet(site.hero.image_url)}
            sizes="(min-width: 1024px) 58vw, 100vw"
            alt={HERO_ALT}
            className="absolute inset-0 h-full w-full object-cover" data-hero-photo="" style={heroFocusStyle(site)} />
        </div>

        {/* The words: below the photo until lg, beside it from lg, aligned to the page's left gutter. */}
        <div className="relative px-5 py-10 sm:px-8 sm:py-12 lg:order-1 lg:col-span-5 lg:flex lg:items-center lg:py-16 lg:pl-[max(1.5rem,calc((100vw-1200px)/2+1.5rem))] lg:pr-10">
          <div
            data-enter="up"
            data-hero-panel=""
            className="w-full max-w-2xl rounded-3xl border border-fam-hairline bg-fam-card/92 p-7 elev-5 sm:p-9"
          >
            {hasText(site.hero.kicker) && (
              <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-fam-accent-text">
                <span className="h-px w-7 bg-fam-accent" />
                {site.hero.kicker}
              </span>
            )}

            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-fam-ink sm:text-5xl lg:text-[3.25rem]">
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
      </div>
    </section>
  )
}
