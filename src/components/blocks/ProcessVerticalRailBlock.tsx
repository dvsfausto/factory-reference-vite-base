import type { ProcessStep } from './process-variants'
import { tr } from '~/lib/i18n'
import { getProcessIcon } from './process-icons'
import { SITE } from '~/data/site'

// Process LAYOUT: 'vertical-rail', a single left-aligned column with a continuous
// rail threading numbered badges, content to the right. Character-agnostic.
// OMIT-WHEN-ABSENT: steps from optional SITE.steps via cast; no steps -> null,
// never fabricates.
//
// TOKEN DISCIPLINE: accent -> fam-accent-* (DNA) 50/100/600/700: fam-accent badges,
// fam-accent-soft-2 rail. Radius -> rounded-* (DNA). Font -> font-display (DNA). Light
// surface component-owned (white / slate / #E6E8EC). No CTA by design.
export function ProcessVerticalRailBlock({
  site = SITE,
  label = tr('section.howItWorks'),
  heading = tr('section.ourProcess'),
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
    <section className="bg-fam-card">
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

        <div className="mt-14 max-w-2xl">
          {items.map((s, i) => {
            const Icon = getProcessIcon(s.icon)
            const last = i === items.length - 1
            return (
              <div key={`${s.title}-${i}`} className="relative flex gap-6 pb-10 last:pb-0">
                {!last && <span className="absolute left-[1.375rem] top-12 h-[calc(100%-2rem)] w-0.5 bg-fam-accent-soft-2" />}
                <span className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-fam-accent font-display text-sm font-semibold text-fam-on-accent">
                  {Icon ? <Icon className="h-5 w-5" /> : i + 1}
                </span>
                <div className="pt-1.5">
                  <h3 className="font-display text-lg font-semibold tracking-tight text-fam-ink">{s.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-fam-ink-muted">{s.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
