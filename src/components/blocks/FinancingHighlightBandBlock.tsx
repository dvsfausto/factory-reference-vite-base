import { Link } from '@tanstack/react-router'
import { Check, CreditCard } from 'lucide-react'
import type { Financing } from './financing-variants'
import { SITE } from '~/data/site'

// Financing LAYOUT: 'highlight-band' — a prominent band announcing financing, with
// the options as a checklist and the provider named. Character-agnostic. OMIT-WHEN-
// ABSENT: SITE.financing via cast; absent -> null, never fabricates terms.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> emerald-* (DNA)
// 50/100/600/700: emerald-50 icon, emerald-600 checks. Radius -> rounded-* (DNA).
// Font -> font-display (DNA). Light surface component-owned. Never bg-brand-*.
export function FinancingHighlightBandBlock({
  label = 'Financing',
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const fin = (SITE as { financing?: Financing }).financing
  if (!fin) return null
  return (
    <section className="bg-[#F8FAFC]">
      <div className="container-x py-16 md:py-20">
        <div className="overflow-hidden rounded-3xl border border-[#E6E8EC] bg-white p-8 md:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-50"><CreditCard className="h-4 w-4" /></span>
                {label}
              </span>
              <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-4xl">{fin.headline}</h2>
              {fin.partner && <p className="mt-3 text-[#64748B]">In partnership with <span className="font-display font-semibold text-[#0F172A]">{fin.partner}</span></p>}
              <Link to="/contact" className="mt-7 inline-flex h-12 items-center rounded-xl bg-primary px-7 font-display text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">Check your options</Link>
            </div>
            {fin.options.length > 0 && (
              <ul className="grid gap-4 sm:grid-cols-2">
                {fin.options.map((o) => (
                  <li key={o} className="flex items-start gap-3 rounded-2xl border border-[#E6E8EC] bg-[#F8FAFC] p-5">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <span className="font-display font-medium text-[#0F172A]">{o}</span>
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
