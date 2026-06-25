import { Link } from '@tanstack/react-router'
import { Star } from 'lucide-react'
import { reviews } from '~/data/reviews'

// Reviews LAYOUT: 'stacked' — full-width testimonials stacked one per row at
// display scale, hairline-separated, each a large pull-quote with the author set
// to the side. Character-agnostic. Reads like a sequence of editorial statements
// rather than a card grid — distinct because each review gets the whole width and
// real type size.
//
// Considered rhythm (not stretched cards): an oversized quote column balanced
// against a compact author/meta column, generous row padding, thin rules between.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary / text-primary-foreground (BRAND-
// owned). Accent -> emerald-* (DNA) restricted to 50/100/600/700. Radius ->
// rounded-* (DNA). Font -> font-display (DNA). Light surface component-owned
// (white / slate / hairline #E6E8EC). Never bg-brand-* / .btn.
//
// Prop signature identical to ReviewsBlock; returns Element | null.
export function ReviewsStackedBlock({
  label = 'Reviews',
  heading = 'What customers say',
  moreLink = 'Read all reviews',
}: {
  label?: string
  heading?: string
  scriptAccent?: string
  moreLink?: string
}) {
  const rows = reviews.slice(0, 5)
  if (rows.length === 0) return null
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
        </div>

        <div className="mt-12 border-t border-[#E6E8EC]">
          {rows.map((r) => (
            <figure
              key={r.id}
              className="grid grid-cols-1 gap-6 border-b border-[#E6E8EC] py-12 md:grid-cols-12 md:gap-10 md:py-16"
            >
              <div className="md:col-span-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: r.rating ?? 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-emerald-600 text-emerald-600" />
                  ))}
                </div>
                <figcaption className="mt-4 text-sm text-[#64748B]">
                  <span className="block font-display text-lg font-semibold text-[#0F172A]">{r.author}</span>
                  {r.location && <span>{r.location}</span>}
                  {(r.service || r.date) && (
                    <span className="mt-0.5 block text-xs text-[#94A3B8]">
                      {[r.service, r.date].filter(Boolean).join(' · ')}
                    </span>
                  )}
                </figcaption>
              </div>
              <blockquote className="font-display text-2xl font-medium leading-snug tracking-tight text-[#0F172A] md:col-span-8 md:text-3xl">
                {r.text}
              </blockquote>
            </figure>
          ))}
        </div>

        {reviews.length > rows.length && (
          <div className="mt-10">
            <Link
              to="/reviews"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-7 font-display text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {moreLink}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
