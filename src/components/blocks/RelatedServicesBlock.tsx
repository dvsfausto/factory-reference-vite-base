import { motion, useReducedMotion } from 'framer-motion'
import { tr } from '~/lib/i18n'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import type { ServicePageData } from '~/lib/types/page-types'
import { isRelatedServiceVisible } from '~/data/services-view'

// SERVICE-DETAIL VARIANT (Arc 3 · Stage C): "you may also need", THIS service's
// `relatedServices` cross-links, rendered as WOW glass cards that lift + glow. Per-item
// via `service` (ctx.service). Replaces ServicePageTemplate's related-services section.
//
// WOW tokens consumed (all brand-derived via color-mix, see styles/app.css):
//   · --wow-grad-surface → the section's soft radial brand tint background.
//   · --wow-hairline     → card hairline borders.
//   · --wow-shadow-soft / --wow-shadow-glow → card resting lift / hover glow.
//   · --wow-ease-out     → entrance + hover easing.
// BRAND identity → the tr('common.explore') affordance uses text-brand-600. No literal hex.
//
// HONESTY: links are the real per-service relatedServices, filtered through
// isRelatedServiceVisible so an UNPUBLISHED target self-heals out (matches
// ServicePageTemplate). Returns null when nothing remains, no empty section.
export function RelatedServicesBlock({
  service,
}: {
  service: ServicePageData
  variant?: string
}) {
  const reduce = useReducedMotion()
  const related = service.relatedServices.filter((r) => isRelatedServiceVisible(r.href))
  if (related.length === 0) return null

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: 'var(--fam-surface, transparent)', backgroundImage: 'var(--fam-grad-surface, var(--wow-grad-surface))' }}
    >
      <div className="container-x py-16 md:py-24">
        <h2 className="text-center font-display text-3xl leading-tight text-[var(--fam-ink,var(--color-ink-900))] sm:text-4xl">{tr('tmpl.youMayAlsoNeed')}</h2>
        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
          {related.map((r, i) => (
            <motion.div
              key={r.href}
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
                to={r.href}
                className="group flex h-full flex-col justify-between rounded-2xl border bg-white/85 p-7 backdrop-blur-md transition-transform duration-500 hover:-translate-y-1"
                style={{
                  borderColor: 'var(--fam-hairline, var(--wow-hairline))',
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
                <h3 className="font-display text-lg leading-snug text-[var(--fam-ink,var(--color-ink-900))]">{r.label}</h3>
                <span className="mt-3 inline-flex items-center gap-1 font-semibold text-brand-600 transition-all group-hover:gap-2">{tr('common.explore')}<ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
