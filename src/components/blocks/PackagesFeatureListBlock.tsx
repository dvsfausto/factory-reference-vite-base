import { Link } from '@tanstack/react-router'
import { ArrowRight, Check } from 'lucide-react'
import type { ServicePackage } from './packages-variants'
import { SITE } from '~/data/site'

// Packages LAYOUT: 'feature-list', each package a full-width detailed row: name +
// price on the left, the complete includes list laid out on the right. Character-
// agnostic. The thorough, menu-style read. OMIT-WHEN-ABSENT: SITE.packages via
// cast; none -> null.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> emerald-* (DNA)
// 50/100/600/700. Radius -> rounded-* (DNA). Font -> font-display (DNA). Light
// surface component-owned (white / slate / hairline #E6E8EC). Never bg-brand-*.
export function PackagesFeatureListBlock({
  label = 'Packages',
  heading = "What's included",
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
        <div className="mt-12 border-t border-[#E6E8EC]">
          {packages.map((p, i) => (
            <div key={`${p.name}-${i}`} className="grid grid-cols-1 gap-6 border-b border-[#E6E8EC] py-10 md:grid-cols-12 md:gap-10">
              <div className="md:col-span-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-[#0F172A]">{p.name}</h3>
                  {p.popular && <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-display text-xs font-semibold text-emerald-700">Popular</span>}
                </div>
                <div className="mt-2 font-display text-3xl font-semibold tracking-tight text-emerald-700">{p.price}</div>
                <Link to="/contact" className="group mt-5 inline-flex items-center gap-2 font-display text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                  Choose this package <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              {p.includes && p.includes.length > 0 && (
                <ul className="grid gap-x-8 gap-y-3 text-sm text-[#475569] md:col-span-8 md:grid-cols-2">
                  {p.includes.map((it) => (
                    <li key={it} className="flex items-start gap-2.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {it}</li>
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
