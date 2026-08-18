import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { SectionHeader } from '~/components/SectionHeader'
import { ReviewCard } from '~/components/ReviewCard'
import { reviews } from '~/data/reviews'

// Markup extracted VERBATIM from routes/index.tsx (the REVIEWS section).
// Self-omits when there are no reviews — exactly today's
// `{previewReviews.length > 0 && …}`.
export function ReviewsBlock({
  label = tr('nav.reviews'),
  heading = tr('section.whatCustomersHeading'),
  scriptAccent = tr('section.sayAccent'),
  moreLink = tr('section.readAllReviewsArrow'),
}: {
  label?: string
  heading?: string
  scriptAccent?: string
  moreLink?: string
}) {
  const previewReviews = reviews.slice(0, 6)
  if (previewReviews.length === 0) return null
  return (
    <section className="bg-brand-50 border-y border-brand-100">
      <div className="container-x py-16 md:py-24">
        <SectionHeader
          label={label}
          heading={heading}
          scriptAccent={scriptAccent}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {previewReviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
        {reviews.length > previewReviews.length && (
          <div className="mt-8 text-center">
            <Link to="/reviews" className="btn btn-md btn-secondary">{moreLink}</Link>
          </div>
        )}
      </div>
    </section>
  )
}
