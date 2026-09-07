import { PROJECTS } from '~/data/projects'
import { tr } from '~/lib/i18n'

// Gallery LAYOUT: 'masonry', a column-flow wall of project photos at their
// natural heights. Character-agnostic. PIPELINE-SEEDED: images come from the
// PROJECTS data field (seeded now, customer photos later), so it renders populated
// from day one (not omit-when-empty).
//
// TOKEN DISCIPLINE: accent -> fam-accent-* (DNA) 50/100/600/700. Radius -> rounded-*
// (DNA). Font -> font-display (DNA). Light surface component-owned (white / slate /
// #E6E8EC). No CTA in this section by design. Never bg-brand-* / .btn.
export function GalleryMasonryBlock({
  projects = PROJECTS,
  label = tr('section.ourWork'),
  heading = tr('section.recentProjects'),
  body,
}: {
  projects?: typeof PROJECTS
  label?: string
  heading?: string
  body?: string
}) {
  if (projects.length === 0) return null
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

        <div className="mt-12 gap-5 [column-fill:_balance] sm:columns-2 lg:columns-3">
          {projects.map((p, i) => (
            <figure key={`${p.title}-${i}`} className="mb-5 break-inside-avoid overflow-hidden rounded-2xl border border-fam-hairline">
              {/* ★ FIXED 4:3 FRAME — see GalleryCinematicMasonryBlock: mixed ratios no longer break the row. */}
              <img src={p.image} alt={p.alt ?? p.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              <figcaption className="flex items-center justify-between gap-3 p-4">
                <span className="font-display text-sm font-semibold text-fam-ink">{p.title}</span>
                {p.caption && <span className="text-xs italic text-fam-ink-faint">{p.caption}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
