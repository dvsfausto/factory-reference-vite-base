import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'

// Hero VARIANT: 'corporate' — formal, structured, authoritative. A dense split
// with a heavy grotesque headline, a framed image, and a foregrounded
// CREDENTIALS strip (bordered cells, not pills) — trust signals up front, the
// way high-trust professional verticals lead. Light + structured, never airy or
// playful.
//
// TOKEN DISCIPLINE: primary CTA → bg-primary / text-primary-foreground (BRAND-
// owned). Accent → emerald-* (DNA → navy): eyebrow rule, credential ticks,
// dividers. Radius → rounded-* (DNA, tight). Font → font-display (DNA Libre
// Franklin). The structured LIGHT surface is component-owned (white / navy-
// charcoal #1A2433 / #5A6678 / border #D8DEE7). Never bg-brand-*/.btn-primary/.btn.
//
// Props identical to HeroBlock; decorativeAsset accepted for parity but unused.
// `trustItems` is repurposed as the CREDENTIALS row. Returns an Element (no null).
export function HeroCorporateBlock({
  trustItems = ['Established 1998', 'Licensed & accredited', '500+ clients represented', 'Free initial consultation'],
}: {
  trustItems?: string[]
  decorativeAsset?: string
}) {
  return (
    <section className="bg-white">
      <div className="container-x py-16 md:py-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7"
          >
            <span className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
              <span className="h-0.5 w-7 bg-emerald-600" />
              {SITE.hero.kicker}
            </span>

            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.08] tracking-tight text-[#1A2433] sm:text-5xl lg:text-6xl">
              {SITE.hero.headline}
            </h1>

            {SITE.hero.subheadline && (
              <p className="mt-4 text-xl leading-relaxed text-[#5A6678]">
                {SITE.hero.subheadline}
              </p>
            )}

            <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#5A6678]">
              {SITE.hero.body}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex h-[52px] items-center gap-2 rounded-md bg-primary px-7 font-display text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                {SITE.hero.cta_primary_label} <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={`tel:${SITE.phone}`}
                className="inline-flex h-[52px] items-center gap-2 rounded-md border border-[#D8DEE7] px-6 font-display font-semibold text-[#1A2433] transition-colors hover:border-emerald-600 hover:text-emerald-700"
              >
                <Phone className="h-4 w-4 text-emerald-600" /> {SITE.phoneDisplay}
              </a>
            </div>
          </motion.div>

          {/* Framed image — defined border, tight radius, structured. */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="overflow-hidden rounded-lg border border-[#D8DEE7] shadow-sm">
              <img
                src={imageSrc(SITE.hero.image_url)}
                alt={HERO_ALT}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* Credentials strip — foregrounded trust signals in bordered cells. */}
        <div className="mt-12 grid grid-cols-2 divide-x divide-[#D8DEE7] border-y border-[#D8DEE7] md:grid-cols-4">
          {trustItems.map((t) => (
            <div key={t} className="px-5 py-5 text-sm font-semibold text-[#1A2433]">
              <span className="mb-1 block h-0.5 w-5 bg-emerald-600" />
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
