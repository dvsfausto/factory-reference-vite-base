import { PrimaryCta } from './PrimaryCta'
import { tr } from '~/lib/i18n'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { heroImageSrc, heroImageSrcSet } from '~/lib/asset-url'
import { heroFocusStyle } from '~/lib/hero-focus'
import { hasPhone } from '~/lib/phone'
import { hasText } from '~/lib/has-text'

// Hero LAYOUT: 'editorial-portrait' (ZB-154, Fausto's pick for Uplift Your Career, 2026-10-12). A person, not a place: the
// headline runs large across the top on a warm ground; beneath it the words and the call to action on the left, and the
// owner's portrait in a tall rounded frame on the right with a brand-tinted slab set behind it; the trust points sit on
// hairlines. No dark panel, nothing over the photo, the focal point (lib/hero-focus.ts) keeps the face whole at every width.
// On a phone: the headline, then the portrait, then the words. Chosen per business (layout.homepageOrder hero variant);
// every other business keeps its own hero.
//
// TOKEN DISCIPLINE: primary CTA -> bg-cta / text-cta-foreground (BRAND-owned). Accent -> fam-accent (rule, slab tint),
// fam-accent-text (kicker). Ground -> fam-surface-2, ink -> fam-ink / fam-ink-muted, hairline -> fam-hairline.
// Font -> font-display (DNA). Never bg-brand-* / .btn.
//
// HONESTY: renders only the site's own words and trust items; the kicker, the subheadline paragraphs and the body each go
// with their element when cleared (hasText guards). Props identical to HeroBlock; decorativeAsset accepted, unused.
const paragraphs = (t: string) => t.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)

export function HeroEditorialPortraitBlock({
  site = SITE,
  trustItems = [tr('trust.freeEstimates'), tr('trust.onSchedule'), tr('trust.localTeam'), tr('trust.satisfactionGuaranteed')],
}: {
  site?: typeof SITE
  trustItems?: string[]
  decorativeAsset?: string
}) {
  return (
    <section className="bg-fam-surface-2">
      <div className="container-x py-12 lg:py-20">
        {hasText(site.hero.kicker) && (
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-fam-accent-text">
            <span className="h-px w-7 bg-fam-accent" />
            {site.hero.kicker}
          </span>
        )}
        <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[1.02] tracking-tight text-fam-ink sm:text-6xl lg:text-7xl">
          {site.hero.headline}
        </h1>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-16">
          {/* The portrait: first on a phone after the headline, the right five twelfths from lg. */}
          <div className="relative order-1 mx-auto w-full max-w-md lg:order-2 lg:col-span-5 lg:max-w-none">
            <div aria-hidden className="absolute -right-4 -top-4 h-full w-full rounded-[2rem] bg-fam-accent/20 lg:-right-6 lg:-top-6" />
            <div className="relative overflow-hidden rounded-[2rem] border border-fam-hairline elev-3">
              <img
                src={heroImageSrc(site.hero.image_url)}
                srcSet={heroImageSrcSet(site.hero.image_url)}
                sizes="(min-width: 1024px) 40vw, 100vw"
                alt={HERO_ALT}
                className="aspect-[4/5] w-full object-cover" data-hero-photo="" style={heroFocusStyle(site)} />
            </div>
          </div>

          <div className="order-2 lg:order-1 lg:col-span-7 lg:pt-2">
            {hasText(site.hero.subheadline) && paragraphs(site.hero.subheadline).map((p, i) => (
              <p key={i} className={`${i === 0 ? 'text-xl text-fam-ink' : 'mt-4 text-lg text-fam-ink-muted'} max-w-2xl leading-relaxed`}>{p}</p>
            ))}
            {hasText(site.hero.body) && (
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fam-ink-muted">{site.hero.body}</p>
            )}

            <div className="mt-8 flex flex-wrap gap-4">
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

            {trustItems.length > 0 && (
              <ul className="mt-10 grid grid-cols-1 divide-y divide-fam-hairline border-y border-fam-hairline sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {trustItems.map((t) => (
                  <li key={t} className="py-4 font-display text-base font-semibold text-fam-ink sm:px-5 sm:first:pl-0">{t}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
