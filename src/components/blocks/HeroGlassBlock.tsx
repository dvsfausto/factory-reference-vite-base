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
export function HeroGlassBlock({
  site = SITE,
  trustItems = [tr('trust.freeEstimates'), tr('trust.onSchedule'), tr('trust.localTeam'), tr('trust.satisfactionGuaranteed')],
}: {
  site?: typeof SITE
  trustItems?: string[]
  decorativeAsset?: string
}) {
  return (
    <section className="relative isolate flex min-h-[34rem] flex-col overflow-hidden bg-fam-panel md:min-h-[40rem]">
      <img
        src={imageSrc(site.hero.image_url)}
        alt={HERO_ALT}
        className="absolute inset-0 -z-20 h-full w-full object-cover" data-hero-photo="" style={heroFocusStyle(site)} />

      <div className="container-x relative flex flex-1 items-end py-section">
        <div
          data-enter="up"
          data-hero-panel="glass"
          className="max-w-2xl rounded-3xl border border-fam-card/70 bg-fam-card/80 p-7 elev-5 backdrop-blur-2xl backdrop-saturate-150 sm:bg-fam-card/55 sm:p-9"
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
