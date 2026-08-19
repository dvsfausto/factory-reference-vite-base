import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { Star } from 'lucide-react'
import { reviews } from '~/data/reviews'

// Reviews LAYOUT: 'carousel', a horizontal, scroll-snap slider of review cards,
// the right call when there are many testimonials. CSS-only (scroll-snap, no JS),
// SSR-safe, degrades to a plain scroll row. Character-agnostic.
//
// Considered (not an overflowing grid): snap alignment per card, a peek of the
// next card signalling more, and a trailing gradient fade. Equal-weight cards in
// a single swipeable track.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary / text-primary-foreground (BRAND-
// owned). Accent -> emerald-* (DNA) restricted to 50/100/600/700. Radius ->
// rounded-* (DNA). Font -> font-display (DNA). Light surface component-owned
// (white / slate / #E6E8EC). Never bg-brand-* / .btn.
//
// Prop signature identical to ReviewsBlock; returns Element | null.
export function ReviewsCarouselBlock({
  label = tr('nav.reviews'),
  heading = tr('section.whatCustomersSay'),
  moreLink = tr('section.readAllReviews'),
}: {
  label?: string
  heading?: string
  scriptAccent?: string
  moreLink?: string
}) {
  const cards = reviews.slice(0, 12)
  if (cards.length === 0) return null
  return (
    <section className="bg-white">
      <div className="container-x py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              <span className="h-px w-6 bg-emerald-600" />
              {label}
            </span>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">
              {heading}
            </h2>
          </div>
          <span className="font-display text-sm font-medium text-[#64748B]">Scroll for more →</span>
        </div>
      </div>

      <div className="relative">
        <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pb-6 [scrollbar-width:thin]">
          {cards.map((r) => (
            <figure
              key={r.id}
              className="flex w-[300px] shrink-0 snap-start flex-col rounded-2xl border border-[#E6E8EC] bg-white p-7 md:w-[380px]"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: r.rating ?? 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-emerald-600 text-emerald-600" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-[#0F172A]">{r.text}</blockquote>
              <figcaption className="mt-6 text-sm text-[#64748B]">
                <span className="font-display font-semibold text-[#0F172A]">{r.author}</span>
                {r.location && <span> · {r.location}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l from-white to-transparent md:block" />
      </div>

      {reviews.length > cards.length && (
        <div className="container-x mt-8">
          <Link
            to="/reviews"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-7 font-display text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {moreLink}
          </Link>
        </div>
      )}
    </section>
  )
}
