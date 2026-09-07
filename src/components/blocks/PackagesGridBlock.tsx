import { Link } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import type { ServicePackage } from './packages-variants'
import { SITE } from '~/data/site'

// Packages LAYOUT: 'grid', a compact, denser grid of package cards (good when
// there are several bundles). Character-agnostic. OMIT-WHEN-ABSENT: SITE.packages
// via cast; none -> null.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> fam-accent-* (DNA)
// 50/100/600/700. Radius -> rounded-* (DNA). Font -> font-display (DNA). Cool
// surface component-owned (#F8FAFC / white cards / #E6E8EC). Never bg-brand-*.
export function PackagesGridBlock({
  site = SITE,
  label = 'Packages',
  heading = 'Browse packages',
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
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
            <span className="h-px w-6 bg-fam-accent" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">{heading}</h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-fam-ink-muted">{body}</p>}
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {packages.slice(0, 6).map((p, i) => (
            <Link key={`${p.name}-${i}`} to="/contact" className={`group flex flex-col rounded-2xl border bg-white p-6 transition-all hover:shadow-md ${p.popular ? 'border-fam-accent' : 'border-fam-hairline hover:border-fam-accent'}`}>
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-base font-semibold text-fam-ink">{p.name}</h3>
                <span className="font-display text-lg font-semibold text-fam-accent-text-strong">{p.price}</span>
              </div>
              {p.includes && p.includes.length > 0 && (
                <ul className="mt-4 flex flex-1 flex-col gap-2 text-sm text-fam-ink-muted">
                  {p.includes.slice(0, 5).map((it) => (
                    <li key={it} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-fam-accent-text" /> {it}</li>
                  ))}
                </ul>
              )}
              {p.popular && <span className="mt-4 w-fit rounded-full bg-fam-accent-soft px-2.5 py-0.5 font-display text-xs font-semibold text-fam-accent-text-strong">Popular</span>}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
