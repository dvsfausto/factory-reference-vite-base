import { TrendingUp } from 'lucide-react'
import type { CaseStudy } from './case-studies-variants'
import { SITE } from '~/data/site'

// Case Studies LAYOUT: 'grid', a card grid of outcomes (image when present,
// title, summary, result chip, client). Character-agnostic. OMIT-WHEN-ABSENT:
// SITE.caseStudies via cast; none -> null. image/result/client graceful.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700. Radius -> rounded-*
// (DNA). Font -> font-display (DNA). Cool surface component-owned (#F8FAFC / white
// cards / #E6E8EC). Never bg-brand-* / .btn.
export function CaseStudiesGridBlock({
  label = 'Case studies',
  heading = 'Selected work',
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const studies = (SITE as { caseStudies?: CaseStudy[] }).caseStudies
  if (!studies || studies.length === 0) return null
  return (
    <section className="bg-[#F8FAFC]">
      <div className="container-x py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            <span className="h-px w-6 bg-emerald-600" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">{heading}</h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-[#64748B]">{body}</p>}
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {studies.slice(0, 6).map((s, i) => (
            <article key={`${s.title}-${i}`} className="flex flex-col overflow-hidden rounded-2xl border border-[#E6E8EC] bg-white">
              {s.image ? (
                <div className="aspect-[16/10] overflow-hidden"><img src={s.image} alt={s.title} loading="lazy" className="h-full w-full object-cover" /></div>
              ) : (
                s.result && <div className="flex items-center gap-2 border-b border-[#E6E8EC] bg-emerald-50 px-6 py-5"><TrendingUp className="h-5 w-5 text-emerald-600" /><span className="font-display text-2xl font-semibold tracking-tight text-emerald-700">{s.result}</span></div>
              )}
              <div className="flex flex-1 flex-col p-6">
                {s.image && s.result && <span className="mb-2 w-fit rounded-full bg-emerald-50 px-2.5 py-0.5 font-display text-xs font-semibold text-emerald-700">{s.result}</span>}
                <h3 className="font-display text-lg font-semibold tracking-tight text-[#0F172A]">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#64748B]">{s.summary}</p>
                {s.client && <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">{s.client}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
