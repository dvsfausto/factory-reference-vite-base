import { PrimaryCta } from './PrimaryCta'
import { motion } from 'framer-motion'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '~/data/site'

// Hero LAYOUT: 'minimal' — type-only, NO image. An oversized headline, a large
// subhead, and the CTAs set in a deep field of whitespace, left-aligned on a
// constrained measure. Stripe/Linear-caliber restraint: the layout is distinct
// precisely BECAUSE it drops the image and lets the type scale and the empty
// space do the work — not "centered minus the photo".
//
// DRAMA, not emptiness: a genuine display type scale (up to text-8xl with tight
// leading) against very deep vertical padding, an em-dash rule under a small
// eyebrow, and a single understated trust line — every element earns its place.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary / text-primary-foreground (BRAND-
// owned). Accent -> emerald-* (DNA) restricted to 50/100/600/700: emerald-600
// rule + dot, emerald-700 hover. Radius -> rounded-* (DNA). Font -> font-display
// (DNA). Light surface component-owned (white / slate #0F172A / #64748B). Never
// bg-brand-* / .btn-primary / .btn.
//
// Props identical to HeroBlock; decorativeAsset accepted for parity but unused.
// Returns an Element (no null), matching HeroBlock.
export function HeroMinimalBlock({
  trustItems = ['Free estimates', 'On schedule', 'Local team', 'Satisfaction guaranteed'],
}: {
  trustItems?: string[]
  decorativeAsset?: string
}) {
  return (
    <section className="bg-white">
      <div className="container-x py-28 md:py-44">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
            <span className="h-px w-10 bg-emerald-600" />
            {SITE.hero.kicker}
          </span>

          <h1 className="mt-8 font-display text-6xl font-semibold leading-[0.95] tracking-tight text-[#0F172A] sm:text-7xl lg:text-8xl">
            {SITE.hero.headline}
          </h1>

          {SITE.hero.subheadline && (
            <p className="mt-8 max-w-2xl text-2xl leading-snug text-[#64748B] sm:text-3xl">
              {SITE.hero.subheadline}
            </p>
          )}

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#64748B]">
            {SITE.hero.body}
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <PrimaryCta
              className="inline-flex h-[56px] items-center gap-2 rounded-xl bg-primary px-8 font-display text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {SITE.hero.cta_primary_label} <ArrowRight className="h-4 w-4" />
            </PrimaryCta>
            <a
              href={`tel:${SITE.phone}`}
              className="inline-flex h-[56px] items-center gap-2 rounded-xl px-5 font-display font-semibold text-[#0F172A] transition-colors hover:text-emerald-700"
            >
              <Phone className="h-4 w-4 text-emerald-600" /> {SITE.phoneDisplay}
            </a>
          </div>

          <div className="mt-16 flex flex-wrap gap-x-8 gap-y-2 border-t border-[#E6E8EC] pt-8 text-sm text-[#64748B]">
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
