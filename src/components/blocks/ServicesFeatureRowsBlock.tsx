import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { SectionHeader } from '~/components/SectionHeader'
import { SERVICES } from '~/data/services-view'
import { serviceImageUrl } from '~/data/images'

// Services VARIANT: 'feature-rows', large, editorial feature ROWS that alternate
// the photo left/right. An oversized brand-gradient index numeral anchors each
// copy column above a brand-gradient hairline rule; rows reveal with a staggered
// whileInView slide as they enter. The magazine counterpart to the compact grid.
//
// WOW tokens consumed (all brand-derived via color-mix, see styles/app.css):
//   · --wow-grad-brand   → the oversized index numeral (text clip) + the rule.
//   · --wow-shadow-lift  → the framed photo's deep lift.
//   · --wow-hairline     → the photo frame's hairline border.
//   · --wow-ease-out     → entrance easing.
// BRAND identity → the "more" CTA uses the .btn utilities; script accent in the
// header uses text-brand-600 (brand ramp). No literal non-brand hex.
//
// HONESTY: renders ONLY the first 3 real published services (name/short/photo).
// Zero services → returns null exactly like the default. "View all" only shows
// when there are genuinely more services than previewed. Nothing invented.
export function ServicesFeatureRowsBlock({
  label = tr('section.ourServices'),
  heading = tr('section.whatWeHeading'),
  scriptAccent = tr('section.doAccent'),
  body = tr('section.servicesBody'),
  exploreLabel = tr('common.explore'),
  moreLink = tr('section.viewAllServices'),
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

  return (
    <section
      className="relative overflow-hidden border-y bg-white"
      style={{ borderColor: 'var(--wow-hairline)' }}
    >
      <div className="container-x py-16 md:py-24">
        <SectionHeader
          label={label}
          heading={heading}
          scriptAccent={scriptAccent}
          body={body}
        />
        <div className="space-y-14 md:space-y-20">
          {previewServices.map((s, i) => {
            const flip = i % 2 === 1
            return (
              <motion.div
                key={s.slug}
                initial={reduce ? false : { opacity: 0, y: 34 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{
                  duration: 0.7,
                  delay: reduce ? 0 : i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-14"
              >
                {/* Photo, order flips on alternating rows (desktop only). */}
                <motion.div
                  initial={reduce ? false : { opacity: 0, x: flip ? 40 : -40 }}
                  whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{
                    duration: 0.75,
                    delay: reduce ? 0 : i * 0.08 + 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`relative overflow-hidden rounded-[1.75rem] border ${
                    flip ? 'md:order-2' : ''
                  }`}
                  style={{
                    borderColor: 'var(--wow-hairline)',
                    boxShadow: 'var(--wow-shadow-lift)',
                  }}
                >
                  <img
                    src={serviceImageUrl(s.slug)}
                    alt={s.name}
                    loading="lazy"
                    width={900}
                    height={640}
                    className="aspect-[7/5] w-full object-cover"
                  />
                </motion.div>

                {/* Copy column with the oversized gradient numeral. */}
                <div className={flip ? 'md:order-1' : ''}>
                  <span
                    aria-hidden
                    className="block font-display text-6xl font-extrabold leading-none tracking-tight sm:text-7xl"
                    style={{
                      backgroundImage: 'var(--wow-grad-brand)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    aria-hidden
                    className="mt-4 block h-[3px] w-14 rounded-full"
                    style={{ backgroundImage: 'var(--wow-grad-brand)' }}
                  />
                  <h3 className="mt-5 font-display text-2xl leading-snug sm:text-3xl">
                    {s.name}
                  </h3>
                  <p className="mt-3 max-w-xl text-lg leading-relaxed text-ink-500">
                    {s.short}
                  </p>
                  <Link
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="group mt-6 inline-flex items-center gap-1.5 font-semibold text-brand-600 transition-all hover:gap-2.5"
                  >
                    {exploreLabel} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
        {SERVICES.length > previewServices.length && (
          <div className="mt-14 text-center">
            <Link to="/services" className="btn btn-md btn-secondary">
              {moreLink}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
