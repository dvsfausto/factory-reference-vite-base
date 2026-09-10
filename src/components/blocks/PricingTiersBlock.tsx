import { Link } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import type { PricingPlan } from './pricing-variants'
import { SITE } from '~/data/site'

// Pricing LAYOUT: 'tiers', the classic connected column of plans, the highlighted
// plan scaled up with a "Most popular" badge. Character-agnostic. The default.
//
// OMIT-WHEN-ABSENT: plans read from optional SITE.plans via inline cast (the
// SITE.surface / hero video_url precedent). No plans -> the section returns null;
// it NEVER fabricates pricing. features / period / highlighted are per-plan
// optional with graceful fallbacks.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary / text-primary-foreground (BRAND-
// owned). Accent -> fam-accent-* (DNA) restricted to 50/100/600/700: fam-accent
// ring + checks, fam-accent-soft badge. Radius -> rounded-* (DNA). Font -> font-display
// (DNA). Light surface component-owned (white / slate / #E6E8EC). Never bg-brand-*.
export function PricingTiersBlock({
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
  if (!plans || plans.length === 0) return null
  return (
    <section className="bg-fam-card">
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

        <div className="mt-12 grid grid-cols-1 items-start gap-6 md:grid-cols-3">
          {plans.slice(0, 3).map((p, i) => (
            <div
              key={`${p.name}-${i}`}
              className={`flex flex-col rounded-3xl p-8 ${
                p.highlighted
                  ? 'bg-fam-panel text-fam-on-dark shadow-(--elev-4) ring-1 ring-fam-accent md:-mt-4 md:pb-12'
                  : 'border border-fam-hairline bg-fam-card'
              }`}
            >
              {p.highlighted && (
                <span className="mb-4 inline-flex w-fit rounded-full bg-fam-accent-soft px-3 py-1 font-display text-xs font-semibold text-fam-accent-text-strong">
                  Most popular
                </span>
              )}
              <h3 className={`font-display text-lg font-semibold ${p.highlighted ? 'text-fam-on-dark' : 'text-fam-ink'}`}>
                {p.name}
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className={`font-display text-4xl font-semibold tracking-tight ${p.highlighted ? 'text-fam-on-dark' : 'text-fam-ink'}`}>
                  {p.price}
                </span>
                {p.period && <span className={p.highlighted ? 'text-slate-300' : 'text-fam-ink-muted'}>{p.period}</span>}
              </div>
              {p.features && p.features.length > 0 && (
                <ul className="mt-7 flex flex-1 flex-col gap-3 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2.5 ${p.highlighted ? 'text-slate-200' : 'text-fam-ink-muted'}`}>
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-fam-accent-text" /> {f}
                    </li>
                  ))}
                </ul>
              )}
              <Link
                to="/contact"
                className={`mt-8 inline-flex h-12 items-center justify-center rounded-xl px-6 font-display text-sm font-semibold transition-opacity hover:opacity-(--hov-fade) ${
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
