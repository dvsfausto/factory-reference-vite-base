import type { ProcessStep } from './process-variants'
import { tr } from '~/lib/i18n'
import { getProcessIcon } from './process-icons'
import { SITE } from '~/data/site'

// Process LAYOUT: 'alternating', a vertical spine with steps zigzagging left and
// right of a centered connector. Character-agnostic. OMIT-WHEN-ABSENT: steps from
// optional SITE.steps via cast; no steps -> null, never fabricates.
//
// TOKEN DISCIPLINE: accent -> fam-accent-* (DNA) 50/100/600/700: fam-accent nodes,
// fam-accent-soft-2 spine. Radius -> rounded-* (DNA). Font -> font-display (DNA). Light
// surface component-owned (white / slate / #E6E8EC). No CTA by design.
export function ProcessAlternatingBlock({
  site = SITE,
  label = tr('section.howItWorks'),
  heading = tr('section.stepByStep'),
  body,
}: {
  site?: typeof SITE
  label?: string
  heading?: string
  body?: string
}) {
  const steps = (site as { steps?: ProcessStep[] }).steps
  if (!steps || steps.length === 0) return null
  const items = steps.slice(0, 6)
  return (
    <section className="bg-white">
      <div className="container-x py-section">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
            <span className="h-px w-6 bg-fam-accent" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">
            {heading}
          </h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-fam-ink-muted">{body}</p>}
        </div>

        <div className="relative mx-auto mt-16 max-w-4xl">
          <span className="absolute left-6 top-0 h-full w-0.5 bg-fam-accent-soft-2 md:left-1/2 md:-translate-x-1/2" />
          <div className="flex flex-col gap-12">
            {items.map((s, i) => {
              const Icon = getProcessIcon(s.icon)
              const right = i % 2 === 1
              return (
                <div key={`${s.title}-${i}`} className="relative grid grid-cols-1 items-center gap-4 md:grid-cols-2 md:gap-12">
                  <span className="absolute left-6 top-1 z-10 grid h-7 w-7 -translate-x-1/2 place-items-center rounded-full bg-fam-accent font-display text-xs font-semibold text-white md:left-1/2">
                    {i + 1}
                  </span>
                  <div className={`pl-16 md:pl-0 ${right ? 'md:order-2 md:pl-12' : 'md:pr-12 md:text-right'}`}>
                    <h3 className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-fam-ink md:justify-start">
                      {Icon && <Icon className="h-5 w-5 text-fam-accent-text" />} {s.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-fam-ink-muted">{s.description}</p>
                  </div>
                  <div className={right ? 'md:order-1' : ''} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
