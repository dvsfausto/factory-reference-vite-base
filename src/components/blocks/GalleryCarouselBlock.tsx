import { PROJECTS } from '~/data/projects'
import { tr } from '~/lib/i18n'

// Gallery LAYOUT: 'carousel', a horizontal scroll-snap filmstrip of project
// photos. Character-agnostic, CSS-only (SSR-safe). PIPELINE-SEEDED: images from
// the PROJECTS data field; renders populated from the seed.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700. Radius -> rounded-*
// (DNA). Font -> font-display (DNA). Light surface component-owned (white / slate /
// #E6E8EC). No CTA by design. Never bg-brand-* / .btn.
export function GalleryCarouselBlock({
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
      <div className="container-x py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
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
          <span className="font-display text-sm font-medium text-[#64748B]">Scroll for more →</span>
        </div>
      </div>

      <div className="relative">
        <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pb-6 [scrollbar-width:thin]">
          {projects.map((p, i) => (
            <figure
              key={`${p.title}-${i}`}
              className="w-[300px] shrink-0 snap-start overflow-hidden rounded-2xl border border-[#E6E8EC] bg-white md:w-[380px]"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={p.image} alt={p.alt ?? p.title} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <figcaption className="flex items-center justify-between gap-3 p-4">
                <span className="font-display text-sm font-semibold text-[#0F172A]">{p.title}</span>
                {p.caption && <span className="text-xs italic text-[#94A3B8]">{p.caption}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l from-white to-transparent md:block" />
      </div>
    </section>
  )
}
