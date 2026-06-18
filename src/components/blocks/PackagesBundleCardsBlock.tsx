import { Link } from '@tanstack/react-router'
import { Check, Package } from 'lucide-react'
import type { ServicePackage } from './packages-variants'
import { SITE } from '~/data/site'

// Packages LAYOUT: 'bundle-cards' — a few large bundle cards, each leading with
// what it INCLUDES and a popular badge. Character-agnostic. OMIT-WHEN-ABSENT:
// SITE.packages via cast; none -> null, never fabricates a bundle.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> emerald-* (DNA)
// 50/100/600/700: emerald-600 ring + checks, emerald-50 badge/icon. Radius ->
// rounded-* (DNA). Font -> font-display (DNA). Light surface component-owned.
export function PackagesBundleCardsBlock({
  label = 'Packages',
  heading = 'Service packages',
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const packages = (SITE as { packages?: ServicePackage[] }).packages
  if (!packages || packages.length === 0) return null
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
        <div className="mt-12 grid grid-cols-1 items-start gap-6 md:grid-cols-3">
          {packages.slice(0, 3).map((p, i) => (
            <div key={`${p.name}-${i}`} className={`flex flex-col rounded-3xl border bg-white p-8 ${p.popular ? 'border-emerald-600 ring-1 ring-emerald-600' : 'border-[#E6E8EC]'}`}>
              <div className="flex items-center justify-between gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><Package className="h-5 w-5" /></span>
                {p.popular && <span className="rounded-full bg-emerald-50 px-3 py-1 font-display text-xs font-semibold text-emerald-700">Most popular</span>}
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-[#0F172A]">{p.name}</h3>
              <div className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#0F172A]">{p.price}</div>
              {p.includes && p.includes.length > 0 && (
                <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm">
                  {p.includes.map((it) => (
                    <li key={it} className="flex items-start gap-2.5 text-[#475569]"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {it}</li>
                  ))}
                </ul>
              )}
              <Link to="/contact" className={`mt-8 inline-flex h-12 items-center justify-center rounded-xl px-6 font-display text-sm font-semibold transition-opacity hover:opacity-90 ${p.popular ? 'bg-primary text-primary-foreground' : 'border border-[#E6E8EC] text-[#0F172A] hover:border-emerald-600 hover:text-emerald-700'}`}>Choose package</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
