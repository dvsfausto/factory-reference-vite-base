import { Link } from '@tanstack/react-router'
import { Check, Minus } from 'lucide-react'
import type { PricingPlan } from './pricing-variants'
import { SITE } from '~/data/site'

// Pricing LAYOUT: 'comparison-table', a feature matrix: every feature across all
// plans becomes a row, each plan a column, with a check or dash per cell. The
// right call when plans differ by capability and buyers compare line by line.
// Character-agnostic.
//
// OMIT-WHEN-ABSENT: plans from optional SITE.plans via cast; no plans -> null,
// never fabricates pricing. The feature universe is derived from the plans' own
// features (deduped), so the table reflects real data only.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary / text-primary-foreground. Accent ->
// emerald-* (DNA) 50/100/600/700: emerald-600 checks, emerald-50 highlighted
// column wash. Radius -> rounded-* (DNA). Font -> font-display (DNA). Light surface
// component-owned (white / slate / #E6E8EC). Never bg-brand-* / .btn.
export function PricingComparisonTableBlock({
  label = 'Pricing',
  heading = 'Compare plans',
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const plans = (SITE as { plans?: PricingPlan[] }).plans
  if (!plans || plans.length === 0) return null
  const cols = plans.slice(0, 4)
  const allFeatures: string[] = []
  for (const p of cols) for (const f of p.features ?? []) if (!allFeatures.includes(f)) allFeatures.push(f)

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

        <div className="mt-12 overflow-x-auto rounded-2xl border border-[#E6E8EC] bg-white">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#E6E8EC]">
                <th className="p-6 align-bottom" />
                {cols.map((p, i) => (
                  <th key={`${p.name}-${i}`} className={`p-6 align-bottom ${p.highlighted ? 'bg-emerald-50' : ''}`}>
                    <div className="font-display text-base font-semibold text-[#0F172A]">{p.name}</div>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="font-display text-2xl font-semibold tracking-tight text-[#0F172A]">{p.price}</span>
                      {p.period && <span className="text-sm text-[#64748B]">{p.period}</span>}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allFeatures.map((f) => (
                <tr key={f} className="border-b border-[#E6E8EC] last:border-0">
                  <td className="p-5 text-sm font-medium text-[#475569]">{f}</td>
                  {cols.map((p, i) => (
                    <td key={`${p.name}-${i}`} className={`p-5 ${p.highlighted ? 'bg-emerald-50' : ''}`}>
                      {(p.features ?? []).includes(f) ? (
                        <Check className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <Minus className="h-5 w-5 text-[#CBD5E1]" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="p-5" />
                {cols.map((p, i) => (
                  <td key={`${p.name}-${i}`} className={`p-5 ${p.highlighted ? 'bg-emerald-50' : ''}`}>
                    <Link
                      to="/contact"
                      className={`inline-flex h-11 items-center justify-center rounded-xl px-5 font-display text-sm font-semibold transition-opacity hover:opacity-90 ${
                        p.highlighted
                          ? 'bg-primary text-primary-foreground'
                          : 'border border-[#E6E8EC] text-[#0F172A] hover:border-emerald-600'
                      }`}
                    >
                      Choose
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
