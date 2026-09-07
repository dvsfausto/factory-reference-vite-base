import { ArrowUpRight } from 'lucide-react'
import type { CaseStudy } from './case-studies-variants'
import { SITE } from '~/data/site'

// Case Studies LAYOUT: 'list', editorial hairline rows, outcome-forward: a big
// result figure beside the title + summary. Character-agnostic, no imagery needed.
// OMIT-WHEN-ABSENT: SITE.caseStudies via cast; none -> null. result/client
// graceful.
//
// TOKEN DISCIPLINE: accent -> fam-accent-* (DNA) 50/100/600/700: fam-accent-text-strong result.
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
          {studies.slice(0, 8).map((s, i) => (
            <div key={`${s.title}-${i}`} className="grid grid-cols-1 gap-3 border-b border-fam-hairline py-8 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-3">
                {s.result && <div className="font-display text-3xl font-semibold tracking-tight text-fam-accent-text-strong">{s.result}</div>}
                {s.client && <div className="mt-1 text-sm font-medium text-fam-ink-muted">{s.client}</div>}
              </div>
              <div className="md:col-span-9">
                <h3 className="flex items-start gap-2 font-display text-xl font-semibold tracking-tight text-fam-ink">
                  {s.title} <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-fam-accent-text" />
                </h3>
                <p className="mt-2 leading-relaxed text-fam-ink-muted">{s.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
