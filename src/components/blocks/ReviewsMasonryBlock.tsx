import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { Star } from 'lucide-react'
import { reviews } from '~/data/reviews'

// Reviews LAYOUT: 'masonry' — a column-flow wall of quote cards with GENUINELY
// varied heights: cards keep their natural length (short raves stay short, long
// stories stay tall) and pack into balanced columns. Character-agnostic.
//
// Real masonry (CSS columns + break-inside-avoid), not a fixed grid: the varied
// heights are the point — an authentic, lived-in testimonial wall rather than a
// row of equal boxes. Works for any number of reviews.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary / text-primary-foreground (BRAND-
// owned). Accent -> emerald-* (DNA) restricted to 50/100/600/700. Radius ->
// rounded-* (DNA). Font -> font-display (DNA). Light surface component-owned
// (section #F8FAFC, white cards, #E6E8EC). Never bg-brand-* / .btn.
//
// Prop signature identical to ReviewsBlock; returns Element | null.
export function ReviewsMasonryBlock({
  label = tr('nav.reviews'),
  heading = tr('section.whatCustomersSay'),
  moreLink = tr('section.readAllReviews'),
}: {
  label?: string
  heading?: string
  scriptAccent?: string
  moreLink?: string
}) {
  const cards = reviews.slice(0, 9)
  if (cards.length === 0) return null
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
        </div>

        <div className="mt-12 gap-6 [column-fill:_balance] sm:columns-2 lg:columns-3">
          {cards.map((r) => (
            <figure
              key={r.id}
              className="mb-6 flex break-inside-avoid flex-col rounded-2xl border border-[#E6E8EC] bg-white p-7"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: r.rating ?? 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-emerald-600 text-emerald-600" />
                ))}
              </div>
              <blockquote className="mt-4 leading-relaxed text-[#0F172A]">{r.text}</blockquote>
              <figcaption className="mt-5 text-sm text-[#64748B]">
                <span className="font-display font-semibold text-[#0F172A]">{r.author}</span>
                {r.location && <span> · {r.location}</span>}
                {(r.service || r.date) && (
                  <span className="mt-0.5 block text-xs text-[#94A3B8]">
                    {[r.service, r.date].filter(Boolean).join(' · ')}
                  </span>
                )}
              </figcaption>
            </figure>
          ))}
        </div>

        {reviews.length > cards.length && (
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
