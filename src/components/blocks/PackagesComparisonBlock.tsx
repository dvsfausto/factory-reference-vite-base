import { Link } from '@tanstack/react-router'
import { Check, Minus } from 'lucide-react'
import type { ServicePackage } from './packages-variants'
import { SITE } from '~/data/site'

// Packages LAYOUT: 'comparison', an includes matrix across packages (each
// included item a row, each package a column). Character-agnostic. OMIT-WHEN-
// ABSENT: SITE.packages via cast; none -> null. The item universe is derived from
// the data only.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> emerald-* (DNA)
// 50/100/600/700: emerald-600 checks, emerald-50 popular column. Radius ->
// rounded-* (DNA). Font -> font-display (DNA). Light surface component-owned.
export function PackagesComparisonBlock({
  site = SITE,
  label = 'Packages',
  heading = 'Compare packages',
  body,
}: {
  site?: typeof SITE
  label?: string
  heading?: string
  body?: string
}) {
  const packages = (site as { packages?: ServicePackage[] }).packages
  if (!packages || packages.length === 0) return null
  const cols = packages.slice(0, 4)
  const allItems: string[] = []
  for (const p of cols) for (const it of p.includes ?? []) if (!allItems.includes(it)) allItems.push(it)
  return (
    <section className="bg-white">
      <div className="container-x py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            <span className="h-px w-6 bg-emerald-600" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">{heading}</h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-[#64748B]">{body}</p>}
        </div>
        <div className="mt-12 overflow-x-auto rounded-2xl border border-[#E6E8EC]">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#E6E8EC]">
                <th className="p-6" />
                {cols.map((p, i) => (
                  <th key={`${p.name}-${i}`} className={`p-6 align-bottom ${p.popular ? 'bg-emerald-50' : ''}`}>
                    <div className="font-display text-base font-semibold text-[#0F172A]">{p.name}</div>
                    <div className="mt-2 font-display text-2xl font-semibold tracking-tight text-[#0F172A]">{p.price}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allItems.map((it) => (
                <tr key={it} className="border-b border-[#E6E8EC] last:border-0">
                  <td className="p-5 text-sm font-medium text-[#475569]">{it}</td>
                  {cols.map((p, i) => (
                    <td key={`${p.name}-${i}`} className={`p-5 ${p.popular ? 'bg-emerald-50' : ''}`}>
                      {(p.includes ?? []).includes(it) ? <Check className="h-5 w-5 text-emerald-600" /> : <Minus className="h-5 w-5 text-[#CBD5E1]" />}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="p-5" />
                {cols.map((p, i) => (
                  <td key={`${p.name}-${i}`} className={`p-5 ${p.popular ? 'bg-emerald-50' : ''}`}>
                    <Link to="/contact" className={`inline-flex h-11 items-center justify-center rounded-xl px-5 font-display text-sm font-semibold transition-opacity hover:opacity-90 ${p.popular ? 'bg-primary text-primary-foreground' : 'border border-[#E6E8EC] text-[#0F172A] hover:border-emerald-600'}`}>Choose</Link>
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
