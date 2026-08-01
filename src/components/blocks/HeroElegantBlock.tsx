import { PrimaryCta } from './PrimaryCta'
import { motion } from 'framer-motion'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'

// Hero VARIANT: 'elegant'. Two compositions by surface mode (the scrim-over-photo
// dark hero can't simply go light — light needs its own layout):
//   · DARK (opt-in, design_dna.surface='dark') — a full-bleed photo under a warm
//     espresso scrim with light text. This branch is the ORIGINAL elegant hero
//     verbatim, so a dark build (e.g. the cigar lounge) renders byte-identical.
//   · LIGHT (default) — a refined warm-ivory split: serif headline + a framed
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
        {/* Full-bleed lounge photo under a warm espresso scrim — low-light, intimate. */}
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

            {/* Refined serif headline — title-case, generous, unhurried. */}
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

            {/* Refined trust row — a thin amber-ruled line, not a loud banner. */}
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

  // LIGHT (default): a refined warm-ivory split — serif headline + framed image.
  return (
    <section className="bg-[#FBF7EF]">
      <div className="container-x py-20 md:py-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-emerald-700">
              <span className="h-px w-8 bg-emerald-600" />
              {kicker}
            </span>

            <h1 className="mt-6 font-display text-5xl font-medium leading-[1.05] tracking-tight text-[#2B2620] sm:text-6xl">
              {headline}
            </h1>

            {subheadline && (
              <p className="mt-5 font-display text-2xl italic leading-snug text-emerald-700">
                {subheadline}
              </p>
            )}

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#8A7E6E]">
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
                className="inline-flex h-[54px] items-center gap-2 rounded-lg border border-emerald-600/60 px-7 font-medium text-[#2B2620] transition-colors hover:border-emerald-600 hover:bg-emerald-600/10"
              >
                <Phone className="h-4 w-4" /> {SITE.phoneDisplay}
              </a>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[#E7DCC9] pt-6 text-xs uppercase tracking-[0.18em] text-[#8A7E6E]">
              {trustItems.map((t) => (
                <span key={t} className="inline-flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-emerald-600" /> {t}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-2xl border border-[#E7DCC9] shadow-xl">
              <img
                src={imageSrc(imageUrl)}
                alt={HERO_ALT}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
