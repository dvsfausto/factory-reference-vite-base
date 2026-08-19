import { PrimaryCta } from './PrimaryCta'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'

// Hero VARIANT: 'editorial', a magazine-style, typography-forward WOW hero. A
// huge headline reveals word-by-word above a thin brand hairline rule; a wide
// image band carries a brand-gradient corner accent; a brand-gradient strip lists
// the real trust items. Minimal and striking, the third distinct WOW mood
// alongside 'aurora' (cinematic/dark) and 'spotlight' (editorial split/light).
//
// WOW tokens consumed (all brand-derived, styles/app.css):
//   · --wow-grad-brand → the corner accent + the trust strip band.
//   · --wow-shadow-lift → the image band's lift shadow.
//   · --wow-hairline    → the rule under the headline.
//   · --wow-ease-out    → entrance easing (+ staggered word reveal).
// BRAND identity → the primary CTA uses bg-primary/text-primary-foreground.
//
// HONESTY: no invented figures, the strip is the real trust items only.
// `decorativeAsset` accepted for parity, unused. Content is props with SITE fallback.
export function HeroEditorialBlock({
  trustItems = ['Friendly service', 'Same-day quotes', 'Local team', '100% satisfaction'],
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
  const reduce = useReducedMotion()
  const words = headline.trim().split(/\s+/)

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="container-x py-14 md:py-20">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-700"
        >
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundImage: 'var(--wow-grad-brand)' }}
          />
          {kicker}
        </motion.span>

        {/* Oversized kinetic headline, reveals word by word (static under reduced motion). */}
        <motion.h1
          className="mt-6 max-w-5xl text-5xl leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: reduce ? {} : { staggerChildren: 0.06, delayChildren: 0.05 } },
          }}
        >
          {words.map((w, i) => (
            <motion.span
              key={`${w}-${i}`}
              className="inline-block"
              variants={{
                hidden: reduce ? { opacity: 1 } : { opacity: 0, y: '0.4em' },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </motion.span>
          ))}
        </motion.h1>

        {/* Brand hairline rule. */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 h-px origin-left"
          style={{ backgroundImage: 'var(--wow-grad-brand)' }}
        />

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            {subheadline && (
              <p className="font-display text-xl text-ink-800">{subheadline}</p>
            )}
            <p className="mt-3 text-lg leading-relaxed text-ink-700">{body}</p>
          </div>
          <div className="flex flex-wrap gap-3.5">
            <PrimaryCta
              className="inline-flex h-[52px] items-center gap-2 rounded-full bg-primary px-8 font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              style={{ boxShadow: 'var(--wow-shadow-glow)' }}
            >
              {ctaLabel} <ArrowRight className="h-4 w-4" />
            </PrimaryCta>
            <a
              href={`tel:${SITE.phone}`}
              className="inline-flex h-[52px] items-center gap-2 rounded-full border px-6 font-semibold text-brand-800 transition-colors hover:bg-brand-50"
              style={{ borderColor: 'var(--wow-hairline)' }}
            >
              <Phone className="h-4 w-4" /> {SITE.phoneDisplay}
            </a>
          </div>
        </div>

        {/* Wide image band with a brand-gradient corner accent. */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-12"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-3 -top-3 h-28 w-28 rounded-tr-[1.75rem] opacity-80"
            style={{ backgroundImage: 'var(--wow-grad-brand)', filter: 'blur(6px)' }}
          />
          <div
            className="relative overflow-hidden rounded-[1.75rem]"
            style={{ boxShadow: 'var(--wow-shadow-lift)' }}
          >
            <img
              src={imageSrc(imageUrl)}
              alt={HERO_ALT}
              className="h-[42vh] min-h-[320px] w-full object-cover md:h-[52vh]"
            />
          </div>
        </motion.div>
      </div>

      {/* Brand-gradient trust strip, the real trust items. */}
      <div className="relative text-white" style={{ backgroundImage: 'var(--wow-grad-brand)' }}>
        <div className="container-x flex flex-wrap items-center gap-x-8 gap-y-2 py-4 text-sm font-semibold uppercase tracking-[0.12em]">
          {trustItems.map((t) => (
            <span key={t} className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white/70" /> {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
