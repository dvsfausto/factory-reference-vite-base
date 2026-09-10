import { PrimaryCta } from './PrimaryCta'
import { tr } from '~/lib/i18n'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Phone } from 'lucide-react'
import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'

import { hasPhone } from '~/lib/phone'
// Hero LAYOUT: 'split-reversed', the modern split, mirrored: the framed image
// sits on the LEFT and the headline/CTA column on the RIGHT (the default split
// is image-right). Same light-cool modern character + tokens as HeroModernBlock;
// the only change is the column order, for real variety without a new style.
//
// The DOM keeps the text block FIRST (reading + tab order, accessibility); the
// visual mirror is purely a lg: column reorder (lg:order-2 text / lg:order-1
// image), so screen readers still hear the headline before the photo.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary / text-primary-foreground (BRAND-
// owned). Accent -> fam-accent-* (DNA) restricted to 50/100/600/700. Radius ->
// rounded-* (DNA). Font -> font-display (DNA). Light-cool surface component-owned
// (white / slate #0F172A / #64748B / border #E6E8EC). Never bg-brand-* / .btn.
//
// Props identical to HeroBlock; decorativeAsset accepted for parity but unused.
// Returns an Element (no null), matching HeroBlock.
export function HeroSplitReversedBlock({
  site = SITE,
  trustItems = [tr('trust.freeEstimates'), tr('trust.onSchedule'), tr('trust.localTeam'), tr('trust.satisfactionGuaranteed')],
}: {
  site?: typeof SITE
  trustItems?: string[]
  decorativeAsset?: string
}) {
  return (
    <section className="bg-fam-card">
      <div className="container-x py-section">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:order-2"
          >
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
              <span className="h-px w-6 bg-fam-accent" />
              {site.hero.kicker}
            </span>

            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-fam-ink sm:text-6xl">
              {site.hero.headline}
            </h1>

            {site.hero.subheadline && (
              <p className="mt-5 text-xl leading-relaxed text-fam-ink-muted">
                {site.hero.subheadline}
              </p>
            )}

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-fam-ink-muted">
              {site.hero.body}
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <PrimaryCta
                className="inline-flex h-[52px] items-center gap-2 rounded-xl bg-cta px-7 font-display text-base font-semibold text-cta-foreground transition-[filter] hover:brightness-(--hov-shade)"
              >
                {site.hero.cta_primary_label} <ArrowRight className="h-4 w-4" />
              </PrimaryCta>
              {hasPhone(site.phone) && (<a
                href={`tel:${site.phone}`}
                className="inline-flex h-[52px] items-center gap-2 rounded-xl border border-fam-hairline px-6 font-display font-semibold text-fam-ink transition-colors hover:border-fam-accent hover:text-fam-accent-text-strong"
              >
                <Phone className="h-4 w-4 text-fam-accent-text" /> {site.phoneDisplay}
              </a>)}
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-fam-ink-muted">
              {trustItems.map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-fam-accent-text" /> {t}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative lg:order-1"
          >
            <div className="overflow-hidden rounded-2xl border border-fam-hairline elev-1">
              <img
                src={imageSrc(site.hero.image_url)}
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
