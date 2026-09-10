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
// fam-accent-* (DNA) 50/100/600/700: fam-accent checks, fam-accent-soft highlighted
// column wash. Radius -> rounded-* (DNA). Font -> font-display (DNA). Light surface
// component-owned (white / slate / #E6E8EC). Never bg-brand-* / .btn.
export function PricingComparisonTableBlock({
  site = SITE,
  label = 'Pricing',
  heading = 'Compare plans',
  body,
}: {
  site?: typeof SITE
  label?: string
  heading?: string
  body?: string
}) {
  const plans = (site as { plans?: PricingPlan[] }).plans
  if (!plans || plans.length === 0) return null
  const cols = plans.slice(0, 4)
  const allFeatures: string[] = []
  for (const p of cols) for (const f of p.features ?? []) if (!allFeatures.includes(f)) allFeatures.push(f)

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

        <div className="mt-12 overflow-x-auto rounded-2xl border border-fam-hairline bg-fam-card">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-fam-hairline">
                <th className="p-6 align-bottom" />
                {cols.map((p, i) => (
                  <th key={`${p.name}-${i}`} className={`p-6 align-bottom ${p.highlighted ? 'bg-fam-accent-soft' : ''}`}>
                    <div className="font-display text-base font-semibold text-fam-ink">{p.name}</div>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="font-display text-2xl font-semibold tracking-tight text-fam-ink">{p.price}</span>
                      {p.period && <span className="text-sm text-fam-ink-muted">{p.period}</span>}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allFeatures.map((f) => (
                <tr key={f} className="border-b border-fam-hairline last:border-0">
                  <td className="p-5 text-sm font-medium text-fam-ink-muted">{f}</td>
                  {cols.map((p, i) => (
                    <td key={`${p.name}-${i}`} className={`p-5 ${p.highlighted ? 'bg-fam-accent-soft' : ''}`}>
                      {(p.features ?? []).includes(f) ? (
                        <Check className="h-5 w-5 text-fam-accent-text" />
                      ) : (
                        <Minus className="h-5 w-5 text-fam-line-2" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="p-5" />
                {cols.map((p, i) => (
                  <td key={`${p.name}-${i}`} className={`p-5 ${p.highlighted ? 'bg-fam-accent-soft' : ''}`}>
                    <Link
                      to="/contact"
                      className={`inline-flex h-11 items-center justify-center rounded-xl px-5 font-display text-sm font-semibold transition-[filter] hover:brightness-(--hov-shade) ${
                        p.highlighted
                          ? 'bg-cta text-cta-foreground'
                          : 'border border-fam-hairline text-fam-ink hover:border-fam-accent'
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
