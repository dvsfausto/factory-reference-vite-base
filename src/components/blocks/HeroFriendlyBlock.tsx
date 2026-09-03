import { PrimaryCta } from './PrimaryCta'
import { tr } from '~/lib/i18n'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Phone } from 'lucide-react'
import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'

// Hero VARIANT: 'friendly', warm, bright, approachable (playful-but-credible).
// The LIGHT counterpart to the dark bold/elegant heroes: a warm-white split
// layout with a big rounded image card + soft shadow, a rounded friendly
// headline, coral accents, and rounded pill trust chips. No leaf sprites, no
// script flourish.
//
// TOKEN DISCIPLINE: primary CTA → bg-primary / text-primary-foreground (BRAND-
// owned). Accent → emerald-* (DNA → coral): eyebrow dot, trust chips, secondary
// CTA. Radius → rounded-* (DNA, the softest scale). Font → font-display (DNA
// rounded sans). The LIGHT-warm SURFACE is component-owned (warm-white #FFFBF5 /
// charcoal #3D3530 / gray #7A6F66), the inverse of the dark characters. Never
// bg-brand-* / .btn-primary / .btn.
//
// Props identical to HeroBlock (uniform render path); decorativeAsset accepted
// for parity but unused. Returns an Element (no null), matching HeroBlock.
export function HeroFriendlyBlock({
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
  return (
    <section className="bg-[#FFFBF5]">
      <div className="container-x py-16 md:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
              {kicker}
            </span>

            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight text-[#3D3530] sm:text-6xl">
              {headline}
            </h1>

            {subheadline && (
              <p className="mt-4 font-display text-2xl font-medium text-emerald-700">
                {subheadline}
              </p>
            )}

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#7A6F66]">
              {body}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <PrimaryCta
                className="inline-flex h-[54px] items-center gap-2 rounded-2xl bg-primary px-8 font-display text-base font-semibold text-primary-foreground shadow-lg transition-opacity hover:opacity-90"
              >
                {ctaLabel} <ArrowRight className="h-4 w-4" />
              </PrimaryCta>
              <a
                href={`tel:${site.phone}`}
                className="inline-flex h-[54px] items-center gap-2 rounded-2xl border-2 border-emerald-600/40 px-7 font-display font-semibold text-[#3D3530] transition-colors hover:border-emerald-600 hover:bg-emerald-50"
              >
                <Phone className="h-4 w-4 text-emerald-600" /> {site.phoneDisplay}
              </a>
            </div>

            {/* Friendly trust chips, soft rounded coral-tinted pills. */}
            <div className="mt-9 flex flex-wrap gap-2.5">
              {trustItems.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-sm font-medium text-emerald-700"
                >
                  <Check className="h-4 w-4" /> {t}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Big rounded image card with a soft shadow, warm + welcoming. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="zi-card zi-media overflow-hidden rounded-3xl border border-[#F0E6DA] shadow-xl">
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
