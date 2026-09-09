import { Link } from '@tanstack/react-router'
import { Check, CreditCard } from 'lucide-react'
import type { Financing } from './financing-variants'
import { SITE } from '~/data/site'

// Financing LAYOUT: 'highlight-band', a prominent band announcing financing, with
// the options as a checklist and the provider named. Character-agnostic. OMIT-WHEN-
// ABSENT: SITE.financing via cast; absent -> null, never fabricates terms.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> fam-accent-* (DNA)
// 50/100/600/700: fam-accent-soft icon, fam-accent checks. Radius -> rounded-* (DNA).
// Font -> font-display (DNA). Light surface component-owned. Never bg-brand-*.
export function FinancingHighlightBandBlock({
  site = SITE,
  label = 'Financing',
}: {
  site?: typeof SITE
  label?: string
  heading?: string
  body?: string
}) {
  const fin = (site as { financing?: Financing }).financing
  if (!fin) return null
  return (
    <section className="bg-fam-surface-2">
      <div className="container-x py-section">
        <div className="overflow-hidden rounded-3xl border border-fam-hairline bg-fam-card p-8 md:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-fam-accent-soft"><CreditCard className="h-4 w-4" /></span>
                {label}
              </span>
              <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-4xl">{fin.headline}</h2>
              {fin.partner && <p className="mt-3 text-fam-ink-muted">In partnership with <span className="font-display font-semibold text-fam-ink">{fin.partner}</span></p>}
              <Link to="/contact" className="mt-7 inline-flex h-12 items-center rounded-xl bg-cta px-7 font-display text-sm font-semibold text-cta-foreground transition-opacity hover:opacity-90">Check your options</Link>
            </div>
            {fin.options.length > 0 && (
              <ul className="grid gap-4 sm:grid-cols-2">
                {fin.options.map((o) => (
                  <li key={o} className="flex items-start gap-3 rounded-2xl border border-fam-hairline bg-fam-surface-2 p-5">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-fam-accent-text" />
                    <span className="font-display font-medium text-fam-ink">{o}</span>
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
