import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, Sparkles } from 'lucide-react'
import type { PricingPlan } from './pricing-variants'
import { SITE } from '~/data/site'

// Pricing VARIANT: 'luxe-glass', a WOW re-composition of the tiers section. Plans
// sit as premium glass cards on a soft --wow-grad-surface; the real highlighted
// plan is filled with the brand gradient and lit by --wow-shadow-glow, floated a
// touch above the row. Cards lift + glow on hover, staggered whileInView.
//
// WOW tokens consumed (all brand-derived via color-mix, see styles/app.css):
//   · --wow-grad-surface → the section background.
//   · --wow-grad-brand   → the featured tier fill + kicker dot + icon badge.
//   · --wow-shadow-glow  → the featured card + CTA glow; hover glow on plain cards.
//   · --wow-hairline     → the glass card borders.
//   · --wow-ease-out     → entrance easing.
// BRAND identity → the primary CTA uses bg-primary / text-primary-foreground.
//
// HONESTY (hard): renders ONLY real data. Two cases, detected from the data:
//   1. Real plans (SITE.plans) → premium glass tiers with the real featured plan.
//   2. NO plans but a prose `body` (e.g. "prices vary, reach out") → an elegant
//      brand-framed "how pricing works" panel with a CTA and ZERO invented numbers.
//   3. No plans AND no prose → null (never fabricates pricing).
export function PricingLuxeGlassBlock({
  label = 'Pricing',
  heading = 'Simple, transparent pricing',
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const reduce = useReducedMotion()
  const plans = (SITE as { plans?: PricingPlan[] }).plans
  const hasPlans = Array.isArray(plans) && plans.length > 0

  // Honesty guard: no real tiers AND no prose to frame → omit entirely.
  if (!hasPlans && !body) return null

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundImage: 'var(--wow-grad-surface)' }}
    >
      <div className="container-x py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center justify-center gap-2.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-700">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundImage: 'var(--wow-grad-brand)' }}
            />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-5xl">
            {heading}
          </h2>
          {body && <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-ink-700">{body}</p>}
        </div>

        {hasPlans ? (
          <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 items-stretch gap-6 md:grid-cols-3">
            {plans.slice(0, 3).map((p, i) => {
              const featured = Boolean(p.highlighted)
              return (
                <motion.div
                  key={`${p.name}-${i}`}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.6, delay: reduce ? 0 : i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={reduce ? undefined : { y: -6 }}
                  className={`group relative flex flex-col rounded-[1.5rem] border p-8 backdrop-blur-md ${
                    featured ? 'text-white md:-mt-4 md:pb-12' : 'bg-white/70 text-ink-900'
                  }`}
                  style={{
                    borderColor: 'var(--wow-hairline)',
                    ...(featured
                      ? { backgroundImage: 'var(--wow-grad-brand)', boxShadow: 'var(--wow-shadow-glow)' }
                      : { boxShadow: 'var(--wow-shadow-soft)' }),
                  }}
                >
                  {featured && (
                    <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 font-display text-xs font-semibold text-white backdrop-blur-sm">
                      <Sparkles className="h-3.5 w-3.5" /> Most popular
                    </span>
                  )}
                  <h3 className={`font-display text-lg font-semibold ${featured ? 'text-white' : 'text-ink-900'}`}>
                    {p.name}
                  </h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className={`font-display text-4xl font-semibold tracking-tight ${featured ? 'text-white' : 'text-ink-900'}`}>
                      {p.price}
                    </span>
                    {p.period && <span className={featured ? 'text-white/75' : 'text-ink-500'}>{p.period}</span>}
                  </div>
                  {p.features && p.features.length > 0 && (
                    <ul className="mt-7 flex flex-1 flex-col gap-3 text-sm">
                      {p.features.map((f) => (
                        <li key={f} className={`flex items-start gap-2.5 ${featured ? 'text-white/90' : 'text-ink-700'}`}>
                          <Check className={`mt-0.5 h-4 w-4 shrink-0 ${featured ? 'text-white' : 'text-brand-600'}`} /> {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link
                    to="/contact"
                    className={`mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 font-display text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
                      featured
                        ? 'bg-white text-ink-900'
                        : 'bg-primary text-primary-foreground'
                    }`}
                    style={featured ? undefined : { boxShadow: 'var(--wow-shadow-glow)' }}
                  >
                    Get started <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              )
            })}
          </div>
        ) : (
          // Prose-only case, a brand-framed "how pricing works" panel, no numbers.
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto mt-12 max-w-2xl overflow-hidden rounded-[1.75rem] border bg-white/70 p-10 text-center backdrop-blur-md md:p-14"
            style={{ borderColor: 'var(--wow-hairline)', boxShadow: 'var(--wow-shadow-soft)' }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-1"
              style={{ backgroundImage: 'var(--wow-grad-brand)' }}
            />
            <span
              className="mx-auto grid h-14 w-14 place-items-center rounded-2xl text-white"
              style={{ backgroundImage: 'var(--wow-grad-brand)', boxShadow: 'var(--wow-shadow-glow)' }}
            >
              <Sparkles className="h-6 w-6" />
            </span>
            <p className="mx-auto mt-6 max-w-lg font-display text-xl leading-relaxed text-ink-800">
              Every project is a little different, reach out and we'll put together
              a fair, tailored quote for exactly what you need.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex h-[52px] items-center gap-2 rounded-full bg-primary px-8 font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              style={{ boxShadow: 'var(--wow-shadow-glow)' }}
            >
              Request a quote <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
