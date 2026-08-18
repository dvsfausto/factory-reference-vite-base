import { getAggregateRating, getHomepageReviews, reviews } from '~/data/reviews'
import { tr } from '~/lib/i18n'
import type { Review } from '~/lib/types/page-types'

interface Props {
  heading?: string
  intro?: string
  count?: number
}

export function ReviewsSection({
  heading = tr('section.verifiedReviews'),
  intro,
  count = 3,
}: Props) {
  if (reviews.length === 0) return null
  const display = getHomepageReviews(count)
  const agg = getAggregateRating()
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {heading}
          </h2>
          {agg && (
            <p className="mt-4 text-sm text-slate-600">
              {agg.value.toFixed(1)} of 5 across {agg.count}{' '}
              {agg.count === 1 ? 'review' : 'reviews'}
            </p>
          )}
          {intro && (
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-700">
              {intro}
            </p>
          )}
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {display.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="flex h-full flex-col rounded-2xl bg-slate-50 p-6">
      <div
        aria-label={`${review.rating} of 5 stars`}
        className="mb-3 flex gap-0.5 text-amber-500"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} aria-hidden>
            {i < review.rating ? '★' : '☆'}
          </span>
        ))}
      </div>
      <blockquote className="flex-1 text-base leading-relaxed text-slate-800">
        &ldquo;{review.text}&rdquo;
      </blockquote>
      <footer className="mt-4 border-t border-slate-200 pt-3 text-sm">
        <p className="font-semibold text-slate-900">{review.author}</p>
        {(review.location || review.service) && (
          <p className="mt-0.5 text-slate-500">
            {[review.location, review.service].filter(Boolean).join(' · ')}
          </p>
        )}
      </footer>
    </article>
  )
}
