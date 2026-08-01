import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, MapPin } from 'lucide-react'
import { SectionHeader } from '~/components/SectionHeader'
import { AREAS } from '~/data/areas'

// ServiceAreas VARIANT: 'glow-pins' — the boutique, tactile take. Each real area
// becomes a lifted GLASS card floating on a soft brand-tinted field; a gradient
// pin badge anchors it and a brand glow blooms on hover. Cards stagger in as they
// scroll into view. The lively counterpart to the flat default chip cloud.
//
// WOW tokens consumed (all brand-derived via color-mix, see styles/app.css):
//   · --wow-grad-surface → the section's soft radial brand-tint background.
//   · --wow-grad-brand   → the pin badge fill.
//   · --wow-shadow-glow  → the per-card brand glow on hover.
//   · --wow-hairline     → the glass card + button hairline borders.
//   · --wow-ease-out     → entrance easing.
// BRAND identity → the "more" CTA keeps the default's .btn-secondary; brand accents
// (pin badge, hover ring) ride the brand ramp / --wow-grad-brand.
//
// HONESTY: renders ONLY the real AREAS (name + slug link) — no invented city
// counts. Self-omits (returns null) when there are no areas, exactly like the
// default. Content is props with the SITE-mirrored fallbacks.
export function ServiceAreasGlowPinsBlock({
  label = 'Service areas',
  heading = 'Where we',
  scriptAccent = 'work',
  body = 'Local crews, familiar streets.',
  moreLink = 'View all areas →',
}: {
  label?: string
  heading?: string
  scriptAccent?: string
  body?: string
  moreLink?: string
}) {
  const reduce = useReducedMotion()
  if (AREAS.length === 0) return null

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundImage: 'var(--wow-grad-surface)' }}
    >
      <div className="container-x py-16 md:py-24">
        <SectionHeader
          label={label}
          heading={heading}
          scriptAccent={scriptAccent}
          body={body}
        />

        <motion.div
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-10%' }}
          variants={{
            hidden: {},
            show: {
              transition: reduce ? {} : { staggerChildren: 0.05, delayChildren: 0.05 },
            },
          }}
        >
          {AREAS.map((a) => (
            <motion.div
              key={a.slug}
              variants={{
                hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 16 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              <Link
                to="/areas/$slug"
                params={{ slug: a.slug }}
                className="group flex h-full items-center gap-3 rounded-2xl border bg-white/80 px-4 py-4 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1"
                style={{ borderColor: 'var(--wow-hairline)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--wow-shadow-glow)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundImage: 'var(--wow-grad-brand)' }}
                >
                  <MapPin className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold text-ink-800 transition-colors group-hover:text-brand-700">
                  {a.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 text-center">
          <Link
            to="/areas"
            className="inline-flex items-center gap-1.5 btn btn-md btn-secondary"
          >
            {moreLink} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
