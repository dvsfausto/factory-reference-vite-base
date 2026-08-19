import { motion, useReducedMotion } from 'framer-motion'
import { tr } from '~/lib/i18n'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import type { InfoPageData, RelatedLink } from '~/lib/types/page-types'
import { isRelatedServiceVisible } from '~/data/services-view'

// INFO-DETAIL VARIANT (Arc 3 · Stage E): "keep exploring", THIS info page's two
// cross-link groups rendered as WOW glass cards that lift + glow. Per-item via `info`
// (ctx.info). Replaces InfoPageTemplate's related section, mirroring Stage C's
// RelatedServicesBlock but carrying BOTH RelatedLink[] groups:
//   · info.relatedInfo     → tr('related.moreResources')   → links use each link's own href
//                            (the factory emits /info/$slug hrefs)
//   · info.relatedServices → tr('related.relatedServices') → links use each link's own href
//                            (the factory emits /services/$slug hrefs), filtered
//                            through isRelatedServiceVisible so an UNPUBLISHED target
//                            self-heals out (matches InfoPageTemplate + Stage C).
//
// WOW tokens consumed (all brand-derived via color-mix, see styles/app.css):
//   · --wow-grad-surface → the section's soft radial brand tint background.
//   · --wow-hairline     → card hairline borders.
//   · --wow-shadow-soft / --wow-shadow-glow → card resting lift / hover glow.
// BRAND identity → the tr('common.explore') affordance uses text-brand-600. No literal hex.
//
// HONESTY: each group omits when its own list is empty; the whole block returns null
// when both are empty, no empty section, no fabricated links.
function LinkGroup({
  heading,
  links,
}: {
  heading: string
  links: RelatedLink[]
}) {
  const reduce = useReducedMotion()
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-700">
        {heading}
      </p>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {links.map((r, i) => (
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
              className="group flex h-full flex-col justify-between rounded-2xl border bg-white/85 p-6 backdrop-blur-md transition-transform duration-500 hover:-translate-y-1"
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
  )
}

export function RelatedInfoBlock({
  info,
}: {
  info: InfoPageData
  variant?: string
}) {
  const relatedInfo = info.relatedInfo
  const relatedServices = info.relatedServices.filter((r) =>
    isRelatedServiceVisible(r.href),
  )

  const showInfo = relatedInfo.length > 0
  const showServices = relatedServices.length > 0
  if (!showInfo && !showServices) return null

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundImage: 'var(--wow-grad-surface)' }}
    >
      <div className="container-x py-16 md:py-24">
        <h2 className="text-center font-display text-3xl leading-tight text-[var(--fam-ink,var(--color-ink-900))] sm:text-4xl">{tr('related.keepExploring')}</h2>
        <div className="mx-auto mt-10 max-w-4xl space-y-12">
          {showInfo && <LinkGroup heading={tr('related.moreResources')} links={relatedInfo} />}
          {showServices && (
            <LinkGroup heading={tr('related.relatedServices')} links={relatedServices} />
          )}
        </div>
      </div>
    </section>
  )
}
