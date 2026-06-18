import { PROJECTS } from '~/data/projects'

// Gallery LAYOUT: 'grid' — an even, uniform grid of square project cards (the
// painter "work, illustrated" pattern, DNA-tokened). Character-agnostic. PIPELINE-
// SEEDED: images from the PROJECTS data field; renders populated from the seed,
// customer photos replace later.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700. Radius -> rounded-*
// (DNA). Font -> font-display (DNA). Light surface component-owned (section
// #F8FAFC, white cards, #E6E8EC). No CTA by design. Never bg-brand-* / .btn.
export function GalleryGridBlock({
  label = 'Our work',
  heading = 'Recent projects',
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  if (PROJECTS.length === 0) return null
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

        <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {PROJECTS.map((p, i) => (
            <figure
              key={`${p.title}-${i}`}
              className="group overflow-hidden rounded-2xl border border-[#E6E8EC] bg-white"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={p.image}
                  alt={p.alt ?? p.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <figcaption className="p-4">
                <span className="font-display text-sm font-semibold text-[#0F172A]">{p.title}</span>
                {p.caption && <span className="mt-0.5 block text-xs italic text-[#94A3B8]">{p.caption}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
