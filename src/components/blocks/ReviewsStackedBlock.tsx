import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { Star } from 'lucide-react'
import { reviews as REVIEWS } from '~/data/reviews'

// Reviews LAYOUT: 'stacked', full-width testimonials stacked one per row at
// display scale, hairline-separated, each a large pull-quote with the author set
// to the side. Character-agnostic. Reads like a sequence of editorial statements
// rather than a card grid, distinct because each review gets the whole width and
// real type size.
//
// Considered rhythm (not stretched cards): an oversized quote column balanced
// against a compact author/meta column, generous row padding, thin rules between.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary / text-primary-foreground (BRAND-
// owned). Accent -> fam-accent-* (DNA) restricted to 50/100/600/700. Radius ->
// rounded-* (DNA). Font -> font-display (DNA). Light surface component-owned
// (white / slate / hairline #E6E8EC). Never bg-brand-* / .btn.
//
// Prop signature identical to ReviewsBlock; returns Element | null.
export function ReviewsStackedBlock({
  reviews = REVIEWS,
  label = tr('nav.reviews'),
  heading = tr('section.whatCustomersSay'),
  moreLink = tr('section.readAllReviews'),
}: {
  reviews?: typeof REVIEWS
  label?: string
  heading?: string
  scriptAccent?: string
  moreLink?: string
}) {
  const rows = reviews.slice(0, 5)
  if (rows.length === 0) return null
  return (
    <section className="bg-fam-card">
      <div className="container-x py-section">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
            <span className="h-px w-6 bg-fam-accent" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">
            {heading}
          </h2>
        </div>

        <div className="mt-12 border-t border-fam-hairline">
          {rows.map((r) => (
            <figure
              key={r.id}
              className="grid grid-cols-1 gap-6 border-b border-fam-hairline py-12 md:grid-cols-12 md:gap-10 md:py-16"
            >
              <div className="md:col-span-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: r.rating ?? 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-fam-accent text-fam-accent-text" />
                  ))}
                </div>
                <figcaption className="mt-4 text-sm text-fam-ink-muted">
                  <span className="block font-display text-lg font-semibold text-fam-ink">{r.author}</span>
                  {r.location && <span>{r.location}</span>}
                  {(r.service || r.date) && (
                    <span className="mt-0.5 block text-xs text-fam-ink-faint">
                      {[r.service, r.date].filter(Boolean).join(' · ')}
                    </span>
                  )}
                </figcaption>
              </div>
              <blockquote className="font-display text-2xl font-medium leading-snug tracking-tight text-fam-ink md:col-span-8 md:text-3xl">
                {r.text}
              </blockquote>
            </figure>
          ))}
        </div>

        {reviews.length > rows.length && (
          <div className="mt-10">
            <Link
              to="/reviews"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-cta px-7 font-display text-sm font-semibold text-cta-foreground transition-opacity hover:opacity-(--hov-fade)"
            >
              {moreLink}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
