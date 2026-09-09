import { TrendingUp } from 'lucide-react'
import type { CaseStudy } from './case-studies-variants'
import { SITE } from '~/data/site'

// Case Studies LAYOUT: 'carousel', a horizontal scroll-snap row of outcome cards.
// Character-agnostic, CSS-only (SSR-safe). OMIT-WHEN-ABSENT: SITE.caseStudies via
// cast; none -> null. image/result/client graceful.
//
// TOKEN DISCIPLINE: accent -> fam-accent-* (DNA) 50/100/600/700. Radius -> rounded-*
// (DNA). Font -> font-display (DNA). Light surface component-owned. Never
// bg-brand-* / .btn.
export function CaseStudiesCarouselBlock({
  site = SITE,
  label = 'Case studies',
  heading = 'Recent outcomes',
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
    <section className="bg-fam-card">
      <div className="container-x py-section">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
              <span className="h-px w-6 bg-fam-accent" />
              {label}
            </span>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">{heading}</h2>
            {body && <p className="mt-4 text-lg leading-relaxed text-fam-ink-muted">{body}</p>}
          </div>
          <span className="font-display text-sm font-medium text-fam-ink-muted">Scroll for more →</span>
        </div>
      </div>
      <div className="relative">
        <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pb-6 [scrollbar-width:thin]">
          {studies.map((s, i) => (
            <article key={`${s.title}-${i}`} className="flex w-[320px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-fam-hairline bg-fam-card md:w-[400px]">
              {s.image ? (
                <div className="aspect-[16/10] overflow-hidden"><img src={s.image} alt={s.title} loading="lazy" className="h-full w-full object-cover" /></div>
              ) : (
                s.result && <div className="flex items-center gap-2 border-b border-fam-hairline bg-fam-accent-soft px-6 py-5"><TrendingUp className="h-5 w-5 text-fam-accent-text" /><span className="font-display text-2xl font-semibold tracking-tight text-fam-accent-text-strong">{s.result}</span></div>
              )}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-lg font-semibold tracking-tight text-fam-ink">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-fam-ink-muted">{s.summary}</p>
                {s.client && <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-fam-ink-faint">{s.client}</p>}
              </div>
            </article>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l from-fam-card to-transparent md:block" />
      </div>
    </section>
  )
}
