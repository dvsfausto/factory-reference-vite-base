import { Link } from '@tanstack/react-router'
import type { Financing } from './financing-variants'
import { SITE } from '~/data/site'

// Financing LAYOUT: 'steps' — the financing options presented as a numbered
// vertical sequence (a clear, walk-through read). Character-agnostic. OMIT-WHEN-
// ABSENT: SITE.financing via cast; absent -> null, never fabricates terms. The
// numbers index the real options — no invented process copy.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> emerald-* (DNA)
// 50/100/600/700: emerald-600 numerals, emerald-100 rail. Radius -> rounded-*
// (DNA). Font -> font-display (DNA). Cool surface component-owned. Never bg-brand-*.
export function FinancingStepsBlock({
  label = 'Financing',
  heading,
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const fin = (SITE as { financing?: Financing }).financing
  if (!fin) return null
  return (
    <section className="bg-[#F8FAFC]">
      <div className="container-x py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            <span className="h-px w-6 bg-emerald-600" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">{heading ?? fin.headline}</h2>
          {fin.partner && <p className="mt-4 text-lg leading-relaxed text-[#64748B]">Powered by {fin.partner}.</p>}
        </div>
        <div className="mt-12 max-w-2xl">
          {fin.options.map((o, i) => {
            const last = i === fin.options.length - 1
            return (
              <div key={`${o}-${i}`} className="relative flex gap-6 pb-8 last:pb-0">
                {!last && <span className="absolute left-[1.375rem] top-12 h-[calc(100%-2rem)] w-0.5 bg-emerald-100" />}
                <span className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-600 font-display text-sm font-semibold text-white">{i + 1}</span>
                <p className="pt-2.5 font-display text-lg font-medium text-[#0F172A]">{o}</p>
              </div>
            )
          })}
        </div>
        <div className="mt-10">
          <Link to="/contact" className="inline-flex h-12 items-center rounded-xl bg-primary px-7 font-display text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">Get pre-qualified</Link>
        </div>
      </div>
    </section>
  )
}
