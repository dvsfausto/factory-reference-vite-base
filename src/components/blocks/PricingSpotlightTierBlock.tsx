import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import type { PricingPlan } from './pricing-variants'
import { SITE } from '~/data/site'

// Pricing VARIANT: 'spotlight-tier', an asymmetric WOW composition: the real
// featured plan is spotlighted as a large brand-gradient card on the left, lit by
// --wow-shadow-glow; the remaining plans stack as compact glass rows on the right.
// The editorial counterpart to 'luxe-glass' (which is a symmetric glass row).
//
// WOW tokens consumed (all brand-derived via color-mix, see styles/app.css):
//   · --wow-grad-brand   → the spotlight card fill + kicker dot + side accent.
//   · --wow-grad-surface → the section background.
//   · --wow-shadow-glow  → the spotlight card + CTA glow.
//   · --wow-shadow-soft  → the plain plan rows' shadow.
//   · --wow-hairline     → the glass borders.
//   · --wow-ease-out     → entrance easing.
// BRAND identity → the primary CTA uses bg-primary / text-primary-foreground.
//
// HONESTY (hard): renders ONLY real data. Detects the case from the data:
//   1. Real plans → spotlight the real featured (or first) plan; others as rows.
//   2. NO plans but a prose `body` → a split panel with a brand-gradient accent
//      rail and the prose + CTA, ZERO invented numbers.
//   3. No plans AND no prose → null (never fabricates pricing).
export function PricingSpotlightTierBlock({
  label = tr('nav.pricing'),
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

  if (!hasPlans && !body) return null

  // Choose the spotlight plan honestly: the real highlighted one, else the first.
  let spotlight: PricingPlan | undefined
  let rest: PricingPlan[] = []
  if (hasPlans) {
    const list = plans.slice(0, 4)
    const idx = Math.max(0, list.findIndex((p) => p.highlighted))
    spotlight = list[idx]
    rest = list.filter((_, i) => i !== idx)
  }

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundImage: 'var(--wow-grad-surface)' }}
    >
      <div className="container-x py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-700">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundImage: 'var(--wow-grad-brand)' }}
            />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-5xl">
            {heading}
          </h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-ink-700">{body}</p>}
        </div>

        {hasPlans && spotlight ? (
          <div className="mt-14 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
            {/* Spotlight plan, brand-gradient hero card. */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] p-9 text-white lg:col-span-7 md:p-11"
              style={{ backgroundImage: 'var(--wow-grad-brand)', boxShadow: 'var(--wow-shadow-glow)' }}
            >
              <div>
                <span className="inline-flex w-fit rounded-full bg-white/20 px-3 py-1 font-display text-xs font-semibold text-white backdrop-blur-sm">
                  Most popular
                </span>
                <h3 className="mt-5 font-display text-2xl font-semibold">{spotlight.name}</h3>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="font-display text-6xl font-semibold tracking-tight">{spotlight.price}</span>
                  {spotlight.period && <span className="text-white/75">{spotlight.period}</span>}
                </div>
                {spotlight.features && spotlight.features.length > 0 && (
                  <ul className="mt-8 grid gap-3 text-sm sm:grid-cols-2">
                    {spotlight.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-white/90">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-white" /> {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <Link
                to="/contact"
                className="mt-9 inline-flex h-[52px] w-fit items-center gap-2 rounded-full bg-white px-8 font-semibold text-ink-900 transition-transform hover:-translate-y-0.5"
              >
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            {/* Remaining plans, compact glass rows. */}
            <div className="flex flex-col gap-6 lg:col-span-5">
              {rest.map((p, i) => (
                <motion.div
                  key={`${p.name}-${i}`}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.55, delay: reduce ? 0 : 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={reduce ? undefined : { y: -4 }}
                  className="flex flex-1 flex-col justify-between rounded-[1.5rem] border bg-white/70 p-7 backdrop-blur-md"
                  style={{ borderColor: 'var(--wow-hairline)', boxShadow: 'var(--wow-shadow-soft)' }}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-lg font-semibold text-ink-900">{p.name}</h3>
                    <div className="flex items-baseline gap-1 text-right">
                      <span className="font-display text-2xl font-semibold tracking-tight text-ink-900">{p.price}</span>
                      {p.period && <span className="text-sm text-ink-500">{p.period}</span>}
                    </div>
                  </div>
                  {p.features && p.features.length > 0 && (
                    <ul className="mt-4 flex flex-col gap-2 text-sm">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-ink-700">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" /> {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link
                    to="/contact"
                    className="mt-6 inline-flex h-11 w-fit items-center gap-1.5 rounded-full border px-5 font-display text-sm font-semibold text-brand-800 transition-colors hover:bg-brand-50"
                    style={{ borderColor: 'var(--wow-hairline)' }}
                  >
                    Get started <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          // Prose-only case, a split panel with a brand-gradient accent rail.
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 grid grid-cols-1 overflow-hidden rounded-[1.75rem] border bg-white/70 backdrop-blur-md md:grid-cols-5"
            style={{ borderColor: 'var(--wow-hairline)', boxShadow: 'var(--wow-shadow-soft)' }}
          >
            <div
              className="flex flex-col justify-center p-9 text-white md:col-span-2 md:p-11"
              style={{ backgroundImage: 'var(--wow-grad-brand)' }}
            >
              <h3 className="font-display text-2xl font-semibold leading-tight">Pricing that fits your project</h3>
              <p className="mt-4 leading-relaxed text-white/85">
                No two jobs are the same, so we quote each one on its own terms, with
                no surprises.
              </p>
            </div>
            <div className="flex flex-col justify-center p-9 md:col-span-3 md:p-11">
              <p className="max-w-lg text-lg leading-relaxed text-ink-800">
                Tell us what you're looking for and we'll get back to you quickly with a
                clear, tailored quote.
              </p>
              <Link
                to="/contact"
                className="mt-7 inline-flex h-[52px] w-fit items-center gap-2 rounded-full bg-primary px-8 font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
                style={{ boxShadow: 'var(--wow-shadow-glow)' }}
              >
                Request a quote <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
