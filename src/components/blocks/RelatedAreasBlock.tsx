import { motion, useReducedMotion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { ArrowRight, MapPin } from 'lucide-react'
import type { ServiceAreaPageData } from '~/lib/types/page-types'

// AREA-DETAIL VARIANT (Arc 3 · Stage D): "we also serve nearby" — THIS area's
// `relatedAreas` cross-links, rendered as WOW glass cards that lift + glow. Per-item
// via `area` (ctx.area). Replaces ServiceAreaPageTemplate's related-areas section.
// This is the Stage-D mirror of RelatedServicesBlock.
//
// Each RelatedLink is { href, label } (see src/lib/types/page-types.ts). The scaffolder
// emits href as the full path (`/areas/<slug>`), so the card links via `to={a.href}` —
// the same string-Link pattern RelatedServicesBlock uses for `/services/<slug>`.
//
// WOW tokens consumed (all brand-derived via color-mix, see styles/app.css):
//   · --wow-grad-surface → the section's soft radial brand tint background.
//   · --wow-hairline     → card hairline borders.
//   · --wow-shadow-soft / --wow-shadow-glow → card resting lift / hover glow.
// BRAND identity → the "Explore" affordance uses text-brand-600. No literal hex.
//
// HONESTY: links are the real per-area relatedAreas. Returns null when there are none
// — no empty section (matches ServiceAreaPageTemplate's `relatedAreas.length > 0`
// guard). Reveal is applied by the shared SectionList, so no opacity-hider here.
export function RelatedAreasBlock({
  area,
}: {
  area: ServiceAreaPageData
  variant?: string
}) {
  const reduce = useReducedMotion()
  const related = area.relatedAreas
  if (related.length === 0) return null

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundImage: 'var(--wow-grad-surface)' }}
    >
      <div className="container-x py-16 md:py-24">
        <h2 className="text-center font-display text-3xl leading-tight text-ink-900 sm:text-4xl">
          We also serve nearby
        </h2>
        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((a, i) => (
            <motion.div
              key={a.href}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{
                duration: 0.55,
                delay: reduce ? 0 : Math.min(i * 0.08, 0.4),
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link
                to={a.href}
                className="group flex h-full flex-col justify-between rounded-2xl border bg-white/85 p-7 backdrop-blur-md transition-transform duration-500 hover:-translate-y-1"
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
                <h3 className="flex items-center gap-2 font-display text-lg leading-snug text-ink-900">
                  <MapPin className="h-4 w-4 shrink-0 text-brand-600" /> {a.label}
                </h3>
                <span className="mt-3 inline-flex items-center gap-1 font-semibold text-brand-600 transition-all group-hover:gap-2">
                  Explore <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
