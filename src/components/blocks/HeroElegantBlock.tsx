import { PrimaryCta } from './PrimaryCta'
import { tr } from '~/lib/i18n'
import { motion } from 'framer-motion'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'

import { hasPhone } from '~/lib/phone'
// Hero VARIANT: 'elegant'. Two compositions by surface mode (the scrim-over-photo
// dark hero can't simply go light, light needs its own layout):
//   · DARK (opt-in, design_dna.surface='dark'), a full-bleed photo under a warm
//     espresso scrim with light text. This branch is the ORIGINAL elegant hero
//     verbatim, so a dark build (e.g. the cigar lounge) renders byte-identical.
//   · LIGHT (default), a refined warm-ivory split: serif headline + a framed
//     rounded image card. Airy and bright, never dark espresso.
//
// TOKEN DISCIPLINE: primary CTA → bg-primary / text-primary-foreground (brand-
// owned). Accent → fam-accent-* (DNA). Radius → rounded-* (DNA). Font → font-display
// (DNA serif). Surface neutrals component-owned per mode. No bg-brand-*/.btn-
// primary/.btn. Returns an Element (no null).
//
// CONTENT is PROPS with SITE fallback (F.inner): homepage passes no content props
// → defaults to SITE.hero.* (byte-identical). Inner pages pass PER-PAGE content.
// SITE.phone/phoneDisplay stay site-level.
export function HeroElegantBlock({
  site = SITE,
  trustItems = [tr('trust.freeEstimates'), tr('trust.onSchedule'), tr('trust.localTeam'), tr('trust.satisfactionGuaranteed')],
  headline = site.hero.headline,
  body = site.hero.body,
  imageUrl = site.hero.image_url,
  kicker = site.hero.kicker,
  subheadline = site.hero.subheadline,
  ctaLabel = site.hero.cta_primary_label,
}: {
  site?: typeof SITE
  trustItems?: string[]
  decorativeAsset?: string
  headline?: string
  body?: string
  imageUrl?: string
  kicker?: string
  subheadline?: string
  ctaLabel?: string
}) {
  const dark = (site as { surface?: string }).surface === 'dark'

  if (dark) {
    return (
      <section className="relative isolate flex flex-col overflow-hidden bg-[#1A1410] text-[#F2E8DC]">
        {/* Full-bleed lounge photo under a warm espresso scrim, low-light, intimate. */}
        <img
          src={imageSrc(imageUrl)}
          alt={HERO_ALT}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#1A1410] via-[#1A1410]/92 to-[#1A1410]/55" />

        <div className="container-x relative flex flex-1 items-center py-section">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-fam-accent-text">
              <span className="h-px w-8 bg-fam-accent" />
              {kicker}
            </span>

            {/* Refined serif headline, title-case, generous, unhurried. */}
            <h1 className="mt-6 font-display text-5xl font-medium leading-[1.05] tracking-tight text-[#F2E8DC] sm:text-6xl lg:text-7xl">
              {headline}
            </h1>

            {subheadline && (
              <p className="mt-5 font-display text-2xl italic leading-snug text-fam-accent-on-dark">
                {subheadline}
              </p>
            )}

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#B8A893]">
              {body}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <PrimaryCta
                className="inline-flex h-[54px] items-center gap-2 rounded-lg bg-primary px-8 font-display text-base font-medium tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
              >
                {ctaLabel} <ArrowRight className="h-4 w-4" />
              </PrimaryCta>
              {hasPhone(site.phone) && (<a
                href={`tel:${site.phone}`}
                className="inline-flex h-[54px] items-center gap-2 rounded-lg border border-fam-accent/60 px-7 font-medium text-[#F2E8DC] transition-colors hover:border-fam-accent hover:bg-fam-accent/10"
              >
                <Phone className="h-4 w-4" /> {site.phoneDisplay}
              </a>)}
            </div>

            {/* Refined trust row, a thin amber-ruled line, not a loud banner. */}
            <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[#3A2E24] pt-6 text-xs uppercase tracking-[0.18em] text-[#B8A893]">
              {trustItems.map((t) => (
                <span key={t} className="inline-flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-fam-accent" /> {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  // LIGHT (default), EDITORIAL. Deliberately NOT the copy-left / image-right split every other family
  // uses: a magazine masthead rule, an oversized full-width serif headline, an ASYMMETRIC offset lede + CTA
  // on a 12-column grid, then a wide cinematic image BAND beneath (not beside), a vertical editorial flow
  // with generous air. This is the elegant family's composition + rhythm, echoed in its services/reviews.
  const metaLine = [site.address.city, site.address.state].filter(Boolean).join(', ')
  return (
    <section className="bg-fam-surface text-fam-ink">
      <div className="container-x py-section">
        {/* Masthead: eyebrow left, place/phone right, over a hairline. */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-end justify-between gap-4 border-b border-fam-hairline pb-6"
        >
          <span className="text-xs font-medium uppercase tracking-[0.32em] text-fam-accent-text">{kicker}</span>
          {(metaLine || site.phoneDisplay) && (
            <span className="text-xs uppercase tracking-[0.22em] text-[#9A8E7C]">
              {[metaLine, site.phoneDisplay].filter(Boolean).join('  ·  ')}
            </span>
          )}
        </motion.div>

        {/* Oversized headline, full width, generous leading. */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-10 max-w-5xl font-display text-[2.75rem] font-medium leading-[1.03] tracking-tight sm:text-6xl md:text-7xl"
        >
          {headline}
        </motion.h1>

        {/* Asymmetric lede + CTA, the standfirst offset from the actions. */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {subheadline && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="font-display text-2xl italic leading-snug text-fam-accent-text lg:col-span-6"
            >
              {subheadline}
            </motion.p>
          )}
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="text-lg leading-relaxed text-fam-ink-muted">{body}</p>
            <div className="mt-7 flex flex-wrap items-center gap-6">
              <PrimaryCta className="inline-flex h-[54px] items-center gap-2 rounded-lg bg-primary px-8 font-display text-base font-medium tracking-wide text-primary-foreground transition-opacity hover:opacity-90">
                {ctaLabel} <ArrowRight className="h-4 w-4" />
              </PrimaryCta>
              {hasPhone(site.phone) && (<a href={`tel:${site.phone}`} className="inline-flex items-center gap-2 font-display font-medium text-fam-ink underline-offset-4 transition-colors hover:text-fam-accent-text hover:underline">
                <Phone className="h-4 w-4 text-fam-accent-text" /> {site.phoneDisplay}
              </a>)}
            </div>
          </div>
        </div>

        {/* Wide cinematic image band, beneath the type, not beside it. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="zi-media mt-14 overflow-hidden rounded-2xl border border-fam-hairline"
        >
          <img src={imageSrc(imageUrl)} alt={HERO_ALT} className="aspect-[16/7] w-full object-cover" />
        </motion.div>

        {/* Trust row, small caps, hairline-separated. */}
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2 text-xs uppercase tracking-[0.18em] text-fam-ink-muted">
          {trustItems.map((t, i) => (
            <span key={t} className="inline-flex items-center gap-2">
              {i > 0 && <span className="h-1 w-1 rounded-full bg-fam-accent" />} {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
