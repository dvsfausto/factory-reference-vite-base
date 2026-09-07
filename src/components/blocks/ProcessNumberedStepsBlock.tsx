import type { ProcessStep } from './process-variants'
import { tr } from '~/lib/i18n'
import { getProcessIcon } from './process-icons'
import { SITE } from '~/data/site'

// Process LAYOUT: 'numbered-steps', a horizontal row of big-numbered steps.
// Character-agnostic. OMIT-WHEN-ABSENT: steps read from optional SITE.steps via
// cast; no steps -> null, never fabricates a process. Each step shows its number
// (or its optional icon when provided).
//
// TOKEN DISCIPLINE: accent -> fam-accent-* (DNA) 50/100/600/700: fam-accent-soft badge,
// fam-accent number/icon. Radius -> rounded-* (DNA). Font -> font-display (DNA).
// Light surface component-owned (white / slate / #E6E8EC). No CTA by design.
export function ProcessNumberedStepsBlock({
  site = SITE,
  label = tr('section.howItWorks'),
  heading = tr('section.simpleProcess'),
  body,
}: {
  site?: typeof SITE
  label?: string
  heading?: string
  body?: string
}) {
  const steps = (site as { steps?: ProcessStep[] }).steps
  if (!steps || steps.length === 0) return null
  return (
    <section className="bg-white">
      <div className="container-x py-section">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
            <span className="h-px w-6 bg-fam-accent" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">
            {heading}
          </h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-fam-ink-muted">{body}</p>}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.slice(0, 4).map((s, i) => {
            const Icon = getProcessIcon(s.icon)
            return (
              <div key={`${s.title}-${i}`} className="flex flex-col">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-fam-accent-soft font-display text-xl font-semibold text-fam-accent-text">
                  {Icon ? <Icon className="h-6 w-6" /> : i + 1}
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-fam-ink">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-fam-ink-muted">{s.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
