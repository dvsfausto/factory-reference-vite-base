import { Link } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import type { ServicePackage } from './packages-variants'
import { SITE } from '~/data/site'

// Packages LAYOUT: 'tiered', escalating good/better/best columns, the popular one
// elevated. Character-agnostic. OMIT-WHEN-ABSENT: SITE.packages via cast; none ->
// null.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> emerald-* (DNA)
// 50/100/600/700. Radius -> rounded-* (DNA). Font -> font-display (DNA). Dark
// elevated column (slate-950) component-owned. Never bg-brand-* / .btn.
export function PackagesTieredBlock({
  label = 'Packages',
  heading = 'Pick your package',
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const packages = (SITE as { packages?: ServicePackage[] }).packages
  if (!packages || packages.length === 0) return null
  return (
    <section className="bg-[#F8FAFC]">
      <div className="container-x py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            <span className="h-px w-6 bg-emerald-600" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">{heading}</h2>
          {body && <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-[#64748B]">{body}</p>}
        </div>
        <div className="mt-12 grid grid-cols-1 items-start gap-6 md:grid-cols-3">
          {packages.slice(0, 3).map((p, i) => (
            <div key={`${p.name}-${i}`} className={`flex flex-col rounded-3xl p-8 ${p.popular ? 'bg-slate-950 text-white ring-1 ring-emerald-600 md:-mt-4 md:pb-12' : 'border border-[#E6E8EC] bg-white'}`}>
              {p.popular && <span className="mb-4 inline-flex w-fit rounded-full bg-emerald-50 px-3 py-1 font-display text-xs font-semibold text-emerald-700">Most popular</span>}
              <h3 className={`font-display text-lg font-semibold ${p.popular ? 'text-white' : 'text-[#0F172A]'}`}>{p.name}</h3>
              <div className={`mt-3 font-display text-4xl font-semibold tracking-tight ${p.popular ? 'text-white' : 'text-[#0F172A]'}`}>{p.price}</div>
              {p.includes && p.includes.length > 0 && (
                <ul className="mt-7 flex flex-1 flex-col gap-3 text-sm">
                  {p.includes.map((it) => (
                    <li key={it} className={`flex items-start gap-2.5 ${p.popular ? 'text-slate-200' : 'text-[#475569]'}`}><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {it}</li>
                  ))}
                </ul>
              )}
              <Link to="/contact" className={`mt-8 inline-flex h-12 items-center justify-center rounded-xl px-6 font-display text-sm font-semibold transition-opacity hover:opacity-90 ${p.popular ? 'bg-primary text-primary-foreground' : 'border border-[#E6E8EC] text-[#0F172A] hover:border-emerald-600 hover:text-emerald-700'}`}>Choose</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
