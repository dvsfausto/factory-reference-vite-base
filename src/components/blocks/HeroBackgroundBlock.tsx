import { PrimaryCta } from './PrimaryCta'
import { tr } from '~/lib/i18n'
import { motion } from 'framer-motion'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'

import { hasPhone } from '~/lib/phone'
// Hero LAYOUT: 'background', a full-bleed photo with the headline, sub, CTAs and
// trust row set directly on top, anchored bottom-left for an editorial, magazine-
// cover feel. Harvested from HeroElegantBlock's DARK branch (the scrim-over-photo
// composition) and generalized to be character-agnostic: a cool/neutral slate
// scrim instead of elegant's warm espresso, neutral text instead of warm ivory.
//
// LEGIBILITY: a real LAYERED gradient scrim (bottom-anchored darkening + a
// left-anchored pass), not a flat gray box, text stays readable over any photo,
// brightest where the type sits and softest over the image's focal area.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary / text-primary-foreground (BRAND-
// owned). Accent -> fam-accent-* (DNA) restricted to 50/100/600/700: fam-accent-soft-2
// kicker + trust label on dark, fam-accent rule + dots. Radius -> rounded-*
// (DNA). Font -> font-display (DNA). The cool surface (slate-950) is component-
// owned. Never bg-brand-* / .btn-primary / .btn.
//
// Props identical to HeroBlock; decorativeAsset accepted for parity but unused.
// Returns an Element (no null), matching HeroBlock.
export function HeroBackgroundBlock({
  site = SITE,
  trustItems = [tr('trust.freeEstimates'), tr('trust.onSchedule'), tr('trust.localTeam'), tr('trust.satisfactionGuaranteed')],
}: {
  site?: typeof SITE
  trustItems?: string[]
  decorativeAsset?: string
}) {
  return (
    <section className="relative isolate flex min-h-[34rem] flex-col overflow-hidden bg-fam-panel text-fam-on-dark md:min-h-[40rem]">
      <img
        src={imageSrc(site.hero.image_url)}
        alt={HERO_ALT}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-fam-scrim-2 via-fam-scrim-2/70 to-fam-scrim-2/25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-fam-scrim-2/85 via-fam-scrim-2/35 to-transparent" />

      <div className="container-x relative flex flex-1 items-end py-section">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-fam-accent-on-dark">
            <span className="h-px w-7 bg-fam-accent" />
            {site.hero.kicker}
          </span>

          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.03] tracking-tight text-fam-on-dark drop-shadow-sm sm:text-6xl lg:text-7xl">
            {site.hero.headline}
          </h1>

          {site.hero.subheadline && (
            <p className="mt-5 text-xl leading-relaxed text-slate-200">
              {site.hero.subheadline}
            </p>
          )}

          <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-300">
            {site.hero.body}
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <PrimaryCta
              className="inline-flex h-[52px] items-center gap-2 rounded-xl bg-cta px-7 font-display text-base font-semibold text-cta-foreground transition-opacity hover:opacity-90"
            >
              {site.hero.cta_primary_label} <ArrowRight className="h-4 w-4" />
            </PrimaryCta>
            {hasPhone(site.phone) && (<a
              href={`tel:${site.phone}`}
              className="inline-flex h-[52px] items-center gap-2 rounded-xl border border-fam-card/30 bg-fam-card/5 px-6 font-display font-semibold text-fam-on-dark backdrop-blur-sm transition-colors hover:border-fam-accent hover:text-fam-accent-on-dark"
            >
              <Phone className="h-4 w-4 text-fam-accent-on-dark" /> {site.phoneDisplay}
            </a>)}
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-200">
            {trustItems.map((t) => (
              <span key={t} className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-fam-accent" /> {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
