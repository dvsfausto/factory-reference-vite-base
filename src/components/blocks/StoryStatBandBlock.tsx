import { SITE } from '~/data/site'
import { tr } from '~/lib/i18n'

// Story LAYOUT: 'stat-band' — a band of headline metrics (years in business, jobs
// done, rating, …). Character-agnostic. OMIT-WHEN-ABSENT: stats read from optional
// SITE.stats via cast; no stats -> null, never fabricates numbers.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700: emerald-600 figures.
// Radius -> rounded-* (DNA). Font -> font-display (DNA). Dark band (slate-950)
// component-owned. No CTA by design. Never bg-brand-* / .btn.
export function StoryStatBandBlock({
  label = tr('section.byTheNumbers'),
  heading,
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const stats = (SITE as { stats?: { value: string; label: string }[] }).stats
  if (!stats || stats.length === 0) return null
  return (
    <section className="bg-slate-950 text-white">
      <div className="container-x py-20 md:py-28">
        {(heading || body) && (
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="inline-flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
              <span className="h-px w-6 bg-emerald-600" />
              {label}
            </span>
            {heading && (
              <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{heading}</h2>
            )}
            {body && <p className="mt-4 text-lg leading-relaxed text-slate-300">{body}</p>}
          </div>
        )}
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
          {stats.slice(0, 4).map((s, i) => (
            <div key={`${s.label}-${i}`} className="text-center">
              <div className="font-display text-5xl font-semibold tracking-tight text-emerald-100 sm:text-6xl">{s.value}</div>
              <div className="mt-3 text-sm uppercase tracking-[0.14em] text-slate-300">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
