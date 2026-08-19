import { Link } from '@tanstack/react-router'
import { ArrowUpRight, TrendingUp } from 'lucide-react'
import type { CaseStudy } from './case-studies-variants'
import { SITE } from '~/data/site'

// Case Studies LAYOUT: 'featured', one hero case study with image + outcome,
// plus a column of supporting ones. Character-agnostic. OMIT-WHEN-ABSENT:
// SITE.caseStudies via cast; none -> null. image/result/client shown only when
// present (graceful; results never invented).
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700: emerald-50 result
// chip, emerald-600. Radius -> rounded-* (DNA). Font -> font-display (DNA). Light
// surface component-owned (white / slate / #E6E8EC). Never bg-brand-* / .btn.
export function CaseStudiesFeaturedBlock({
  label = 'Case studies',
  heading = 'Results that speak',
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const studies = (SITE as { caseStudies?: CaseStudy[] }).caseStudies
  if (!studies || studies.length === 0) return null
  const [hero, ...rest] = studies
  const supporting = rest.slice(0, 3)
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
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <article className="overflow-hidden rounded-3xl border border-[#E6E8EC] lg:col-span-2">
            {hero.image ? (
              <div className="aspect-[16/9] overflow-hidden"><img src={hero.image} alt={hero.title} className="h-full w-full object-cover" /></div>
            ) : (
              <div className="flex aspect-[16/9] items-center justify-center bg-slate-950 p-10">
                {hero.result && <span className="font-display text-5xl font-semibold tracking-tight text-emerald-100">{hero.result}</span>}
              </div>
            )}
            <div className="p-8">
              {hero.result && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 font-display text-xs font-semibold text-emerald-700"><TrendingUp className="h-3.5 w-3.5" /> {hero.result}</span>
              )}
              <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-[#0F172A]">{hero.title}</h3>
              <p className="mt-3 leading-relaxed text-[#475569]">{hero.summary}</p>
              {hero.client && <p className="mt-4 font-display text-sm font-semibold text-[#64748B]">{hero.client}</p>}
            </div>
          </article>
          <div className="flex flex-col gap-6">
            {supporting.map((s, i) => (
              <article key={`${s.title}-${i}`} className="flex flex-1 flex-col rounded-2xl border border-[#E6E8EC] p-6">
                {s.result && <span className="font-display text-2xl font-semibold tracking-tight text-emerald-700">{s.result}</span>}
                <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-[#0F172A]">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#64748B]">{s.summary}</p>
                {s.client && <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">{s.client}</p>}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
