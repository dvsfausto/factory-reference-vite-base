import type { VideoTestimonial } from './video-testimonials-variants'
import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'

// Video Testimonials LAYOUT: 'carousel', a horizontal scroll-snap row of video
// players. Character-agnostic, CSS-only (SSR-safe). OMIT-WHEN-ABSENT:
// SITE.videoTestimonials via cast; none -> null. Missing poster -> neutral frame.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700. Radius -> rounded-*
// (DNA). Font -> font-display (DNA). Light surface component-owned. No CTA by
// design. Never bg-brand-* / .btn.
export function VideoTestimonialsCarouselBlock({
  label = tr('section.testimonials'),
  heading = tr('section.hearFromCustomers'),
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const vids = (SITE as { videoTestimonials?: VideoTestimonial[] }).videoTestimonials
  if (!vids || vids.length === 0) return null
  return (
    <section className="bg-white">
      <div className="container-x py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              <span className="h-px w-6 bg-emerald-600" />
              {label}
            </span>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">{heading}</h2>
            {body && <p className="mt-4 text-lg leading-relaxed text-[#64748B]">{body}</p>}
          </div>
          <span className="font-display text-sm font-medium text-[#64748B]">Scroll for more →</span>
        </div>
      </div>
      <div className="relative">
        <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pb-6 [scrollbar-width:thin]">
          {vids.map((v, i) => (
            <figure key={`${v.author}-${i}`} className="w-[320px] shrink-0 snap-start overflow-hidden rounded-2xl border border-[#E6E8EC] bg-white md:w-[400px]">
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
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l from-white to-transparent md:block" />
      </div>
    </section>
  )
}
