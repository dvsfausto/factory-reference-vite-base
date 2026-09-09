import { TrendingUp } from 'lucide-react'
import type { CaseStudy } from './case-studies-variants'
import { SITE } from '~/data/site'

// Case Studies LAYOUT: 'grid', a card grid of outcomes (image when present,
// title, summary, result chip, client). Character-agnostic. OMIT-WHEN-ABSENT:
// SITE.caseStudies via cast; none -> null. image/result/client graceful.
//
// TOKEN DISCIPLINE: accent -> fam-accent-* (DNA) 50/100/600/700. Radius -> rounded-*
// (DNA). Font -> font-display (DNA). Cool surface component-owned (#F8FAFC / white
// cards / #E6E8EC). Never bg-brand-* / .btn.
export function CaseStudiesGridBlock({
  site = SITE,
  label = 'Case studies',
  heading = 'Selected work',
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
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {studies.slice(0, 6).map((s, i) => (
            <article key={`${s.title}-${i}`} className="flex flex-col overflow-hidden rounded-2xl border border-fam-hairline bg-fam-card">
              {s.image ? (
                <div className="aspect-[16/10] overflow-hidden"><img src={s.image} alt={s.title} loading="lazy" className="h-full w-full object-cover" /></div>
              ) : (
                s.result && <div className="flex items-center gap-2 border-b border-fam-hairline bg-fam-accent-soft px-6 py-5"><TrendingUp className="h-5 w-5 text-fam-accent-text" /><span className="font-display text-2xl font-semibold tracking-tight text-fam-accent-text-strong">{s.result}</span></div>
              )}
              <div className="flex flex-1 flex-col p-6">
                {s.image && s.result && <span className="mb-2 w-fit rounded-full bg-fam-accent-soft px-2.5 py-0.5 font-display text-xs font-semibold text-fam-accent-text-strong">{s.result}</span>}
                <h3 className="font-display text-lg font-semibold tracking-tight text-fam-ink">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-fam-ink-muted">{s.summary}</p>
                {s.client && <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-fam-ink-faint">{s.client}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
