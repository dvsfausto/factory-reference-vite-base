import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'

// Hero LAYOUT: 'background' — a full-bleed photo with the headline, sub, CTAs and
// trust row set directly on top, anchored bottom-left for an editorial, magazine-
// cover feel. Harvested from HeroElegantBlock's DARK branch (the scrim-over-photo
// composition) and generalized to be character-agnostic: a cool/neutral slate
// scrim instead of elegant's warm espresso, neutral text instead of warm ivory.
//
// LEGIBILITY: a real LAYERED gradient scrim (bottom-anchored darkening + a
// left-anchored pass), not a flat gray box — text stays readable over any photo,
// brightest where the type sits and softest over the image's focal area.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary / text-primary-foreground (BRAND-
// owned). Accent -> emerald-* (DNA) restricted to 50/100/600/700: emerald-100
// kicker + trust label on dark, emerald-600 rule + dots. Radius -> rounded-*
// (DNA). Font -> font-display (DNA). The cool surface (slate-950) is component-
// owned. Never bg-brand-* / .btn-primary / .btn.
//
// Props identical to HeroBlock; decorativeAsset accepted for parity but unused.
// Returns an Element (no null), matching HeroBlock.
export function HeroBackgroundBlock({
  trustItems = ['Same-week appointments', 'Transparent pricing', 'Gentle, modern care', 'Friendly, modern office'],
}: {
  trustItems?: string[]
  decorativeAsset?: string
}) {
  return (
    <section className="relative isolate flex min-h-[34rem] flex-col overflow-hidden bg-slate-950 text-white md:min-h-[40rem]">
      <img
        src={imageSrc(SITE.hero.image_url)}
        alt={HERO_ALT}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-slate-950/85 via-slate-950/35 to-transparent" />

      <div className="container-x relative flex flex-1 items-end py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100">
            <span className="h-px w-7 bg-emerald-600" />
            {SITE.hero.kicker}
          </span>

          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.03] tracking-tight text-white drop-shadow-sm sm:text-6xl lg:text-7xl">
            {SITE.hero.headline}
          </h1>

          {SITE.hero.subheadline && (
            <p className="mt-5 text-xl leading-relaxed text-slate-200">
              {SITE.hero.subheadline}
            </p>
          )}

          <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-300">
            {SITE.hero.body}
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              to="/contact"
              className="inline-flex h-[52px] items-center gap-2 rounded-xl bg-primary px-7 font-display text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {SITE.hero.cta_primary_label} <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`tel:${SITE.phone}`}
              className="inline-flex h-[52px] items-center gap-2 rounded-xl border border-white/30 bg-white/5 px-6 font-display font-semibold text-white backdrop-blur-sm transition-colors hover:border-emerald-600 hover:text-emerald-100"
            >
              <Phone className="h-4 w-4 text-emerald-100" /> {SITE.phoneDisplay}
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-200">
            {trustItems.map((t) => (
              <span key={t} className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" /> {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
