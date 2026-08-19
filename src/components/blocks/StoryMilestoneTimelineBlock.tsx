import { SITE } from '~/data/site'
import { tr } from '~/lib/i18n'

// Story LAYOUT: 'milestone-timeline', a vertical timeline of dated milestones.
// Character-agnostic. OMIT-WHEN-ABSENT: milestones read from optional
// SITE.milestones via cast; none -> null, never fabricates a history.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700: emerald-600 nodes +
// year, emerald-100 rail. Radius -> rounded-* (DNA). Font -> font-display (DNA).
// Light surface component-owned (white / slate / #E6E8EC). No CTA by design.
export function StoryMilestoneTimelineBlock({
  label = tr('section.ourStory'),
  heading = tr('section.howWeGotHere'),
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const milestones = (SITE as { milestones?: { year: string; title: string; description?: string }[] }).milestones
  if (!milestones || milestones.length === 0) return null
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

        <div className="mt-14 max-w-3xl">
          {milestones.map((m, i) => {
            const last = i === milestones.length - 1
            return (
              <div key={`${m.year}-${i}`} className="relative flex gap-8 pb-12 last:pb-0">
                {!last && <span className="absolute left-[4.5rem] top-3 h-full w-0.5 bg-emerald-100 md:left-[5.5rem]" />}
                <div className="w-16 shrink-0 text-right font-display text-lg font-semibold text-emerald-600 md:w-20">{m.year}</div>
                <span className="relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full bg-emerald-600 ring-4 ring-emerald-50" />
                <div className="-mt-0.5">
                  <h3 className="font-display text-lg font-semibold tracking-tight text-[#0F172A]">{m.title}</h3>
                  {m.description && <p className="mt-1.5 leading-relaxed text-[#64748B]">{m.description}</p>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
