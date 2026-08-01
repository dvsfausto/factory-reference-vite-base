import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, Phone, Star } from 'lucide-react'
import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { getAggregateRating } from '~/data/reviews'
import { imageSrc } from '~/lib/asset-url'

// Hero VARIANT: 'aurora' — a cinematic, full-bleed WOW composition. The business
// photo fills the frame; a slow brand-colored aurora drifts over it (screen
// blend); the content sits in a frosted-glass panel lit by a brand glow. Built
// for the Arc-1 WOW layer: it CONSUMES the --wow-* tokens (styles/app.css), which
// are themselves DERIVED from the --color-brand-* ramp via color-mix — so a
// customer's brand color flows through the gradient + glow with NO per-build edit.
//
// TOKEN DISCIPLINE (mirrors HeroBoldFullbleedBlock — the catalog reference):
//   · BRAND identity → the PRIMARY CTA uses bg-primary / text-primary-foreground
//     (→ var(--primary), owned by the brand emit). Never literal brand-* hex.
//   · BRAND richness → --wow-grad-brand / --wow-shadow-glow / --wow-hairline
//     (all color-mix'd off the brand ramp) carry the gradient, glow, and hairline.
//   · MOTION → --wow-ease-out timing; framer-motion entrance + a reduced-motion-
//     gated ambient aurora drift (honours prefers-reduced-motion via useReducedMotion).
//   · Neutrals → white / white-alpha on the dark cinematic surface.
//
// HONESTY: no fabricated stats/years. The rating badge renders ONLY when there
// are real reviews (getAggregateRating() → null otherwise); trust items are the
// real, passed-in list. Absent data omits gracefully.
//
// CONTENT is PROPS with SITE fallback (F.inner) — the homepage renders it with no
// content props (defaults to SITE.hero.*), inner pages can pass their own. The
// `decorativeAsset` prop is accepted for parity with the default hero, unused here.
function splitScriptAccent(heading: string): { lead: string; accent: string } {
  const words = heading.trim().split(/\s+/)
  if (words.length < 2) return { lead: '', accent: heading }
  return { lead: words.slice(0, -1).join(' '), accent: words.slice(-1).join('') }
}

export function HeroAuroraBlock({
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

  return (
    <section className="relative isolate flex min-h-[calc(100vh-4rem)] flex-col overflow-hidden bg-ink-900 text-white">
      {/* Full-bleed business photo. */}
      <img
        src={imageSrc(imageUrl)}
        alt={HERO_ALT}
        className="absolute inset-0 -z-30 h-full w-full object-cover"
      />
      {/* Legibility scrim — dark from the left, fading right. */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-tr from-ink-900 via-ink-900/85 to-ink-900/30" />
      {/* Ambient brand AURORA — a slow-drifting, blurred wash of --wow-grad-brand.
          screen blend lifts the brand hue out of the photo. Motion is gated: a
          reduced-motion viewer gets the static glow with no drift. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-x-1/4 -top-1/3 -z-10 h-[80%] opacity-[0.55] mix-blend-screen"
        style={{ backgroundImage: 'var(--wow-grad-brand)', filter: 'blur(90px)' }}
        initial={{ opacity: 0 }}
        animate={
          reduce
            ? { opacity: 0.4 }
            : { opacity: [0.35, 0.6, 0.35], x: ['-4%', '6%', '-4%'], y: ['-2%', '4%', '-2%'] }
        }
        transition={
          reduce
            ? { duration: 0.8 }
            : { duration: 18, repeat: Infinity, ease: 'easeInOut' }
        }
      />

      <div className="container-x relative flex flex-1 items-center py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl rounded-3xl border px-7 py-8 backdrop-blur-md sm:px-10 sm:py-11"
          style={{
            backgroundColor: 'rgba(255,255,255,0.06)',
            borderColor: 'var(--wow-hairline)',
            boxShadow: 'var(--wow-shadow-glow)',
          }}
        >
          <span className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white/80">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundImage: 'var(--wow-grad-brand)' }}
            />
            {kicker}
          </span>

          <h1 className="mt-5 text-5xl leading-[0.98] tracking-tight text-white sm:text-6xl">
            {heroParts.lead || headline}
            {heroParts.lead && (
              <span className="mt-1 block font-script text-[1.15em] leading-[1.05] text-white/95">
                {heroParts.accent}
              </span>
            )}
          </h1>

          {subheadline && (
            <p className="mt-4 font-display text-xl text-white/85">{subheadline}</p>
          )}

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">{body}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <Link
              to="/contact"
              className="inline-flex h-[52px] items-center gap-2 rounded-full bg-primary px-8 font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              style={{ boxShadow: 'var(--wow-shadow-glow)' }}
            >
              {ctaLabel} <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`tel:${SITE.phone}`}
              className="inline-flex h-[52px] items-center gap-2 rounded-full border border-white/30 px-6 font-semibold text-white backdrop-blur-sm transition-colors hover:border-white/70 hover:bg-white/10"
            >
              <Phone className="h-4 w-4" /> {SITE.phoneDisplay}
            </a>

            {rating && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3.5 py-2 text-sm text-white/90 backdrop-blur-sm">
                <Star className="h-4 w-4 fill-current text-amber-300" />
                <span className="font-semibold">{rating.value.toFixed(1)}</span>
                <span className="text-white/60">({rating.count})</span>
              </span>
            )}
          </div>

          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/80">
            {trustItems.map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-white/60" /> {t}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
