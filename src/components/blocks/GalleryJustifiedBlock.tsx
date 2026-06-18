import { PROJECTS } from '~/data/projects'

// Gallery LAYOUT: 'justified' — a flickr-style justified gallery: photos flow into
// rows of varied widths that fill the full measure, with consistent gutters.
// Character-agnostic. PIPELINE-SEEDED: images from the PROJECTS data field;
// renders populated from the seed.
//
// The justified effect uses flexible basis + grow per item (a deterministic width
// rhythm by index) so rows fill edge to edge without cropping to squares.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700. Radius -> rounded-*
// (DNA). Font -> font-display (DNA). Light surface component-owned (white / slate /
// #E6E8EC). No CTA by design. Never bg-brand-* / .btn.
const GROW = [2, 3, 2, 3, 2, 2, 3, 2]

export function GalleryJustifiedBlock({
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

        <div className="mt-12 flex flex-wrap gap-4">
          {PROJECTS.map((p, i) => (
            <figure
              key={`${p.title}-${i}`}
              className="group relative h-56 min-w-[220px] grow overflow-hidden rounded-2xl border border-[#E6E8EC]"
              style={{ flexGrow: GROW[i % GROW.length], flexBasis: '240px' }}
            >
              <img
                src={p.image}
                alt={p.alt ?? p.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-4">
                <span className="font-display text-sm font-semibold text-white drop-shadow">{p.title}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
