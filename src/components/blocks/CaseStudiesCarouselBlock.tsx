import { TrendingUp } from 'lucide-react'
import type { CaseStudy } from './case-studies-variants'
import { SITE } from '~/data/site'

// Case Studies LAYOUT: 'carousel', a horizontal scroll-snap row of outcome cards.
// Character-agnostic, CSS-only (SSR-safe). OMIT-WHEN-ABSENT: SITE.caseStudies via
// cast; none -> null. image/result/client graceful.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700. Radius -> rounded-*
// (DNA). Font -> font-display (DNA). Light surface component-owned. Never
// bg-brand-* / .btn.
export function CaseStudiesCarouselBlock({
  label = 'Case studies',
  heading = 'Recent outcomes',
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const studies = (SITE as { caseStudies?: CaseStudy[] }).caseStudies
  if (!studies || studies.length === 0) return null
  return (
    <section className="bg-white">
      <div className="container-x py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              <span className="h-px w-6 bg-emerald-600" />
              {label}
            </span>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">{heading}</h2>
            {body && <p className="mt-4 text-lg leading-relaxed text-[#64748B]">{body}</p>}
          </div>
          <span className="font-display text-sm font-medium text-[#64748B]">Scroll for more →</span>
        </div>
      </div>
      <div className="relative">
        <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pb-6 [scrollbar-width:thin]">
          {studies.map((s, i) => (
            <article key={`${s.title}-${i}`} className="flex w-[320px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-[#E6E8EC] bg-white md:w-[400px]">
              {s.image ? (
                <div className="aspect-[16/10] overflow-hidden"><img src={s.image} alt={s.title} loading="lazy" className="h-full w-full object-cover" /></div>
              ) : (
                s.result && <div className="flex items-center gap-2 border-b border-[#E6E8EC] bg-emerald-50 px-6 py-5"><TrendingUp className="h-5 w-5 text-emerald-600" /><span className="font-display text-2xl font-semibold tracking-tight text-emerald-700">{s.result}</span></div>
              )}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-lg font-semibold tracking-tight text-[#0F172A]">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#64748B]">{s.summary}</p>
                {s.client && <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">{s.client}</p>}
              </div>
            </article>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l from-white to-transparent md:block" />
      </div>
    </section>
  )
}
