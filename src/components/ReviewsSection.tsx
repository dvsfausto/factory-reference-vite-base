import { useState } from 'react'
import { getAggregateRating, getHomepageReviews, reviews } from '~/data/reviews'
import { tr } from '~/lib/i18n'
import { reviewCategory } from '~/lib/review-category'
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
  /* ★ BY CATEGORY (ZB-147 W1.3): each review's category is the service it names (its own `service` field, else the
     business's service whose name its text shares a word with; see lib/review-category). With two or more categories the
     page offers them as filters; a review naming no service sits under "General". Nothing is invented: a review
     without a service word is never assigned one. */
  const [picked, setPicked] = useState<string>('')
  if (reviews.length === 0) return null
  const all = getHomepageReviews(count)
  const categories = Array.from(new Set(all.map((r) => reviewCategory(r)).filter((c): c is string => !!c)))
  const withGeneral = all.some((r) => !reviewCategory(r))
  const showFilter = categories.length >= 2
  const display = !showFilter || !picked ? all : all.filter((r) => (picked === '__general' ? !reviewCategory(r) : reviewCategory(r) === picked))
  const agg = getAggregateRating()
  return (
    <section className="bg-fam-card">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {heading}
          </h2>
          {agg && (
            <p className="mt-4 text-sm text-slate-600">
              {agg.value.toFixed(1)} {tr('blk.of5Across')} {agg.count}{' '}
              {agg.count === 1 ? tr('blk.review') : tr('blk.reviews')}
            </p>
          )}
          {intro && (
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-700">
              {intro}
            </p>
          )}
        </div>
        {showFilter && (
          <div className="mx-auto mt-8 flex max-w-5xl flex-wrap justify-center gap-2" role="group" aria-label={tr('blk.byCategory')} data-review-categories>
            {[{ key: '', label: tr('blk.allCategories'), n: all.length }, ...categories.map((c) => ({ key: c, label: c, n: all.filter((r) => reviewCategory(r) === c).length })), ...(withGeneral ? [{ key: '__general', label: tr('blk.general'), n: all.filter((r) => !reviewCategory(r)).length }] : [])].map((c) => (
              <button key={c.key || 'all'} type="button" aria-pressed={picked === c.key} onClick={() => setPicked(c.key)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${picked === c.key ? 'border-fam-ink bg-fam-ink text-fam-on-dark' : 'border-fam-hairline bg-fam-card text-fam-ink hover:border-fam-ink'}`}>
                {c.label} <span className="opacity-70">{c.n}</span>
              </button>
            ))}
          </div>
        )}
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
    <article className="flex h-full flex-col rounded-2xl bg-fam-surface-slate p-6">
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
      <footer className="mt-4 border-t border-fam-line-slate pt-3 text-sm">
        <p className="font-semibold text-slate-900">{review.author}</p>
        {(review.location || reviewCategory(review)) && (
          <p className="mt-0.5 text-slate-500">
            {[review.location, reviewCategory(review)].filter(Boolean).join(' · ')}
          </p>
        )}
        {review.source === 'google' && review.url && (
          <a href={review.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs text-slate-500 underline-offset-2 hover:underline" data-review-source="google">
            {tr('review.readOnGoogle')}
          </a>
        )}
      </footer>
    </article>
  )
}
