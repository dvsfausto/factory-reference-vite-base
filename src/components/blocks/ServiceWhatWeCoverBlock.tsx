import { motion, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { ServicePageData } from '~/lib/types/page-types'

// SERVICE-DETAIL VARIANT (Arc 3 · Stage C): renders THIS service's `whatWeBuy`
// section — the "what we cover" lead content — as a WOW composition: a headline +
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
// when there are items — a body-only service shows just the headline + body.
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
      style={{ backgroundImage: 'var(--wow-grad-surface)' }}
    >
      <div className="container-x py-16 md:py-24">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl leading-tight text-ink-900 sm:text-4xl">
            {whatWeBuy.title}
          </h2>
          {hasBody && (
            <p className="mt-4 text-lg leading-relaxed text-ink-700">{whatWeBuy.body}</p>
          )}
        </div>

        {hasItems && (
          <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            {whatWeBuy.items.map((item, i) => (
              <motion.li
                key={i}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{
                  duration: 0.5,
                  delay: reduce ? 0 : Math.min(i * 0.06, 0.36),
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-start gap-3.5 rounded-2xl border bg-white/80 p-5 backdrop-blur-md"
                style={{
                  borderColor: 'var(--wow-hairline)',
                  boxShadow: 'var(--wow-shadow-soft)',
                }}
              >
                <span
                  className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg text-white"
                  style={{ backgroundImage: 'var(--wow-grad-brand)' }}
                >
                  <Check className="h-4 w-4" />
                </span>
                <span className="leading-relaxed text-ink-800">{item}</span>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
