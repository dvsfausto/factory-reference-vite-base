import { useState } from 'react'
import { PROJECTS } from '~/data/projects'

// Gallery LAYOUT: 'featured+thumbs' — one large featured photo with a thumbnail
// strip; clicking a thumb promotes it. Character-agnostic, interactive (renders
// the first project featured on the server). PIPELINE-SEEDED: images from the
// PROJECTS data field; renders populated from the seed.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700: emerald-600 active
// ring. Radius -> rounded-* (DNA). Font -> font-display (DNA). Light surface
// component-owned (white / slate / #E6E8EC). No CTA by design. Never bg-brand-*.
export function GalleryFeaturedThumbsBlock({
  label = 'Our work',
  heading = 'Recent projects',
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const [active, setActive] = useState(0)
  if (PROJECTS.length === 0) return null
  const featured = PROJECTS[active] ?? PROJECTS[0]!
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

        <div className="mt-12">
          <figure className="overflow-hidden rounded-3xl border border-[#E6E8EC] bg-white">
            <div className="aspect-[16/9] overflow-hidden">
              <img src={featured.image} alt={featured.alt ?? featured.title} className="h-full w-full object-cover" />
            </div>
            <figcaption className="flex items-center justify-between gap-3 p-6">
              <span className="font-display text-lg font-semibold text-[#0F172A]">{featured.title}</span>
              {featured.caption && <span className="text-sm italic text-[#94A3B8]">{featured.caption}</span>}
            </figcaption>
          </figure>

          <div className="mt-5 grid grid-cols-4 gap-4 sm:grid-cols-6">
            {PROJECTS.map((p, i) => (
              <button
                key={`${p.title}-${i}`}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show ${p.title}`}
                className={`aspect-square overflow-hidden rounded-xl border transition-all ${
                  i === active ? 'border-emerald-600 ring-2 ring-emerald-600' : 'border-[#E6E8EC] opacity-80 hover:opacity-100'
                }`}
              >
                <img src={p.image} alt={p.alt ?? p.title} loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
