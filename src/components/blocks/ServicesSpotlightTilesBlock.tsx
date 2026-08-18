import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { SectionHeader } from '~/components/SectionHeader'
import { SERVICES } from '~/data/services-view'
import { serviceImageUrl } from '~/data/images'

// Services VARIANT: 'spotlight-tiles' — the lead service takes a big, cinematic
// brand-gradient SPOTLIGHT tile (photo under a brand wash, copy inset on glass);
// the remaining services sit beside it as compact frosted glass tiles that lift +
// glow on hover. A hierarchy-forward showcase, distinct from the even grid/bento.
//
// WOW tokens consumed (all brand-derived via color-mix, see styles/app.css):
//   · --wow-grad-brand   → the spotlight tile's brand wash + accent rule.
//   · --wow-grad-surface → the section's soft radial brand tint background.
//   · --wow-shadow-lift  → the spotlight tile's deep lift.
//   · --wow-shadow-soft / --wow-shadow-glow → compact tiles resting / hover glow.
//   · --wow-hairline     → tile hairline borders.
//   · --wow-ease-out     → entrance / hover easing.
// BRAND identity → the spotlight CTA uses bg-white/text ink on the brand wash;
// the "more" CTA uses .btn utilities; script accent uses text-brand-600. No hex.
//
// HONESTY: renders ONLY the first 3 real published services (name/short/photo).
// Zero services → returns null exactly like the default. With a single service the
// spotlight stands alone (no empty tiles). "View all" only shows when there are
// genuinely more services than previewed. Nothing invented.
export function ServicesSpotlightTilesBlock({
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
  const [lead, ...rest] = previewServices
  if (!lead) return null

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
        <div
          className={`grid grid-cols-1 gap-6 ${
            rest.length > 0 ? 'lg:grid-cols-2' : 'lg:max-w-3xl lg:mx-auto'
          }`}
        >
          {/* Lead spotlight tile — big brand-gradient showcase. */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              to="/services/$slug"
              params={{ slug: lead.slug }}
              className="group relative flex h-full min-h-[22rem] flex-col justify-end overflow-hidden rounded-[1.75rem] border bg-ink-900 p-7 sm:p-9"
              style={{
                borderColor: 'var(--wow-hairline)',
                boxShadow: 'var(--wow-shadow-lift)',
              }}
            >
              <img
                src={serviceImageUrl(lead.slug)}
                alt={lead.name}
                loading="lazy"
                width={1000}
                height={800}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
              {/* Brand wash — decorative brand TINT over the photo (aesthetic only). */}
              <span
                aria-hidden
                className="absolute inset-0"
                style={{ backgroundImage: 'var(--wow-grad-brand)', opacity: 0.72 }}
              />
              {/* Legibility scrim — a NEUTRAL dark gradient that covers the whole copy
                  area (bottom ~55%), not just the bottom 40%. Sits ABOVE the brand wash
                  so white copy stays ≥4.5:1 regardless of the photo OR a light brand
                  wash (light/yellow primaries). The bg-ink-900 tile base guarantees the
                  same when the image is missing or still loading. */}
              <span
                aria-hidden
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.6) 45%, transparent 78%)',
                }}
              />
              <div className="relative">
                <span className="badge-pill bg-white/20 text-white backdrop-blur-sm">
                  {label}
                </span>
                <h3 className="mt-4 font-display text-3xl leading-tight text-white sm:text-4xl">
                  {lead.name}
                </h3>
                <p className="mt-3 max-w-md text-white/90">{lead.short}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-white transition-all group-hover:gap-2.5">
                  {exploreLabel} <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Compact frosted glass tiles for the rest. */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {rest.map((s, i) => (
                <motion.div
                  key={s.slug}
                  initial={reduce ? false : { opacity: 0, y: 22 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{
                    duration: 0.6,
                    delay: reduce ? 0 : 0.1 + i * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="h-full"
                >
                  <Link
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="group flex h-full items-center gap-5 overflow-hidden rounded-[1.5rem] border bg-white/85 p-4 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 sm:p-5"
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
                    <div className="relative h-24 w-24 flex-none overflow-hidden rounded-2xl sm:h-28 sm:w-28">
                      <img
                        src={serviceImageUrl(s.slug)}
                        alt={s.name}
                        loading="lazy"
                        width={224}
                        height={224}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-lg leading-snug">{s.name}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-ink-500">
                        {s.short}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition-all group-hover:gap-2">
                        {exploreLabel}
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
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
