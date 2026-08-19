import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, MapPin } from 'lucide-react'
import { AREAS } from '~/data/areas'

// ServiceAreas VARIANT: 'brand-panel', a bold, confident brand-gradient PANEL.
// The section copy sits on a left rail; the real areas are laid out in tidy
// columns on a deep brand-gradient field, each row separated by a soft hairline
// and lit by a subtle inner glow. Rows sweep in as the panel scrolls into view.
//
// WOW tokens consumed (all brand-derived via color-mix, see styles/app.css):
//   · --wow-grad-brand   → the panel fill.
//   · --wow-shadow-lift  → the panel's deep lift shadow.
//   · --wow-shadow-glow  → the CTA glow.
//   · --wow-ease-out     → entrance easing.
// BRAND identity → the panel is --wow-grad-brand with white ink; the CTA is a
// glass button on the panel. No literal hexes for brand roles.
//
// HONESTY: renders ONLY the real AREAS (name + slug link), no invented counts.
// Self-omits (returns null) when there are no areas, like the default. Content is
// props with the SITE-mirrored fallbacks.
export function ServiceAreasBrandPanelBlock({
  label = tr('section.serviceAreas'),
  heading = tr('section.whereWeHeading'),
  scriptAccent = tr('section.workAccent'),
  body = tr('section.localCrews'),
  moreLink = tr('nav.viewAllAreas'),
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
    <section className="bg-white">
      <div className="container-x py-16 md:py-24">
        <div
          className="relative overflow-hidden rounded-[1.75rem] text-white"
          style={{
            backgroundImage: 'var(--wow-grad-brand)',
            boxShadow: 'var(--wow-shadow-lift)',
          }}
        >
          {/* Ambient inner glow. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/15 blur-3xl"
          />
          <div className="relative grid gap-10 p-8 md:p-12 lg:grid-cols-12 lg:gap-14">
            {/* Copy rail. */}
            <div className="lg:col-span-4">
              {label && (
                <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em]">
                  {label}
                </span>
              )}
              <h2 className="mt-4 text-white">
                {heading}
                {scriptAccent && (
                  <> <span className="font-script text-[1.1em] text-white/90">{scriptAccent}</span></>
                )}
              </h2>
              {body && <p className="mt-3 max-w-sm text-white/80">{body}</p>}
              <Link
                to="/areas"
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-white/95 px-6 font-semibold text-brand-800 transition-transform hover:-translate-y-0.5"
                style={{ boxShadow: 'var(--wow-shadow-glow)' }}
              >
                {moreLink} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Area columns with hairline dividers. */}
            <motion.ul
              className="grid grid-cols-1 gap-x-8 border-t border-white/20 pt-2 sm:grid-cols-2 lg:col-span-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-10%' }}
              variants={{
                hidden: {},
                show: {
                  transition: reduce ? {} : { staggerChildren: 0.04, delayChildren: 0.05 },
                },
              }}
            >
              {AREAS.map((a) => (
                <motion.li
                  key={a.slug}
                  className="border-b border-white/15"
                  variants={{
                    hidden: reduce ? { opacity: 1 } : { opacity: 0, x: 12 },
                    show: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                >
                  <Link
                    to="/areas/$slug"
                    params={{ slug: a.slug }}
                    className="group flex items-center gap-3 py-3.5 transition-colors hover:text-white"
                  >
                    <MapPin className="h-4 w-4 shrink-0 text-white/70 transition-transform group-hover:scale-110" />
                    <span className="font-medium text-white/90 group-hover:text-white">
                      {a.name}
                    </span>
                    <ArrowRight className="ml-auto h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
    </section>
  )
}
