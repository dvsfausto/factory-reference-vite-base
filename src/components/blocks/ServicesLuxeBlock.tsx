import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { SectionHeader } from '~/components/SectionHeader'
import { SERVICES } from '~/data/services-view'
import { serviceImageUrl } from '~/data/images'

// Services VARIANT: 'luxe' — a premium glass-card grid on a soft radial brand
// surface. Each card is a framed photo above a frosted body; on hover the whole
// card LIFTS and picks up the brand glow, the photo eases in, and a gradient
// index badge rides the top-left corner. The boutique counterpart to the plain
// 'grid' preview.
//
// WOW tokens consumed (all brand-derived via color-mix, see styles/app.css):
//   · --wow-grad-surface → the section's soft radial brand tint background.
//   · --wow-grad-brand   → the numbered index badge + hover accent rule.
//   · --wow-shadow-soft  → the card's resting lift.
//   · --wow-shadow-glow  → the card's hover glow.
//   · --wow-hairline     → card + badge hairline borders.
//   · --wow-ease-out     → entrance / hover easing.
// BRAND identity → the "more" CTA uses the .btn utilities; the script accent in
// the header uses text-brand-600 (brand ramp). No literal non-brand hex.
//
// HONESTY: renders ONLY the first 3 real published services (name/short/photo).
// Zero services → returns null exactly like the default. The "view all" link only
// shows when there are genuinely more services than previewed. Nothing invented.
export function ServicesLuxeBlock({
  label = 'Our services',
  heading = 'What we',
  scriptAccent = 'do',
  body = 'A focused list of services, done well.',
  exploreLabel = 'Explore',
  moreLink = 'View all services →',
}: {
  label?: string
  heading?: string
  scriptAccent?: string
  body?: string
  exploreLabel?: string
  moreLink?: string
}) {
  const reduce = useReducedMotion()
  const previewServices = SERVICES.slice(0, 3)
  if (previewServices.length === 0) return null

  const gridCols =
    previewServices.length === 1
      ? 'md:grid-cols-1 md:max-w-sm md:mx-auto'
      : previewServices.length === 2
        ? 'md:grid-cols-2 md:max-w-3xl md:mx-auto'
        : 'md:grid-cols-3'

  return (
    <section
      className="relative overflow-hidden border-y"
      style={{
        backgroundImage: 'var(--wow-grad-surface)',
        borderColor: 'var(--wow-hairline)',
      }}
    >
      <div className="container-x py-16 md:py-24">
        <SectionHeader
          label={label}
          heading={heading}
          scriptAccent={scriptAccent}
          body={body}
        />
        <div className={`grid grid-cols-1 ${gridCols} gap-6 md:gap-7`}>
          {previewServices.map((s, i) => (
            <motion.div
              key={s.slug}
              initial={reduce ? false : { opacity: 0, y: 26 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{
                duration: 0.6,
                delay: reduce ? 0 : i * 0.09,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border bg-white/85 backdrop-blur-md transition-all duration-500 hover:-translate-y-1.5"
                style={{
                  borderColor: 'var(--wow-hairline)',
                  boxShadow: 'var(--wow-shadow-soft)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--wow-shadow-glow)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--wow-shadow-soft)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--wow-shadow-glow)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--wow-shadow-soft)'
                }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={serviceImageUrl(s.slug)}
                    alt={s.name}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                  {/* Gradient index badge riding the corner. */}
                  <span
                    className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-2xl font-display text-lg font-bold text-white"
                    style={{
                      backgroundImage: 'var(--wow-grad-brand)',
                      boxShadow: 'var(--wow-shadow-glow)',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl leading-snug">{s.name}</h3>
                  <p className="mt-2 flex-1 text-ink-500">{s.short}</p>
                  {/* Brand-gradient rule that widens on hover. */}
                  <span
                    aria-hidden
                    className="mt-5 block h-[3px] w-10 rounded-full transition-all duration-500 group-hover:w-16"
                    style={{ backgroundImage: 'var(--wow-grad-brand)' }}
                  />
                  <div className="mt-4 flex items-center gap-1 font-semibold text-brand-600 transition-all group-hover:gap-2">
                    {exploreLabel} <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        {SERVICES.length > previewServices.length && (
          <div className="mt-10 text-center">
            <Link to="/services" className="btn btn-md btn-secondary">
              {moreLink}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
