import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'

// Hero VARIANT: 'elegant' — dark-luxury, members'-club intimacy. The elegant
// analog of HeroBoldFullbleedBlock: a full-bleed photo under a WARM-dark scrim
// (espresso, not cool navy), a refined serif headline (title-case, not Oswald-
// uppercase), amber accents, and an unhurried, low-light composition. No leaf
// sprites, no cursive flourish.
//
// TOKEN DISCIPLINE: primary CTA → bg-primary / text-primary-foreground (BRAND-
// owned, so a customer's kit lands on it). Accent → emerald-* (DNA → amber):
// eyebrow rule, the thin trust row. Radius → rounded-* (DNA, gently rounded).
// Font → font-display (DNA serif). The warm-dark SURFACE is component-owned
// (espresso #1A1410 / cream #F2E8DC / taupe #B8A893) — DNA cannot set it and the
// cool ink-* scale is the wrong hue. Never bg-brand-* / .btn-primary / .btn.
//
// Props identical to HeroBlock (uniform render path); decorativeAsset accepted
// for parity but intentionally unused (no sprite). Returns an Element (no null),
// matching HeroBlock's signature.
export function HeroElegantBlock({
  trustItems = ['Walk-in humidor', 'Members & guests welcome', 'Craft spirits list', 'Private events'],
}: {
  trustItems?: string[]
  decorativeAsset?: string
}) {
  return (
    <section className="relative isolate flex flex-col overflow-hidden bg-[#1A1410] text-[#F2E8DC]">
      {/* Full-bleed lounge photo under a warm espresso scrim — low-light, intimate. */}
      <img
        src={imageSrc(SITE.hero.image_url)}
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
            {SITE.hero.kicker}
          </span>

          {/* Refined serif headline — title-case, generous, unhurried. */}
          <h1 className="mt-6 font-display text-5xl font-medium leading-[1.05] tracking-tight text-[#F2E8DC] sm:text-6xl lg:text-7xl">
            {SITE.hero.headline}
          </h1>

          {SITE.hero.subheadline && (
            <p className="mt-5 font-display text-2xl italic leading-snug text-emerald-100">
              {SITE.hero.subheadline}
            </p>
          )}

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#B8A893]">
            {SITE.hero.body}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/contact"
              className="inline-flex h-[54px] items-center gap-2 rounded-lg bg-primary px-8 font-display text-base font-medium tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
            >
              {SITE.hero.cta_primary_label} <ArrowRight className="h-4 w-4" />
            </Link>
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
