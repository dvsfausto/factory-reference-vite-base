import { PrimaryCta } from './PrimaryCta'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Phone } from 'lucide-react'
import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'

// Hero LAYOUT: 'centered' — the same modern, light-cool character as
// HeroModernBlock, re-laid as a single centered column instead of a left/right
// split. Headline, subheadline, body, CTAs and trust row stack and center on a
// constrained max-width measure; the hero image sits below as a full-width
// framed banner rather than a side panel. This is the pilot's LAYOUT axis — a
// composition variant, not a new character.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary / text-primary-foreground (BRAND-
// owned). Accent -> emerald-* (DNA -> indigo): eyebrow rule, trust checks, ghost
// CTA. Radius -> rounded-* (DNA, restrained). Font -> font-display (DNA Sora).
// The LIGHT-COOL surface is component-owned (white / slate #0F172A / #64748B /
// border #E6E8EC). Never bg-brand-* / .btn-primary / .btn.
//
// Props identical to HeroBlock; decorativeAsset accepted for parity but unused.
// Returns an Element (no null), matching HeroBlock.
export function HeroCenteredBlock({
  trustItems = ['Free estimates', 'On schedule', 'Local team', 'Satisfaction guaranteed'],
}: {
  trustItems?: string[]
  decorativeAsset?: string
}) {
  return (
    <section className="bg-white">
      <div className="container-x py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            <span className="h-px w-6 bg-emerald-600" />
            {SITE.hero.kicker}
            <span className="h-px w-6 bg-emerald-600" />
          </span>

          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-[#0F172A] sm:text-6xl">
            {SITE.hero.headline}
          </h1>

          {SITE.hero.subheadline && (
            <p className="mt-5 text-xl leading-relaxed text-[#64748B]">
              {SITE.hero.subheadline}
            </p>
          )}

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#64748B]">
            {SITE.hero.body}
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <PrimaryCta
              className="inline-flex h-[52px] items-center gap-2 rounded-xl bg-primary px-7 font-display text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {SITE.hero.cta_primary_label} <ArrowRight className="h-4 w-4" />
            </PrimaryCta>
            <a
              href={`tel:${SITE.phone}`}
              className="inline-flex h-[52px] items-center gap-2 rounded-xl border border-[#E6E8EC] px-6 font-display font-semibold text-[#0F172A] transition-colors hover:border-emerald-600 hover:text-emerald-700"
            >
              <Phone className="h-4 w-4 text-emerald-600" /> {SITE.phoneDisplay}
            </a>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[#64748B]">
            {trustItems.map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-600" /> {t}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-14 max-w-5xl"
        >
          <div className="overflow-hidden rounded-2xl border border-[#E6E8EC] shadow-sm">
            <img
              src={imageSrc(SITE.hero.image_url)}
              alt={HERO_ALT}
              className="aspect-[16/7] w-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
