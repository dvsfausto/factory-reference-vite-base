import type { ProcessStep } from './process-variants'
import { getProcessIcon } from './process-icons'
import { SITE } from '~/data/site'

// Process LAYOUT: 'vertical-rail' — a single left-aligned column with a continuous
// rail threading numbered badges, content to the right. Character-agnostic.
// OMIT-WHEN-ABSENT: steps from optional SITE.steps via cast; no steps -> null,
// never fabricates.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700: emerald-600 badges,
// emerald-100 rail. Radius -> rounded-* (DNA). Font -> font-display (DNA). Light
// surface component-owned (white / slate / #E6E8EC). No CTA by design.
export function ProcessVerticalRailBlock({
  label = 'How it works',
  heading = 'Our process',
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const steps = (SITE as { steps?: ProcessStep[] }).steps
  if (!steps || steps.length === 0) return null
  const items = steps.slice(0, 6)
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

        <div className="mt-14 max-w-2xl">
          {items.map((s, i) => {
            const Icon = getProcessIcon(s.icon)
            const last = i === items.length - 1
            return (
              <div key={`${s.title}-${i}`} className="relative flex gap-6 pb-10 last:pb-0">
                {!last && <span className="absolute left-[1.375rem] top-12 h-[calc(100%-2rem)] w-0.5 bg-emerald-100" />}
                <span className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-600 font-display text-sm font-semibold text-white">
                  {Icon ? <Icon className="h-5 w-5" /> : i + 1}
                </span>
                <div className="pt-1.5">
                  <h3 className="font-display text-lg font-semibold tracking-tight text-[#0F172A]">{s.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-[#64748B]">{s.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
