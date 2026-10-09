import { paragraphs } from '~/lib/paragraphs'
import { Fold, SHORT_SERVICE_COPY } from '~/components/Fold'
import { VISUAL_SERVICE_PAGES, guideHrefFor } from '~/lib/service-pages'
import { tr } from '~/lib/i18n'
import { motion, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { ServicePageData } from '~/lib/types/page-types'

// SERVICE-DETAIL VARIANT (Arc 3 · Stage C): renders THIS service's `whatWeBuy`
// section, the "what we cover" lead content, as a WOW composition: a headline +
// intro body over a grid of check-marked glass tiles. Per-item content flows in via
// the `service` prop (ctx.service from the route), so the SAME block serves every
// service page with its OWN copy. This is the block analogue of ServicePageTemplate's
// "WHAT WE COVER" section (which it replaces on the detail route).
//
// WOW tokens consumed (all brand-derived via color-mix, see styles/app.css):
//   · --wow-grad-surface → the section's soft radial brand tint background.
//   · --wow-hairline     → tile hairline borders.
//   · --wow-shadow-soft  → tile resting lift.
//   · --wow-ease-out     → entrance easing.
// BRAND identity → the check badge uses --wow-grad-brand; the accent uses
// var(--primary) via bg-primary/text-primary-foreground. No literal brand hex.
//
// HONESTY: renders ONLY the real per-service body + items. Returns null when there
// is no body AND no items (nothing to say → nothing shown), matching the honest
// empty-omit behaviour of ServicePageTemplate. The items grid itself only renders
// when there are items, a body-only service shows just the headline + body.
export function ServiceWhatWeCoverBlock({
  service,
}: {
  service: ServicePageData
  variant?: string
}) {
  const reduce = useReducedMotion()
  const { whatWeBuy } = service
  const hasBody = Boolean(whatWeBuy.body)
  const hasItems = whatWeBuy.items.length > 0
  if (!hasBody && !hasItems) return null

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: 'var(--fam-surface, transparent)', backgroundImage: 'var(--fam-grad-surface, var(--wow-grad-surface))' }}
    >
      <div className="container-x py-section">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl leading-tight text-[var(--fam-ink,var(--color-ink-900))] sm:text-4xl">
            {whatWeBuy.title}
          </h2>
          {hasBody && (() => {
            const ps = paragraphs(whatWeBuy.body)
            const para = (p: string, i: number) => <p key={i} className="text-lg leading-relaxed text-[var(--fam-ink,var(--color-ink-700))]">{p}</p>
            // visual service page: ONE paragraph on the page; every other word is on the service's guide post, linked here
            // only when the guide exists: between a setting change and the next build the prose stays on the page
            const guide = VISUAL_SERVICE_PAGES ? guideHrefFor(service.slug) : null
            if (guide) {
              return (
                <div className="mt-4 space-y-4">
                  {para(ps[0]!, 0)}
                  {ps.length > 1 && <p><a href={guide} className="font-sans text-[15px] font-semibold text-[var(--fam-ink,var(--color-ink-900))] underline-offset-4 hover:underline">{tr('service.readGuide')} ↗</a></p>}
                </div>
              )
            }
            // short service copy: the first paragraph open, the rest behind Read more (the same words)
            return SHORT_SERVICE_COPY && ps.length > 1 ? (
              <div className="mt-4 space-y-4">{para(ps[0]!, 0)}<Fold>{<div className="space-y-4">{ps.slice(1).map((p, i) => para(p, i + 1))}</div>}</Fold></div>
            ) : (
              <div className="mt-4 space-y-4">{ps.map(para)}</div>
            )
          })()}
        </div>

        {hasItems && !(VISUAL_SERVICE_PAGES && guideHrefFor(service.slug)) && (
          <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            {whatWeBuy.items.map((item, i) => (
              <motion.li
                key={i}
                initial={false}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{
                  duration: 0.5,
                  delay: reduce ? 0 : Math.min(i * 0.06, 0.36),
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-start gap-3.5 rounded-2xl border bg-fam-card/80 p-5 backdrop-blur-md"
                style={{
                  borderColor: 'var(--fam-hairline, var(--wow-hairline))',
                  boxShadow: 'var(--wow-shadow-soft)',
                }}
              >
                <span
                  className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg text-fam-on-dark"
                  style={{ backgroundImage: 'var(--wow-grad-brand)' }}
                >
                  <Check className="h-4 w-4" />
                </span>
                <span className="leading-relaxed text-[var(--fam-ink,var(--color-ink-900))]">{item}</span>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
