import type { ProcessStep } from './process-variants'
import { tr } from '~/lib/i18n'
import { getProcessIcon } from './process-icons'
import { SITE } from '~/data/site'

// Process LAYOUT: 'cards', each step in its own elevated card with a number
// badge. Character-agnostic. OMIT-WHEN-ABSENT: steps from optional SITE.steps via
// cast; no steps -> null, never fabricates.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700: emerald-600 badge.
// Radius -> rounded-* (DNA). Font -> font-display (DNA). Light surface component-
// owned (white cards, #E6E8EC). No CTA by design. Never bg-brand-* / .btn.
export function ProcessCardsBlock({
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

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.slice(0, 6).map((s, i) => {
            const Icon = getProcessIcon(s.icon)
            return (
              <div
                key={`${s.title}-${i}`}
                className="relative flex flex-col rounded-2xl border border-[#E6E8EC] bg-white p-7 transition-colors hover:border-emerald-600"
              >
                <span className="absolute right-6 top-6 font-display text-5xl font-semibold text-[#EEF2F6]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-600 font-display text-base font-semibold text-white">
                  {Icon ? <Icon className="h-5 w-5" /> : i + 1}
                </span>
                <h3 className="mt-6 font-display text-lg font-semibold tracking-tight text-[#0F172A]">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-[#64748B]">{s.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
