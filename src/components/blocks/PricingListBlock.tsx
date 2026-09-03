import { Link } from '@tanstack/react-router'
import { ArrowRight, Check } from 'lucide-react'
import type { PricingPlan } from './pricing-variants'
import { SITE } from '~/data/site'

// Pricing LAYOUT: 'list', compact hairline-separated rows, each plan a single
// line of name + price + inline features + action. Character-agnostic. The
// restrained, scannable option when there are several plans or the page is dense.
//
// OMIT-WHEN-ABSENT: plans from optional SITE.plans via cast; no plans -> null,
// never fabricates pricing.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary / text-primary-foreground. Accent ->
// emerald-* (DNA) 50/100/600/700: emerald-600 checks, emerald-50 highlighted row.
// Radius -> rounded-* (DNA). Font -> font-display (DNA). Light surface component-
// owned (white / slate / hairline #E6E8EC). Never bg-brand-* / .btn.
export function PricingListBlock({
  site = SITE,
  label = 'Pricing',
  heading = 'Plans & pricing',
  body,
}: {
  site?: typeof SITE
  label?: string
  heading?: string
  body?: string
}) {
  const plans = (site as { plans?: PricingPlan[] }).plans
  if (!plans || plans.length === 0) return null
  return (
    <section className="bg-white">
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

        <div className="mt-12 overflow-hidden rounded-2xl border border-[#E6E8EC]">
          {plans.map((p, i) => (
            <div
              key={`${p.name}-${i}`}
              className={`grid grid-cols-1 items-center gap-4 border-b border-[#E6E8EC] p-6 last:border-0 md:grid-cols-12 md:gap-6 ${
                p.highlighted ? 'bg-emerald-50' : 'bg-white'
              }`}
            >
              <div className="md:col-span-3">
                <h3 className="font-display text-lg font-semibold text-[#0F172A]">{p.name}</h3>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-display text-2xl font-semibold tracking-tight text-[#0F172A]">{p.price}</span>
                  {p.period && <span className="text-sm text-[#64748B]">{p.period}</span>}
                </div>
              </div>
              <div className="md:col-span-7">
                {p.features && p.features.length > 0 && (
                  <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#475569]">
                    {p.features.map((f) => (
                      <li key={f} className="inline-flex items-center gap-1.5">
                        <Check className="h-4 w-4 shrink-0 text-emerald-600" /> {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="md:col-span-2 md:text-right">
                <Link
                  to="/contact"
                  className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-primary px-5 font-display text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Choose <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
