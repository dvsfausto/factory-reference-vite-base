import { SITE } from '~/data/site'
import { tr } from '~/lib/i18n'

// Story LAYOUT: 'milestone-timeline', a vertical timeline of dated milestones.
// Character-agnostic. OMIT-WHEN-ABSENT: milestones read from optional
// SITE.milestones via cast; none -> null, never fabricates a history.
//
// TOKEN DISCIPLINE: accent -> fam-accent-* (DNA) 50/100/600/700: fam-accent nodes +
// year, fam-accent-soft-2 rail. Radius -> rounded-* (DNA). Font -> font-display (DNA).
// Light surface component-owned (white / slate / #E6E8EC). No CTA by design.
export function StoryMilestoneTimelineBlock({
  site = SITE,
  label = tr('section.ourStory'),
  heading = tr('section.howWeGotHere'),
  body,
}: {
  site?: typeof SITE
  label?: string
  heading?: string
  body?: string
}) {
  const milestones = (site as { milestones?: { year: string; title: string; description?: string }[] }).milestones
  if (!milestones || milestones.length === 0) return null
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

        <div className="mt-14 max-w-3xl">
          {milestones.map((m, i) => {
            const last = i === milestones.length - 1
            return (
              <div key={`${m.year}-${i}`} className="relative flex gap-8 pb-12 last:pb-0">
                {!last && <span className="absolute left-[4.5rem] top-3 h-full w-0.5 bg-fam-accent-soft-2 md:left-[5.5rem]" />}
                <div className="w-16 shrink-0 text-right font-display text-lg font-semibold text-fam-accent-text md:w-20">{m.year}</div>
                <span className="relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full bg-fam-accent ring-4 ring-fam-accent-soft" />
                <div className="-mt-0.5">
                  <h3 className="font-display text-lg font-semibold tracking-tight text-fam-ink">{m.title}</h3>
                  {m.description && <p className="mt-1.5 leading-relaxed text-fam-ink-muted">{m.description}</p>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
