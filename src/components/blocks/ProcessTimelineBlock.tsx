import type { ProcessStep } from './process-variants'
import { tr } from '~/lib/i18n'
import { getProcessIcon } from './process-icons'
import { SITE } from '~/data/site'

// Process LAYOUT: 'timeline', a horizontal timeline: numbered nodes strung along
// a connecting line, content beneath each. Character-agnostic. OMIT-WHEN-ABSENT:
// steps from optional SITE.steps via cast; no steps -> null, never fabricates.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700: emerald-600 nodes +
// line, emerald-100 track. Radius -> rounded-* (DNA). Font -> font-display (DNA).
// Cool surface component-owned (#F8FAFC / slate). No CTA by design.
export function ProcessTimelineBlock({
  label = tr('section.howItWorks'),
  heading = tr('section.yourJourney'),
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const steps = (SITE as { steps?: ProcessStep[] }).steps
  if (!steps || steps.length === 0) return null
  const items = steps.slice(0, 5)
  return (
    <section className="bg-[#F8FAFC]">
      <div className="container-x py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            <span className="h-px w-6 bg-emerald-600" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">
            {heading}
          </h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-[#64748B]">{body}</p>}
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-3 lg:grid-cols-5">
          {items.map((s, i) => {
            const Icon = getProcessIcon(s.icon)
            return (
              <div key={`${s.title}-${i}`} className="relative">
                <div className="flex items-center">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-600 font-display text-sm font-semibold text-white">
                    {Icon ? <Icon className="h-5 w-5" /> : i + 1}
                  </span>
                  {i < items.length - 1 && <span className="ml-3 hidden h-0.5 flex-1 bg-emerald-100 md:block" />}
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-[#0F172A]">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{s.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
