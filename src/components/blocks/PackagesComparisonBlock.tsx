import { Link } from '@tanstack/react-router'
import { Check, Minus } from 'lucide-react'
import type { ServicePackage } from './packages-variants'
import { SITE } from '~/data/site'

// Packages LAYOUT: 'comparison', an includes matrix across packages (each
// included item a row, each package a column). Character-agnostic. OMIT-WHEN-
// ABSENT: SITE.packages via cast; none -> null. The item universe is derived from
// the data only.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> fam-accent-* (DNA)
// 50/100/600/700: fam-accent checks, fam-accent-soft popular column. Radius ->
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
    <section className="bg-fam-card">
      <div className="container-x py-section">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
            <span className="h-px w-6 bg-fam-accent" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">{heading}</h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-fam-ink-muted">{body}</p>}
        </div>
        <div className="mt-12 overflow-x-auto rounded-2xl border border-fam-hairline">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-fam-hairline">
                <th className="p-6" />
                {cols.map((p, i) => (
                  <th key={`${p.name}-${i}`} className={`p-6 align-bottom ${p.popular ? 'bg-fam-accent-soft' : ''}`}>
                    <div className="font-display text-base font-semibold text-fam-ink">{p.name}</div>
                    <div className="mt-2 font-display text-2xl font-semibold tracking-tight text-fam-ink">{p.price}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allItems.map((it) => (
                <tr key={it} className="border-b border-fam-hairline last:border-0">
                  <td className="p-5 text-sm font-medium text-fam-ink-muted">{it}</td>
                  {cols.map((p, i) => (
                    <td key={`${p.name}-${i}`} className={`p-5 ${p.popular ? 'bg-fam-accent-soft' : ''}`}>
                      {(p.includes ?? []).includes(it) ? <Check className="h-5 w-5 text-fam-accent-text" /> : <Minus className="h-5 w-5 text-fam-line-2" />}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="p-5" />
                {cols.map((p, i) => (
                  <td key={`${p.name}-${i}`} className={`p-5 ${p.popular ? 'bg-fam-accent-soft' : ''}`}>
                    <Link to="/contact" className={`inline-flex h-11 items-center justify-center rounded-xl px-5 font-display text-sm font-semibold transition-[filter] hover:brightness-(--hov-shade) ${p.popular ? 'bg-cta text-cta-foreground' : 'border border-fam-hairline text-fam-ink hover:border-fam-accent'}`}>Choose</Link>
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
