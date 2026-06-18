import { Link } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import type { PricingPlan } from './pricing-variants'
import { SITE } from '~/data/site'

// Pricing LAYOUT: 'single-highlight' — one plan presented as a single wide, bold
// panel with the price and features laid out generously. Character-agnostic. The
// right call for a business with one core offering (or a clear flagship plan).
//
// OMIT-WHEN-ABSENT: plans from optional SITE.plans via cast; no plans -> null,
// never fabricates pricing. Picks the plan marked highlighted, else the first.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary / text-primary-foreground. Accent ->
// emerald-* (DNA) 50/100/600/700: emerald-100 on the dark panel, emerald-600 rail.
// Radius -> rounded-* (DNA). Font -> font-display (DNA). Dark panel (slate-950)
// component-owned. Never bg-brand-* / .btn.
export function PricingSingleHighlightBlock({
  label = 'Pricing',
  heading = 'One simple plan',
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const plans = (SITE as { plans?: PricingPlan[] }).plans
  if (!plans || plans.length === 0) return null
  const plan = plans.find((p) => p.highlighted) ?? plans[0]!
  return (
    <section className="bg-white">
      <div className="container-x py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            <span className="h-px w-6 bg-emerald-600" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">
            {heading}
          </h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-[#64748B]">{body}</p>}
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl">
          <div className="grid gap-8 p-8 md:grid-cols-5 md:p-12">
            <div className="md:col-span-2 md:border-r md:border-white/10 md:pr-10">
              <h3 className="font-display text-2xl font-semibold">{plan.name}</h3>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-display text-6xl font-semibold tracking-tight">{plan.price}</span>
                {plan.period && <span className="text-slate-300">{plan.period}</span>}
              </div>
              <Link
                to="/contact"
                className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-7 font-display text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Get started
              </Link>
            </div>
            {plan.features && plan.features.length > 0 && (
              <ul className="grid gap-3 text-sm md:col-span-3 md:grid-cols-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-slate-200">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-100" /> {f}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
