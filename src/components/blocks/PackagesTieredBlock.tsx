import { Link } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import type { ServicePackage } from './packages-variants'
import { SITE } from '~/data/site'

// Packages LAYOUT: 'tiered', escalating good/better/best columns, the popular one
// elevated. Character-agnostic. OMIT-WHEN-ABSENT: SITE.packages via cast; none ->
// null.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> fam-accent-* (DNA)
// 50/100/600/700. Radius -> rounded-* (DNA). Font -> font-display (DNA). Dark
// elevated column (slate-950) component-owned. Never bg-brand-* / .btn.
export function PackagesTieredBlock({
  site = SITE,
  label = 'Packages',
  heading = 'Pick your package',
  body,
}: {
  site?: typeof SITE
  label?: string
  heading?: string
  body?: string
}) {
  const packages = (site as { packages?: ServicePackage[] }).packages
  if (!packages || packages.length === 0) return null
  return (
    <section className="bg-fam-surface-2">
      <div className="container-x py-section">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
            <span className="h-px w-6 bg-fam-accent" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">{heading}</h2>
          {body && <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-fam-ink-muted">{body}</p>}
        </div>
        <div className="mt-12 grid grid-cols-1 items-start gap-6 md:grid-cols-3">
          {packages.slice(0, 3).map((p, i) => (
            <div key={`${p.name}-${i}`} className={`flex flex-col rounded-3xl p-8 ${p.popular ? 'bg-slate-950 text-white ring-1 ring-fam-accent md:-mt-4 md:pb-12' : 'border border-fam-hairline bg-white'}`}>
              {p.popular && <span className="mb-4 inline-flex w-fit rounded-full bg-fam-accent-soft px-3 py-1 font-display text-xs font-semibold text-fam-accent-text-strong">Most popular</span>}
              <h3 className={`font-display text-lg font-semibold ${p.popular ? 'text-white' : 'text-fam-ink'}`}>{p.name}</h3>
              <div className={`mt-3 font-display text-4xl font-semibold tracking-tight ${p.popular ? 'text-white' : 'text-fam-ink'}`}>{p.price}</div>
              {p.includes && p.includes.length > 0 && (
                <ul className="mt-7 flex flex-1 flex-col gap-3 text-sm">
                  {p.includes.map((it) => (
                    <li key={it} className={`flex items-start gap-2.5 ${p.popular ? 'text-slate-200' : 'text-fam-ink-muted'}`}><Check className="mt-0.5 h-4 w-4 shrink-0 text-fam-accent-text" /> {it}</li>
                  ))}
                </ul>
              )}
              <Link to="/contact" className={`mt-8 inline-flex h-12 items-center justify-center rounded-xl px-6 font-display text-sm font-semibold transition-opacity hover:opacity-90 ${p.popular ? 'bg-primary text-primary-foreground' : 'border border-fam-hairline text-fam-ink hover:border-fam-accent hover:text-fam-accent-text-strong'}`}>Choose</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
