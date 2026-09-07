import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'
import { Star } from 'lucide-react'
import { SectionHeaderCorporate } from '~/components/SectionHeaderCorporate'
import { reviews as REVIEWS } from '~/data/reviews'

// Reviews VARIANT: 'corporate', formal client testimonials. SectionHeaderCorporate
// (no diamond, no script) + boxed bordered quote cards on a cool blue-gray section.
// Prop signature matches ReviewsBlock; returns Element | null.
//
// TOKEN DISCIPLINE: structured light surfaces component-owned; emerald-* (DNA →
// navy) stars + the "read all" CTA; rounded-* (DNA, tight); font-display.
export function ReviewsCorporateBlock({
  site = SITE,
  reviews = REVIEWS,
  label = ((site as { homeReviews?: { label?: string; heading?: string; scriptAccent?: string } }).homeReviews?.label ?? tr('nav.reviews')),
  heading = ((site as { homeReviews?: { label?: string; heading?: string; scriptAccent?: string } }).homeReviews?.heading ?? tr('section.whatCustomersHeading')),
  scriptAccent = ((site as { homeReviews?: { label?: string; heading?: string; scriptAccent?: string } }).homeReviews?.scriptAccent ?? tr('section.sayAccent')),
  moreLink = tr('section.readAllReviews'),
}: {
  site?: typeof SITE
  reviews?: typeof REVIEWS
  label?: string
  heading?: string
  scriptAccent?: string
  moreLink?: string
}) {
  const previewReviews = reviews.slice(0, 6)
  if (previewReviews.length === 0) return null
  return (
    <section className="border-y border-fam-hairline bg-fam-surface-2">
      <div className="container-x py-section">
        <SectionHeaderCorporate label={label} heading={heading} scriptAccent={scriptAccent} />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {previewReviews.map((r) => (
            <figure
              key={r.id}
              className="flex flex-col rounded-lg border border-fam-hairline bg-white p-7"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: r.rating ?? 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-fam-accent text-fam-accent-text" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-fam-ink">
                {r.text}
              </blockquote>
              <figcaption className="mt-6 border-t border-fam-hairline pt-4 text-sm text-fam-ink-muted">
                <span className="font-display font-semibold text-fam-ink">{r.author}</span>
                {r.location && <span> · {r.location}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
        {reviews.length > previewReviews.length && (
          <div className="mt-10">
            <Link
              to="/reviews"
              className="inline-flex h-12 items-center rounded-md border border-fam-hairline bg-white px-6 font-display text-sm font-semibold text-fam-ink transition-colors hover:border-fam-accent hover:text-fam-accent-text-strong"
            >
              {moreLink}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
