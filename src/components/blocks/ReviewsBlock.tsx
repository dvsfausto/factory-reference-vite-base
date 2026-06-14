import { Link } from '@tanstack/react-router'
import { SectionHeader } from '~/components/SectionHeader'
import { ReviewCard } from '~/components/ReviewCard'
import { reviews } from '~/data/reviews'

// Markup extracted VERBATIM from routes/index.tsx (the REVIEWS section).
// Self-omits when there are no reviews — exactly today's
// `{previewReviews.length > 0 && …}`.
export function ReviewsBlock() {
  const previewReviews = reviews.slice(0, 6)
  if (previewReviews.length === 0) return null
  return (
    <section className="bg-brand-50 border-y border-brand-100">
      <div className="container-x py-16 md:py-24">
        <SectionHeader
          label="Reviews"
          heading="What customers"
          scriptAccent="say"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {previewReviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
        {reviews.length > previewReviews.length && (
          <div className="mt-8 text-center">
            <Link to="/reviews" className="btn btn-md btn-secondary">Read all reviews →</Link>
          </div>
        )}
      </div>
    </section>
  )
}
