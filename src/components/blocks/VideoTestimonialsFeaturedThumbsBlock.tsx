import { useState } from 'react'
import type { VideoTestimonial } from './video-testimonials-variants'
import { SITE } from '~/data/site'

// Video Testimonials LAYOUT: 'featured+thumbs' — one large player with a thumbnail
// strip; clicking a thumb promotes it. Character-agnostic, interactive (first
// testimonial featured on the server). OMIT-WHEN-ABSENT: SITE.videoTestimonials
// via cast; none -> null. Missing poster degrades to a neutral slate frame.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700: emerald-600 active
// ring. Radius -> rounded-* (DNA). Font -> font-display (DNA). Light surface
// component-owned. No CTA by design. Never bg-brand-* / .btn.
export function VideoTestimonialsFeaturedThumbsBlock({
  label = 'Testimonials',
  heading = 'In their words',
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const vids = (SITE as { videoTestimonials?: VideoTestimonial[] }).videoTestimonials
  const [active, setActive] = useState(0)
  if (!vids || vids.length === 0) return null
  const f = vids[active] ?? vids[0]!
  return (
    <section className="bg-[#F8FAFC]">
      <div className="container-x py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            <span className="h-px w-6 bg-emerald-600" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">{heading}</h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-[#64748B]">{body}</p>}
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <figure className="lg:col-span-2">
            <div className="aspect-video overflow-hidden rounded-2xl border border-[#E6E8EC] bg-slate-900">
              <video key={f.videoUrl} controls preload="none" poster={f.poster} className="h-full w-full object-cover">
                <source src={f.videoUrl} />
              </video>
            </div>
            {f.quote && <blockquote className="mt-5 font-display text-xl leading-snug text-[#0F172A]">“{f.quote}”</blockquote>}
            <figcaption className="mt-3 font-display text-sm font-semibold text-emerald-700">{f.author}</figcaption>
          </figure>
          <div className="flex flex-row gap-3 overflow-x-auto lg:flex-col lg:overflow-visible">
            {vids.map((v, i) => (
              <button
                key={`${v.author}-${i}`}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Play ${v.author}`}
                className={`flex shrink-0 items-center gap-3 rounded-xl border p-3 text-left transition-all ${i === active ? 'border-emerald-600 ring-1 ring-emerald-600 bg-white' : 'border-[#E6E8EC] bg-white hover:border-emerald-600'}`}
              >
                <span className="h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-900">
                  {v.poster && <img src={v.poster} alt={v.author} className="h-full w-full object-cover" />}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-display text-sm font-semibold text-[#0F172A]">{v.author}</span>
                  {v.quote && <span className="block truncate text-xs text-[#64748B]">{v.quote}</span>}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
