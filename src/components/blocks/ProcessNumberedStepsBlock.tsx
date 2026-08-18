import type { ProcessStep } from './process-variants'
import { tr } from '~/lib/i18n'
import { getProcessIcon } from './process-icons'
import { SITE } from '~/data/site'

// Process LAYOUT: 'numbered-steps' — a horizontal row of big-numbered steps.
// Character-agnostic. OMIT-WHEN-ABSENT: steps read from optional SITE.steps via
// cast; no steps -> null, never fabricates a process. Each step shows its number
// (or its optional icon when provided).
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700: emerald-50 badge,
// emerald-600 number/icon. Radius -> rounded-* (DNA). Font -> font-display (DNA).
// Light surface component-owned (white / slate / #E6E8EC). No CTA by design.
export function ProcessNumberedStepsBlock({
  label = tr('section.howItWorks'),
  heading = tr('section.simpleProcess'),
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const steps = (SITE as { steps?: ProcessStep[] }).steps
  if (!steps || steps.length === 0) return null
  return (
    <section className="bg-white">
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

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.slice(0, 4).map((s, i) => {
            const Icon = getProcessIcon(s.icon)
            return (
              <div key={`${s.title}-${i}`} className="flex flex-col">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 font-display text-xl font-semibold text-emerald-600">
                  {Icon ? <Icon className="h-6 w-6" /> : i + 1}
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-[#0F172A]">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-[#64748B]">{s.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
