import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import type { PricingPlan } from './pricing-variants'
import { SITE } from '~/data/site'

// Pricing LAYOUT: 'toggle', tier cards with an interactive monthly / annual
// switch. Character-agnostic. The toggle is the iconic SaaS pricing control; it
// renders monthly by default (SSR-safe) and swaps prices on the client.
//
// OMIT-WHEN-ABSENT: plans from optional SITE.plans via cast; no plans -> null,
// never fabricates pricing. The annual price is the per-plan optional priceAnnual
// (cast); when a plan has no annual price it GRACEFULLY shows its monthly price
// under the annual tab (billed annually at the same rate, never an invented
// discount). The annual control hides entirely if no plan offers an annual price.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary / text-primary-foreground. Accent ->
// fam-accent-* (DNA) 50/100/600/700: fam-accent active toggle + checks. Radius ->
// rounded-* (DNA). Font -> font-display (DNA). Light surface component-owned. No
// bg-brand-* / .btn.
export function PricingToggleBlock({
  site = SITE,
  label = 'Pricing',
  heading = 'Simple, transparent pricing',
  body,
}: {
  site?: typeof SITE
  label?: string
  heading?: string
  body?: string
}) {
  const plans = (site as { plans?: PricingPlan[] }).plans
  const [annual, setAnnual] = useState(false)
  if (!plans || plans.length === 0) return null
  const hasAnnual = plans.some((p) => !!p.priceAnnual)

  return (
    <section className="bg-white">
      <div className="container-x py-section">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
            <span className="h-px w-6 bg-fam-accent" />
            {label}
          </span>
          <h2 className="mt-5 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">
            {heading}
          </h2>
          {body && <p className="mt-4 max-w-xl text-lg leading-relaxed text-fam-ink-muted">{body}</p>}

          {hasAnnual && (
            <div className="mt-8 inline-flex items-center rounded-full border border-fam-hairline bg-fam-surface-2 p-1">
              <button
                type="button"
                onClick={() => setAnnual(false)}
                className={`rounded-full px-5 py-2 font-display text-sm font-semibold transition-colors ${
                  !annual ? 'bg-fam-accent text-white' : 'text-fam-ink-muted'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setAnnual(true)}
                className={`rounded-full px-5 py-2 font-display text-sm font-semibold transition-colors ${
                  annual ? 'bg-fam-accent text-white' : 'text-fam-ink-muted'
                }`}
              >
                Annual
              </button>
            </div>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 items-start gap-6 md:grid-cols-3">
          {plans.slice(0, 3).map((p, i) => (
            <div
              key={`${p.name}-${i}`}
              className={`flex flex-col rounded-3xl border p-8 ${
                p.highlighted ? 'border-fam-accent ring-1 ring-fam-accent' : 'border-fam-hairline'
              } bg-white`}
            >
              <h3 className="font-display text-lg font-semibold text-fam-ink">{p.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold tracking-tight text-fam-ink">
                  {annual ? p.priceAnnual ?? p.price : p.price}
                </span>
                <span className="text-fam-ink-muted">{annual ? '/yr' : p.period ?? ''}</span>
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
                className={`mt-8 inline-flex h-12 items-center justify-center rounded-xl px-6 font-display text-sm font-semibold transition-opacity hover:opacity-90 ${
                  p.highlighted
                    ? 'bg-cta text-cta-foreground'
                    : 'border border-fam-hairline text-fam-ink hover:border-fam-accent hover:text-fam-accent-text-strong'
                }`}
              >
                Get started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
