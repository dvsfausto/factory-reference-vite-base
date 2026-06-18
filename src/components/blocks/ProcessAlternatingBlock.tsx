import type { ProcessStep } from './process-variants'
import { getProcessIcon } from './process-icons'
import { SITE } from '~/data/site'

// Process LAYOUT: 'alternating' — a vertical spine with steps zigzagging left and
// right of a centered connector. Character-agnostic. OMIT-WHEN-ABSENT: steps from
// optional SITE.steps via cast; no steps -> null, never fabricates.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700: emerald-600 nodes,
// emerald-100 spine. Radius -> rounded-* (DNA). Font -> font-display (DNA). Light
// surface component-owned (white / slate / #E6E8EC). No CTA by design.
export function ProcessAlternatingBlock({
  label = 'How it works',
  heading = 'Step by step',
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
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            <span className="h-px w-6 bg-emerald-600" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">
            {heading}
          </h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-[#64748B]">{body}</p>}
        </div>

        <div className="relative mx-auto mt-16 max-w-4xl">
          <span className="absolute left-6 top-0 h-full w-0.5 bg-emerald-100 md:left-1/2 md:-translate-x-1/2" />
          <div className="flex flex-col gap-12">
            {items.map((s, i) => {
              const Icon = getProcessIcon(s.icon)
              const right = i % 2 === 1
              return (
                <div key={`${s.title}-${i}`} className="relative grid grid-cols-1 items-center gap-4 md:grid-cols-2 md:gap-12">
                  <span className="absolute left-6 top-1 z-10 grid h-7 w-7 -translate-x-1/2 place-items-center rounded-full bg-emerald-600 font-display text-xs font-semibold text-white md:left-1/2">
                    {i + 1}
                  </span>
                  <div className={`pl-16 md:pl-0 ${right ? 'md:order-2 md:pl-12' : 'md:pr-12 md:text-right'}`}>
                    <h3 className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-[#0F172A] md:justify-start">
                      {Icon && <Icon className="h-5 w-5 text-emerald-600" />} {s.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-[#64748B]">{s.description}</p>
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
