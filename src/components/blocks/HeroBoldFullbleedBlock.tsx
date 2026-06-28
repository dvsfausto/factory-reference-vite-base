import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Phone } from 'lucide-react'
import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'

// Hero VARIANT: 'bold-fullbleed' — a grounded, industrial composition for
// trades (construction/remodel). Deliberately the OPPOSITE of the default
// HeroBlock's split-grid + botanical leaf sprites + script-italic accent word.
//
// TOKEN DISCIPLINE — the reference every catalog variant patterns from. Each
// role pulls from the var its OWNER controls, so brand kit + DNA BOTH land
// without fighting:
//   · BRAND (customer identity) → the PRIMARY CTA uses bg-primary /
//     text-primary-foreground (→ var(--primary), which the brand emit owns), so
//     a customer's brand color lands on it. NOT bg-brand-*/.btn-primary (literal
//     hex that ignores the kit).
//   · DNA accent (→ steel-blue) → emerald-* utilities, reserved for the ACCENT
//     role ONLY: the eyebrow chip, the subheadline, the full-width trust band.
//   · DNA radius (→ square scale) → rounded-* utilities. NOT .btn (hardcoded
//     999px pill, which is why the stock hero ignores the radius DNA).
//   · DNA font (→ Oswald) → font-display on the headline + CTA label.
//   · Neutrals → ink-* / white on the dark full-bleed surface.
//
// Props are identical to HeroBlock so the homepage render path threads them the
// same way. `decorativeAsset` is accepted for prop parity but intentionally
// unused — this composition carries no decorative sprite.
export function HeroBoldFullbleedBlock({
  trustItems = ['Free estimates', 'On schedule', 'Local team', 'Satisfaction guaranteed'],
}: {
  trustItems?: string[]
  decorativeAsset?: string
}) {
  return (
    <section className="relative isolate flex flex-col overflow-hidden bg-ink-900 text-white">
      {/* Full-bleed jobsite/build photo — "we build things", not a boutique. */}
      <img
        src={imageSrc(SITE.hero.image_url)}
        alt={HERO_ALT}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      {/* Dark structural scrim for legibility + industrial mood. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-900 via-ink-900/90 to-ink-900/45" />

      <div className="container-x relative flex flex-1 items-center py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          {/* Eyebrow: a solid steel-blue block + the kicker — blocky, not dainty. */}
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-ink-100">
            <span className="inline-block h-3 w-3 bg-emerald-600" />
            {SITE.hero.kicker}
          </span>

          {/* Heavy UPPERCASE Oswald headline — the whole line, no script split. */}
          <h1 className="mt-5 font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {SITE.hero.headline}
          </h1>

          {SITE.hero.subheadline && (
            <p className="mt-5 font-display text-xl uppercase tracking-wide text-emerald-100">
              {SITE.hero.subheadline}
            </p>
          )}

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-100/85">
            {SITE.hero.body}
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            {/* Primary CTA: BRAND-owned color (bg-primary, var(--primary)) so a
                customer's brand kit lands on it. Square corners (DNA radius via
                rounded-md, not the .btn 999px pill) + Oswald label. Deliberately
                not emerald (that is the DNA accent role) and not the literal
                brand scale or .btn-primary (fixed hex that ignores the kit). */}
            <Link
              to="/contact"
              className="inline-flex h-[54px] items-center gap-2 rounded-md bg-primary px-8 font-display text-base font-semibold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
            >
              {SITE.hero.cta_primary_label} <ArrowRight className="h-4 w-4" />
            </Link>
            {/* Secondary CTA: outline phone, same square structural corners. */}
            <a
              href={`tel:${SITE.phone}`}
              className="inline-flex h-[54px] items-center gap-2 rounded-md border border-white/35 px-7 font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
            >
              <Phone className="h-4 w-4" /> {SITE.phoneDisplay}
            </a>
          </div>
        </motion.div>
      </div>

      {/* Full-width steel-blue trust band — a contractor's banner stripe. The
          most unmistakable carrier of the DNA accent color. */}
      <div className="relative bg-emerald-600">
        <div className="container-x flex flex-wrap items-center gap-x-8 gap-y-2 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white">
          {trustItems.map((t) => (
            <span key={t} className="inline-flex items-center gap-2">
              <Check className="h-4 w-4" /> {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
