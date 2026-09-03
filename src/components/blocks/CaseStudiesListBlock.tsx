import { ArrowUpRight } from 'lucide-react'
import type { CaseStudy } from './case-studies-variants'
import { SITE } from '~/data/site'

// Case Studies LAYOUT: 'list', editorial hairline rows, outcome-forward: a big
// result figure beside the title + summary. Character-agnostic, no imagery needed.
// OMIT-WHEN-ABSENT: SITE.caseStudies via cast; none -> null. result/client
// graceful.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700: emerald-700 result.
// Radius -> rounded-* (DNA). Font -> font-display (DNA). Light surface component-
// owned (white / slate / hairline #E6E8EC). Never bg-brand-* / .btn.
export function CaseStudiesListBlock({
  site = SITE,
  label = 'Case studies',
  heading = 'Outcomes, in brief',
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
        <div className="mt-12 border-t border-[#E6E8EC]">
          {studies.slice(0, 8).map((s, i) => (
            <div key={`${s.title}-${i}`} className="grid grid-cols-1 gap-3 border-b border-[#E6E8EC] py-8 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-3">
                {s.result && <div className="font-display text-3xl font-semibold tracking-tight text-emerald-700">{s.result}</div>}
                {s.client && <div className="mt-1 text-sm font-medium text-[#64748B]">{s.client}</div>}
              </div>
              <div className="md:col-span-9">
                <h3 className="flex items-start gap-2 font-display text-xl font-semibold tracking-tight text-[#0F172A]">
                  {s.title} <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                </h3>
                <p className="mt-2 leading-relaxed text-[#475569]">{s.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
