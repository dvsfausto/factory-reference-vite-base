import { TrendingUp } from 'lucide-react'
import type { CaseStudy } from './case-studies-variants'
import { SITE } from '~/data/site'

// Case Studies LAYOUT: 'alternating-rows', full-width zigzag rows, image (or an
// outcome panel) trading sides with the narrative. Character-agnostic. OMIT-WHEN-
// ABSENT: SITE.caseStudies via cast; none -> null. image/result/client graceful.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700. Radius -> rounded-*
// (DNA). Font -> font-display (DNA). Light surface component-owned. Never
// bg-brand-* / .btn.
export function CaseStudiesAlternatingRowsBlock({
  site = SITE,
  label = 'Case studies',
  heading = 'How we help',
  body,
}: {
  site?: typeof SITE
  label?: string
  heading?: string
  body?: string
}) {
  const studies = (site as { caseStudies?: CaseStudy[] }).caseStudies
  if (!studies || studies.length === 0) return null
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
        <div className="mt-16 space-y-20 md:mt-20 md:space-y-28">
          {studies.slice(0, 5).map((s, i) => (
            <div key={`${s.title}-${i}`} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className={`overflow-hidden rounded-3xl border border-[#E6E8EC] ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                {s.image ? (
                  <img src={s.image} alt={s.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                ) : (
                  <div className="flex aspect-[4/3] flex-col items-center justify-center bg-slate-950 p-10 text-center">
                    {s.result && <span className="font-display text-5xl font-semibold tracking-tight text-emerald-100">{s.result}</span>}
                    <span className="mt-3 text-sm uppercase tracking-[0.14em] text-slate-400">Outcome</span>
                  </div>
                )}
              </div>
              <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                {s.result && <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 font-display text-xs font-semibold text-emerald-700"><TrendingUp className="h-3.5 w-3.5" /> {s.result}</span>}
                <h3 className="mt-4 font-display text-3xl font-semibold tracking-tight text-[#0F172A]">{s.title}</h3>
                <p className="mt-4 max-w-md text-lg leading-relaxed text-[#64748B]">{s.summary}</p>
                {s.client && <p className="mt-5 font-display text-sm font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">{s.client}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
