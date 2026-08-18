import { PrimaryCta } from './PrimaryCta'
import { tr } from '~/lib/i18n'
import { motion } from 'framer-motion'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'

// Hero VARIANT: 'creative' — expressive, color-forward, asymmetric-within-section.
// An off-balance split (uneven columns), an oversized display headline, and an
// image overlapped by a vivid magenta blob + a big rounded color field behind it.
// The strongest creative the fixed-section skeleton allows — bold WITHIN the
// section (page-level layout-breaking is a separate, future unlock).
//
// TOKEN DISCIPLINE: primary CTA → bg-primary / text-primary-foreground (BRAND-
// owned). Accent → emerald-* (DNA → magenta): the color blobs, eyebrow, marks.
// Radius → rounded-* (DNA, large/expressive). Font → font-display (DNA Syne).
// Expressive light surface component-owned (off-white / ink #18181B / #71717A).
// Never bg-brand-*/.btn-primary/.btn.
//
// Props identical to HeroBlock; decorativeAsset accepted for parity but unused.
// Returns an Element (no null).
export function HeroCreativeBlock({
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
  return (
    <section className="relative isolate overflow-hidden bg-[#FBFAFC]">
      {/* Big rounded magenta field, off-canvas right — color-forward backdrop. */}
      <div className="absolute -right-32 -top-24 -z-10 hidden h-[34rem] w-[34rem] rounded-3xl bg-emerald-50 lg:block" />

      <div className="container-x py-20 md:py-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-7"
          >
            <span className="inline-flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.14em] text-[#18181B]">
              <span className="inline-block h-4 w-4 rounded bg-emerald-600" />
              {kicker}
            </span>

            <h1 className="mt-5 font-display text-6xl font-extrabold leading-[0.95] tracking-tight text-[#18181B] sm:text-7xl lg:text-8xl">
              {headline}
            </h1>

            {subheadline && (
              <p className="mt-6 max-w-lg text-2xl font-medium leading-snug text-emerald-700">
                {subheadline}
              </p>
            )}

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#71717A]">
              {body}
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <PrimaryCta
                className="inline-flex h-[56px] items-center gap-2 rounded-2xl bg-primary px-8 font-display text-base font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                {ctaLabel} <ArrowRight className="h-4 w-4" />
              </PrimaryCta>
              <a
                href={`tel:${SITE.phone}`}
                className="inline-flex h-[56px] items-center gap-2 rounded-2xl border-2 border-[#18181B] px-7 font-display font-bold text-[#18181B] transition-colors hover:bg-emerald-600 hover:border-emerald-600 hover:text-white"
              >
                <Phone className="h-4 w-4" /> {SITE.phoneDisplay}
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-[#71717A]">
              {trustItems.map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-600" /> {t}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Image overlapped by a vivid magenta block — layered, off-grid. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative lg:col-span-5"
          >
            <div className="absolute -left-5 -top-5 -z-10 h-32 w-32 rounded-2xl bg-emerald-600" />
            <div className="overflow-hidden rounded-3xl shadow-2xl">
              <img
                src={imageSrc(imageUrl)}
                alt={HERO_ALT}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 rounded-2xl bg-emerald-600 px-5 py-4 font-display text-sm font-bold text-white shadow-xl">{tr('hero.letsMake')}<br />something.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
