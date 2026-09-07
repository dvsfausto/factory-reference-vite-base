import { Link } from '@tanstack/react-router'
import { ArrowRight, Check } from 'lucide-react'
import type { ServicePackage } from './packages-variants'
import { SITE } from '~/data/site'

// Packages LAYOUT: 'feature-list', each package a full-width detailed row: name +
// price on the left, the complete includes list laid out on the right. Character-
// agnostic. The thorough, menu-style read. OMIT-WHEN-ABSENT: SITE.packages via
// cast; none -> null.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> fam-accent-* (DNA)
// 50/100/600/700. Radius -> rounded-* (DNA). Font -> font-display (DNA). Light
// surface component-owned (white / slate / hairline #E6E8EC). Never bg-brand-*.
export function PackagesFeatureListBlock({
  site = SITE,
  label = 'Packages',
  heading = "What's included",
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
    <section className="bg-white">
      <div className="container-x py-section">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
            <span className="h-px w-6 bg-fam-accent" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">{heading}</h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-fam-ink-muted">{body}</p>}
        </div>
        <div className="mt-12 border-t border-fam-hairline">
          {packages.map((p, i) => (
            <div key={`${p.name}-${i}`} className="grid grid-cols-1 gap-6 border-b border-fam-hairline py-10 md:grid-cols-12 md:gap-10">
              <div className="md:col-span-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-fam-ink">{p.name}</h3>
                  {p.popular && <span className="rounded-full bg-fam-accent-soft px-2.5 py-0.5 font-display text-xs font-semibold text-fam-accent-text-strong">Popular</span>}
                </div>
                <div className="mt-2 font-display text-3xl font-semibold tracking-tight text-fam-accent-text-strong">{p.price}</div>
                <Link to="/contact" className="group mt-5 inline-flex items-center gap-2 font-display text-sm font-semibold text-fam-accent-text hover:text-fam-accent-text-strong">
                  Choose this package <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              {p.includes && p.includes.length > 0 && (
                <ul className="grid gap-x-8 gap-y-3 text-sm text-fam-ink-muted md:col-span-8 md:grid-cols-2">
                  {p.includes.map((it) => (
                    <li key={it} className="flex items-start gap-2.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-fam-accent-text" /> {it}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
