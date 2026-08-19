import { Link } from '@tanstack/react-router'
import { Wallet } from 'lucide-react'
import type { Financing } from './financing-variants'
import { SITE } from '~/data/site'

// Financing LAYOUT: 'cards', each financing option as its own card. Character-
// agnostic. OMIT-WHEN-ABSENT: SITE.financing via cast; absent -> null, never
// fabricates terms.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> emerald-* (DNA)
// 50/100/600/700: emerald-50 icon chip. Radius -> rounded-* (DNA). Font ->
// font-display (DNA). Light surface component-owned. Never bg-brand-* / .btn.
export function FinancingCardsBlock({
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
    <section className="bg-white">
      <div className="container-x py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            <span className="h-px w-6 bg-emerald-600" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">{heading ?? fin.headline}</h2>
          {fin.partner && <p className="mt-4 text-lg leading-relaxed text-[#64748B]">Flexible plans with {fin.partner}.</p>}
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {fin.options.map((o, i) => (
            <div key={`${o}-${i}`} className="flex flex-col rounded-2xl border border-[#E6E8EC] bg-white p-7">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><Wallet className="h-5 w-5" /></span>
              <p className="mt-5 flex-1 font-display text-lg font-medium leading-snug text-[#0F172A]">{o}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Link to="/contact" className="inline-flex h-12 items-center rounded-xl bg-primary px-7 font-display text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">Apply for financing</Link>
        </div>
      </div>
    </section>
  )
}
