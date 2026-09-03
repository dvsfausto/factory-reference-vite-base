import type { VideoTestimonial } from './video-testimonials-variants'
import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'

// Video Testimonials LAYOUT: 'grid', a grid of native video players (poster +
// browser controls), author + quote beneath. Character-agnostic, SSR-safe.
// OMIT-WHEN-ABSENT: SITE.videoTestimonials via cast; none -> null. Missing poster
// degrades to a neutral slate frame (the player still works).
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700. Radius -> rounded-*
// (DNA). Font -> font-display (DNA). Light surface component-owned (white / slate /
// #E6E8EC). No CTA by design. Never bg-brand-* / .btn.
export function VideoTestimonialsGridBlock({
  site = SITE,
  label = tr('section.testimonials'),
  heading = tr('section.hearFromCustomers'),
  body,
}: {
  site?: typeof SITE
  label?: string
  heading?: string
  body?: string
}) {
  const vids = (site as { videoTestimonials?: VideoTestimonial[] }).videoTestimonials
  if (!vids || vids.length === 0) return null
  return (
    <section className="bg-white">
      <div className="container-x py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            <span className="h-px w-6 bg-emerald-600" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">{heading}</h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-[#64748B]">{body}</p>}
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vids.slice(0, 6).map((v, i) => (
            <figure key={`${v.author}-${i}`} className="flex flex-col overflow-hidden rounded-2xl border border-[#E6E8EC] bg-white">
              <div className="aspect-video overflow-hidden bg-slate-900">
                <video controls preload="none" poster={v.poster} className="h-full w-full object-cover">
                  <source src={v.videoUrl} />
                </video>
              </div>
              <figcaption className="p-6">
                {v.quote && <blockquote className="leading-relaxed text-[#0F172A]">“{v.quote}”</blockquote>}
                <span className="mt-3 block font-display text-sm font-semibold text-emerald-700">{v.author}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
