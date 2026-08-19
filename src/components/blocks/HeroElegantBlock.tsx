import { PrimaryCta } from './PrimaryCta'
import { motion } from 'framer-motion'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'

// Hero VARIANT: 'elegant'. Two compositions by surface mode (the scrim-over-photo
// dark hero can't simply go light, light needs its own layout):
//   · DARK (opt-in, design_dna.surface='dark'), a full-bleed photo under a warm
//     espresso scrim with light text. This branch is the ORIGINAL elegant hero
//     verbatim, so a dark build (e.g. the cigar lounge) renders byte-identical.
//   · LIGHT (default), a refined warm-ivory split: serif headline + a framed
//     rounded image card. Airy and bright, never dark espresso.
//
// TOKEN DISCIPLINE: primary CTA → bg-primary / text-primary-foreground (brand-
// owned). Accent → emerald-* (DNA). Radius → rounded-* (DNA). Font → font-display
// (DNA serif). Surface neutrals component-owned per mode. No bg-brand-*/.btn-
// primary/.btn. Returns an Element (no null).
//
// CONTENT is PROPS with SITE fallback (F.inner): homepage passes no content props
// → defaults to SITE.hero.* (byte-identical). Inner pages pass PER-PAGE content.
// SITE.phone/phoneDisplay stay site-level.
export function HeroElegantBlock({
  trustItems = ['Free estimates', 'On schedule', 'Local team', 'Satisfaction guaranteed'],
  headline = SITE.hero.headline,
  body = SITE.hero.body,
  imageUrl = SITE.hero.image_url,
  kicker = SITE.hero.kicker,
  subheadline = SITE.hero.subheadline,
  ctaLabel = SITE.hero.cta_primary_label,
}: {
  trustItems?: string[]
  decorativeAsset?: string
  headline?: string
  body?: string
  imageUrl?: string
  kicker?: string
  subheadline?: string
  ctaLabel?: string
}) {
  const dark = (SITE as { surface?: string }).surface === 'dark'

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

        <div className="container-x relative flex flex-1 items-center py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-emerald-600">
              <span className="h-px w-8 bg-emerald-600" />
              {kicker}
            </span>

            {/* Refined serif headline, title-case, generous, unhurried. */}
            <h1 className="mt-6 font-display text-5xl font-medium leading-[1.05] tracking-tight text-[#F2E8DC] sm:text-6xl lg:text-7xl">
              {headline}
            </h1>

            {subheadline && (
              <p className="mt-5 font-display text-2xl italic leading-snug text-emerald-100">
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
              <a
                href={`tel:${SITE.phone}`}
                className="inline-flex h-[54px] items-center gap-2 rounded-lg border border-emerald-600/60 px-7 font-medium text-[#F2E8DC] transition-colors hover:border-emerald-600 hover:bg-emerald-600/10"
              >
                <Phone className="h-4 w-4" /> {SITE.phoneDisplay}
              </a>
            </div>

            {/* Refined trust row, a thin amber-ruled line, not a loud banner. */}
            <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[#3A2E24] pt-6 text-xs uppercase tracking-[0.18em] text-[#B8A893]">
              {trustItems.map((t) => (
                <span key={t} className="inline-flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-emerald-600" /> {t}
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
  const metaLine = [SITE.address.city, SITE.address.state].filter(Boolean).join(', ')
  return (
    <section className="bg-[#FBF7EF] text-[#2B2620]">
      <div className="container-x py-16 md:py-24">
        {/* Masthead: eyebrow left, place/phone right, over a hairline. */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-end justify-between gap-4 border-b border-[#E7DCC9] pb-6"
        >
          <span className="text-xs font-medium uppercase tracking-[0.32em] text-emerald-700">{kicker}</span>
          {(metaLine || SITE.phoneDisplay) && (
            <span className="text-xs uppercase tracking-[0.22em] text-[#9A8E7C]">
              {[metaLine, SITE.phoneDisplay].filter(Boolean).join('  ·  ')}
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
              className="font-display text-2xl italic leading-snug text-emerald-800 lg:col-span-6"
            >
              {subheadline}
            </motion.p>
          )}
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="text-lg leading-relaxed text-[#8A7E6E]">{body}</p>
            <div className="mt-7 flex flex-wrap items-center gap-6">
              <PrimaryCta className="inline-flex h-[54px] items-center gap-2 rounded-lg bg-primary px-8 font-display text-base font-medium tracking-wide text-primary-foreground transition-opacity hover:opacity-90">
                {ctaLabel} <ArrowRight className="h-4 w-4" />
              </PrimaryCta>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center gap-2 font-display font-medium text-[#2B2620] underline-offset-4 transition-colors hover:text-emerald-800 hover:underline">
                <Phone className="h-4 w-4 text-emerald-700" /> {SITE.phoneDisplay}
              </a>
            </div>
          </div>
        </div>

        {/* Wide cinematic image band, beneath the type, not beside it. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="zi-media mt-14 overflow-hidden rounded-2xl border border-[#E7DCC9]"
        >
          <img src={imageSrc(imageUrl)} alt={HERO_ALT} className="aspect-[16/7] w-full object-cover" />
        </motion.div>

        {/* Trust row, small caps, hairline-separated. */}
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2 text-xs uppercase tracking-[0.18em] text-[#8A7E6E]">
          {trustItems.map((t, i) => (
            <span key={t} className="inline-flex items-center gap-2">
              {i > 0 && <span className="h-1 w-1 rounded-full bg-emerald-600" />} {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
