import { Quote } from 'lucide-react'
import { tr } from '~/lib/i18n'
import type { VideoTestimonial } from './video-testimonials-variants'
import { SITE } from '~/data/site'

// Video Testimonials LAYOUT: 'spotlight', one large feature video on a dark
// stage, with the remaining authors/quotes listed beside. Character-agnostic.
// OMIT-WHEN-ABSENT: SITE.videoTestimonials via cast; none -> null. Missing poster
// -> neutral frame.
//
// TOKEN DISCIPLINE: accent -> fam-accent-* (DNA) 50/100/600/700: fam-accent-soft-2 on dark.
// Radius -> rounded-* (DNA). Font -> font-display (DNA). Dark stage (slate-950)
// component-owned. No CTA by design. Never bg-brand-* / .btn.
export function VideoTestimonialsSpotlightBlock({
  site = SITE,
  label = tr('section.testimonials'),
  heading = tr('section.realStories'),
  body,
}: {
  site?: typeof SITE
  label?: string
  heading?: string
  body?: string
}) {
  const vids = (site as { videoTestimonials?: VideoTestimonial[] }).videoTestimonials
  if (!vids || vids.length === 0) return null
  const [lead, ...rest] = vids
  return (
    <section className="bg-slate-950 text-fam-on-dark">
      <div className="container-x py-section">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-on-dark">
            <span className="h-px w-6 bg-fam-accent" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-on-dark sm:text-5xl">{heading}</h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-slate-300">{body}</p>}
        </div>
        <div className="mt-12 grid gap-10 lg:grid-cols-3">
          <figure className="lg:col-span-2">
            <div className="aspect-video overflow-hidden rounded-2xl bg-black ring-1 ring-fam-card/10">
              <video controls preload="none" poster={lead.poster} className="h-full w-full object-cover">
                <source src={lead.videoUrl} />
              </video>
            </div>
            {lead.quote && <blockquote className="mt-6 font-display text-2xl leading-snug">“{lead.quote}”</blockquote>}
            <figcaption className="mt-3 font-display text-sm font-semibold text-fam-accent-on-dark">{lead.author}</figcaption>
          </figure>
          {rest.length > 0 && (
            <div className="flex flex-col divide-y divide-fam-card/10">
              {rest.slice(0, 4).map((v, i) => (
                <div key={`${v.author}-${i}`} className="py-5 first:pt-0">
                  <Quote className="h-5 w-5 text-fam-accent-on-dark" />
                  {v.quote && <p className="mt-2 leading-relaxed text-slate-200">{v.quote}</p>}
                  <p className="mt-2 font-display text-sm font-semibold text-fam-on-dark">{v.author}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
