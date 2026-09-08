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
// fam-accent-* (DNA) 50/100/600/700: fam-accent accent rail + checks. Radius ->
// rounded-* (DNA). Font -> font-display (DNA). Light surface component-owned
// (section #F8FAFC, white cards, #E6E8EC). Never bg-brand-* / .btn.
export function PricingCardsBlock({
  site = SITE,
  label = 'Pricing',
  heading = 'Pick the plan that fits',
  body,
}: {
  site?: typeof SITE
  label?: string
  heading?: string
  body?: string
}) {
  const plans = (site as { plans?: PricingPlan[] }).plans
  if (!plans || plans.length === 0) return null
  const cards = plans.slice(0, 4)
  return (
    <section className="bg-fam-surface-2">
      <div className="container-x py-section">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
            <span className="h-px w-6 bg-fam-accent" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">
            {heading}
          </h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-fam-ink-muted">{body}</p>}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((p, i) => (
            <div
              key={`${p.name}-${i}`}
              className={`group flex flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition-all hover:shadow-md ${
                p.highlighted ? 'border-fam-accent' : 'border-fam-hairline'
              }`}
            >
              <div className={`h-1.5 w-full ${p.highlighted ? 'bg-fam-accent' : 'bg-fam-hairline'}`} />
              <div className="flex flex-1 flex-col p-8">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-lg font-semibold text-fam-ink">{p.name}</h3>
                  {p.highlighted && (
                    <span className="rounded-full bg-fam-accent-soft px-3 py-1 font-display text-xs font-semibold text-fam-accent-text-strong">
                      Popular
                    </span>
                  )}
                </div>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-semibold tracking-tight text-fam-ink">{p.price}</span>
                  {p.period && <span className="text-fam-ink-muted">{p.period}</span>}
                </div>
                {p.features && p.features.length > 0 && (
                  <ul className="mt-7 flex flex-1 flex-col gap-3 text-sm">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-fam-ink-muted">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-fam-accent-text" /> {f}
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  to="/contact"
                  className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-cta px-6 font-display text-sm font-semibold text-cta-foreground transition-opacity hover:opacity-90"
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
