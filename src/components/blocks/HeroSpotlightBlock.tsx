import { PrimaryCta } from './PrimaryCta'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, Phone, Star } from 'lucide-react'
import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { getAggregateRating } from '~/data/reviews'
import { imageSrc } from '~/lib/asset-url'

// Hero VARIANT: 'spotlight' — a premium, editorial left/right split on a LIGHT
// surface. The business photo sits in a lifted, framed card over a radial brand
// glow; glass trust chips float at its edges. The polished, boutique counterpart
// to 'aurora' (which is dark + cinematic).
//
// WOW tokens consumed (all brand-derived via color-mix, see styles/app.css):
//   · --wow-grad-surface → the section's soft radial brand tint background.
//   · --wow-shadow-lift  → the framed image card's deep lift shadow.
//   · --wow-shadow-glow  → the primary CTA + floating chips' brand glow.
//   · --wow-hairline     → chip / frame hairline borders.
//   · --wow-ease-out     → entrance easing.
// BRAND identity → the primary CTA uses bg-primary/text-primary-foreground
// (var(--primary)); the script accent uses text-brand-600 (brand ramp).
//
// HONESTY: the floating chips are the REAL trust items + (when present) the real
// aggregate rating — nothing invented. No reviews → no rating chip. `decorativeAsset`
// accepted for prop parity, unused. Content is props with SITE fallback (F.inner).
function splitScriptAccent(heading: string): { lead: string; accent: string } {
  const words = heading.trim().split(/\s+/)
  if (words.length < 2) return { lead: '', accent: heading }
  return { lead: words.slice(0, -1).join(' '), accent: words.slice(-1).join('') }
}

export function HeroSpotlightBlock({
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
  const heroParts = splitScriptAccent(headline)
  const rating = getAggregateRating()
  // The two floating chips: the real rating (if any) + the first trust item.
  const topChip = trustItems[0]

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundImage: 'var(--wow-grad-surface)' }}
    >
      <div className="container-x relative py-16 md:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Copy column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <span className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-700">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundImage: 'var(--wow-grad-brand)' }}
              />
              {kicker}
            </span>

            <h1 className="mt-4 text-5xl leading-[0.98] tracking-tight sm:text-6xl">
              {heroParts.lead || headline}
              {heroParts.lead && (
                <span className="mt-1 block font-script text-[1.15em] leading-[1.05] text-brand-600">
                  {heroParts.accent}
                </span>
              )}
            </h1>

            {subheadline && (
              <p className="mt-4 font-display text-xl text-ink-700">{subheadline}</p>
            )}

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-700">{body}</p>

            <div className="mt-8 flex flex-wrap gap-3.5">
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

            <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-ink-700 sm:flex sm:flex-wrap">
              {trustItems.map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-brand-600" /> {t}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Framed spotlight image + floating chips */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative lg:col-span-6"
          >
            {/* Radial brand glow behind the frame. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] opacity-70"
              style={{ backgroundImage: 'var(--wow-grad-brand)', filter: 'blur(56px)' }}
            />
            <div
              className="overflow-hidden rounded-[1.75rem] border bg-white"
              style={{ borderColor: 'var(--wow-hairline)', boxShadow: 'var(--wow-shadow-lift)' }}
            >
              <img
                src={imageSrc(imageUrl)}
                alt={HERO_ALT}
                className="aspect-[4/5] w-full object-cover sm:aspect-[5/4] lg:aspect-[4/5]"
              />
            </div>

            {/* Floating rating chip — only when there are real reviews. */}
            {rating && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: reduce ? 0 : 0.5 }}
                className="absolute -left-4 top-8 flex items-center gap-2 rounded-2xl border bg-white/90 px-4 py-3 backdrop-blur-md"
                style={{ borderColor: 'var(--wow-hairline)', boxShadow: 'var(--wow-shadow-glow)' }}
              >
                <Star className="h-5 w-5 fill-current text-amber-400" />
                <span className="text-lg font-bold text-ink-900">{rating.value.toFixed(1)}</span>
                <span className="text-sm text-ink-500">({rating.count})</span>
              </motion.div>
            )}

            {/* Floating trust chip — the real first trust item. */}
            {topChip && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: reduce ? 0 : 0.62 }}
                className="absolute -right-3 bottom-10 flex items-center gap-2 rounded-2xl border bg-white/90 px-4 py-3 backdrop-blur-md"
                style={{ borderColor: 'var(--wow-hairline)', boxShadow: 'var(--wow-shadow-glow)' }}
              >
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full text-white"
                  style={{ backgroundImage: 'var(--wow-grad-brand)' }}
                >
                  <Check className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold text-ink-800">{topChip}</span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
