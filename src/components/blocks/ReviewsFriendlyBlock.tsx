import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'
import { Star } from 'lucide-react'
import { SectionHeaderFriendly } from '~/components/SectionHeaderFriendly'
import { reviews as REVIEWS } from '~/data/reviews'

// Reviews VARIANT: 'friendly', warm, bright testimonials. SectionHeaderFriendly
// (no ◆ diamond, no script) + white rounded quote cards on a peach-cream section.
// Prop signature matches ReviewsBlock; returns Element | null.
//
// TOKEN DISCIPLINE: light-warm surfaces component-owned; emerald-* (DNA → coral)
// stars + "read all" CTA; rounded-* (DNA, soft); font-display.
export function ReviewsFriendlyBlock({
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
    <section className="bg-fam-surface-2">
      <div className="container-x py-section">
        <SectionHeaderFriendly label={label} heading={heading} scriptAccent={scriptAccent} />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {previewReviews.map((r) => (
            <figure
              key={r.id}
              className="flex flex-col rounded-3xl border border-fam-hairline bg-fam-card p-6 shadow-sm"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: r.rating ?? 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-fam-accent text-fam-accent-text" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-fam-ink">
                “{r.text}”
              </blockquote>
              <figcaption className="mt-5 text-sm text-fam-ink-muted">
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
              className="inline-flex h-12 items-center rounded-2xl border-2 border-fam-accent/40 bg-fam-card px-6 font-display text-sm font-semibold text-fam-ink transition-colors hover:border-fam-accent hover:bg-fam-accent-soft"
            >
              {moreLink}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
