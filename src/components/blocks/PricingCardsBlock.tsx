import { Link } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import type { PricingPlan } from './pricing-variants'
import { SITE } from '~/data/site'

// Pricing LAYOUT: 'cards', standalone elevated plan cards in an airy grid, each
// with a thin accent rail and a soft shadow. Character-agnostic. Distinct from
// 'tiers' (connected columns): these read as independent, equally-weighted offers
// with room to breathe, good for 2-4 plans.
//
// OMIT-WHEN-ABSENT: plans from optional SITE.plans via cast; no plans -> null,
// never fabricates pricing.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary / text-primary-foreground. Accent ->
// emerald-* (DNA) 50/100/600/700: emerald-600 accent rail + checks. Radius ->
// rounded-* (DNA). Font -> font-display (DNA). Light surface component-owned
// (section #F8FAFC, white cards, #E6E8EC). Never bg-brand-* / .btn.
export function PricingCardsBlock({
  label = 'Pricing',
  heading = 'Pick the plan that fits',
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const plans = (SITE as { plans?: PricingPlan[] }).plans
  if (!plans || plans.length === 0) return null
  const cards = plans.slice(0, 4)
  return (
    <section className="bg-[#F8FAFC]">
      <div className="container-x py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            <span className="h-px w-6 bg-emerald-600" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">
            {heading}
          </h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-[#64748B]">{body}</p>}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((p, i) => (
            <div
              key={`${p.name}-${i}`}
              className={`group flex flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition-all hover:shadow-md ${
                p.highlighted ? 'border-emerald-600' : 'border-[#E6E8EC]'
              }`}
            >
              <div className={`h-1.5 w-full ${p.highlighted ? 'bg-emerald-600' : 'bg-[#E6E8EC]'}`} />
              <div className="flex flex-1 flex-col p-8">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-lg font-semibold text-[#0F172A]">{p.name}</h3>
                  {p.highlighted && (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 font-display text-xs font-semibold text-emerald-700">
                      Popular
                    </span>
                  )}
                </div>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-semibold tracking-tight text-[#0F172A]">{p.price}</span>
                  {p.period && <span className="text-[#64748B]">{p.period}</span>}
                </div>
                {p.features && p.features.length > 0 && (
                  <ul className="mt-7 flex flex-1 flex-col gap-3 text-sm">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[#475569]">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {f}
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  to="/contact"
                  className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 font-display text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Get started
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
