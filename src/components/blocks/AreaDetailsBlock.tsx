import type { ReactNode } from 'react'
import { tr } from '~/lib/i18n'
import { Link } from '@tanstack/react-router'
import { ArrowRight, MapPin, Quote, Star } from 'lucide-react'
import type { ServiceAreaPageData } from '~/lib/types/page-types'
import { SERVICES } from '~/data/services-view'
import { serviceImageUrl } from '~/data/images'

// AREA-DETAIL VARIANT (Arc 3 · Stage D): the rich, consolidated MIDDLE content of an
// area page, driven per-item by `area` (ctx.area). It renders, in order -
// servicesHere, landmarks, localContext, and testimonial, EACH omitting when its own
// data is empty. Consolidating them into one block keeps the AREA_DETAIL_LAYOUT lean
// while preserving every field ServiceAreaPageTemplate rendered. This is the Stage-D
// mirror of ServiceDetailsBlock.
//
// WOW tokens consumed (all brand-derived via color-mix, see styles/app.css):
//   · --wow-grad-surface → the tinted sub-section surfaces (alternated with white
//     for vertical rhythm).
//   · --wow-grad-brand   → the quote mark accent.
//   · --wow-hairline     → card / tile hairline borders.
//   · --wow-shadow-soft  → card lift.
// BRAND identity stays on the ramp (brand-* accents) + --wow-*; no fabricated data.
//
// HONESTY (mirrors ServiceAreaPageTemplate's per-section guards, per THIS area):
//   · servicesHere → featured slugs resolved against the PUBLISHED SERVICES view;
//     shown only when at least one resolves (an unpublished/unknown slug self-heals
//     out). Numbers/copy are never invented.
//   · landmarks    → shown only when items.length > 0.
//   · localContext → shown only when present.
//   · testimonial  → shown only when present (real rating/text/author).
// If every sub-section is empty the whole block returns null. Reveal is applied by
// the shared SectionList, so this block adds no opacity-hider.

function SubSection({
  surface,
  children,
}: {
  surface: 'tint' | 'white'
  children: ReactNode
}) {
  return (
    <section
      className="relative overflow-hidden"
      style={
        surface === 'tint'
          ? { backgroundImage: 'var(--wow-grad-surface)' }
          : { backgroundColor: '#fff' }
      }
    >
      <div className="container-x py-16 md:py-24">{children}</div>
    </section>
  )
}

export function AreaDetailsBlock({
  area,
}: {
  area: ServiceAreaPageData
  variant?: string
}) {
  const { servicesHere, landmarks, localContext, testimonial } = area

  // Resolve featured service slugs against the published view (mirrors the template's
  // servicesMap lookup), drops unpublished/unknown slugs so an empty result omits.
  const servicesMap = new Map(SERVICES.map((s) => [s.slug, s]))
  const featured = servicesHere.featured
    .map((slug) => servicesMap.get(slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))

  const showServices = featured.length > 0
  const showLandmarks = landmarks.items.length > 0
  const showLocal = Boolean(localContext)
  const showTestimonial = Boolean(testimonial)

  const blocks: ReactNode[] = []

  if (showServices) {
    blocks.push(
      <div key="servicesHere">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-700">{tr('tmpl.servicesAvailable')}</p>
          <h2 className="mt-3 font-display text-3xl leading-tight text-ink-900 sm:text-4xl">
            {servicesHere.title}
          </h2>
          {servicesHere.intro && (
            <p className="mt-4 text-lg leading-relaxed text-ink-700">
              {servicesHere.intro}
            </p>
          )}
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((s) => (
            <Link
              key={s.slug}
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="group flex flex-col overflow-hidden rounded-2xl border bg-white/85 backdrop-blur-md transition-transform duration-500 hover:-translate-y-1"
              style={{
                borderColor: 'var(--wow-hairline)',
                boxShadow: 'var(--wow-shadow-soft)',
              }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={serviceImageUrl(s.slug)}
                  alt={s.name}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-lg leading-snug text-ink-900">
                  {s.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{s.short}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition-all group-hover:gap-2">{tr('common.learnMore')}<ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>,
    )
  }

  if (showLandmarks) {
    blocks.push(
      <div key="landmarks">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl leading-tight text-ink-900 sm:text-4xl">
            {landmarks.title}
          </h2>
          {landmarks.intro && (
            <p className="mt-4 text-lg leading-relaxed text-ink-700">
              {landmarks.intro}
            </p>
          )}
        </div>
        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {landmarks.items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3.5 rounded-2xl border bg-white/80 p-5 backdrop-blur-md"
              style={{
                borderColor: 'var(--wow-hairline)',
                boxShadow: 'var(--wow-shadow-soft)',
              }}
            >
              <span
                className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg text-white"
                style={{ backgroundImage: 'var(--wow-grad-brand)' }}
              >
                <MapPin className="h-4 w-4" />
              </span>
              <span className="leading-relaxed text-ink-800">{item}</span>
            </li>
          ))}
        </ul>
      </div>,
    )
  }

  if (showLocal && localContext) {
    blocks.push(
      <div key="localContext" className="mx-auto max-w-3xl">
        <div
          className="rounded-3xl border bg-white/85 p-8 backdrop-blur-md md:p-10"
          style={{
            borderColor: 'var(--wow-hairline)',
            boxShadow: 'var(--wow-shadow-soft)',
          }}
        >
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white"
            style={{ backgroundImage: 'var(--wow-grad-brand)' }}
          >{tr('tmpl.localInsight')}</span>
          <h2 className="mt-4 font-display text-2xl leading-tight text-ink-900 sm:text-3xl">
            {localContext.title ?? `Why ${area.name} chooses us`}
          </h2>
          <div className="mt-5 space-y-4">
            {localContext.body.map((p, i) => (
              <p key={i} className="text-lg leading-relaxed text-ink-700">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>,
    )
  }

  if (showTestimonial && testimonial) {
    blocks.push(
      <figure key="testimonial" className="mx-auto max-w-3xl text-center">
        <Quote
          aria-hidden
          className="mx-auto h-10 w-10"
          strokeWidth={1.25}
          style={{
            color: 'transparent',
            backgroundImage: 'var(--wow-grad-brand)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
          }}
          fill="currentColor"
        />
        <div className="mt-4 flex justify-center gap-0.5">
          {Array.from({ length: testimonial.rating ?? 5 }).map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <blockquote className="mt-4 font-display text-2xl leading-snug text-ink-900 md:text-3xl">
          “{testimonial.text}”
        </blockquote>
        <figcaption className="mt-6 text-ink-700">
          <span className="font-semibold">{testimonial.author}</span>
          {testimonial.location && (
            <span className="text-ink-500"> · {testimonial.location}</span>
          )}
        </figcaption>
      </figure>,
    )
  }

  if (blocks.length === 0) return null

  return (
    <>
      {blocks.map((node, i) => (
        <SubSection key={i} surface={i % 2 === 0 ? 'tint' : 'white'}>
          {node}
        </SubSection>
      ))}
    </>
  )
}
