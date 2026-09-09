import { Link } from '@tanstack/react-router'
import { Check, Package } from 'lucide-react'
import type { ServicePackage } from './packages-variants'
import { SITE } from '~/data/site'

// Packages LAYOUT: 'bundle-cards', a few large bundle cards, each leading with
// what it INCLUDES and a popular badge. Character-agnostic. OMIT-WHEN-ABSENT:
// SITE.packages via cast; none -> null, never fabricates a bundle.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> fam-accent-* (DNA)
// 50/100/600/700: fam-accent ring + checks, fam-accent-soft badge/icon. Radius ->
// rounded-* (DNA). Font -> font-display (DNA). Light surface component-owned.
export function PackagesBundleCardsBlock({
  site = SITE,
  label = 'Packages',
  heading = 'Service packages',
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
        <div className="mt-12 grid grid-cols-1 items-start gap-6 md:grid-cols-3">
          {packages.slice(0, 3).map((p, i) => (
            <div key={`${p.name}-${i}`} className={`flex flex-col rounded-3xl border bg-fam-card p-8 ${p.popular ? 'border-fam-accent ring-1 ring-fam-accent' : 'border-fam-hairline'}`}>
              <div className="flex items-center justify-between gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-fam-accent-soft text-fam-accent-text"><Package className="h-5 w-5" /></span>
                {p.popular && <span className="rounded-full bg-fam-accent-soft px-3 py-1 font-display text-xs font-semibold text-fam-accent-text-strong">Most popular</span>}
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-fam-ink">{p.name}</h3>
              <div className="mt-2 font-display text-3xl font-semibold tracking-tight text-fam-ink">{p.price}</div>
              {p.includes && p.includes.length > 0 && (
                <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm">
                  {p.includes.map((it) => (
                    <li key={it} className="flex items-start gap-2.5 text-fam-ink-muted"><Check className="mt-0.5 h-4 w-4 shrink-0 text-fam-accent-text" /> {it}</li>
                  ))}
                </ul>
              )}
              <Link to="/contact" className={`mt-8 inline-flex h-12 items-center justify-center rounded-xl px-6 font-display text-sm font-semibold transition-opacity hover:opacity-90 ${p.popular ? 'bg-cta text-cta-foreground' : 'border border-fam-hairline text-fam-ink hover:border-fam-accent hover:text-fam-accent-text-strong'}`}>Choose package</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
