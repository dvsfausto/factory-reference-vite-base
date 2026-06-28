import { Link } from '@tanstack/react-router'
import { SITE } from '~/data/site'
import { SectionHeaderBold } from '~/components/SectionHeaderBold'
import { ReviewCard } from '~/components/ReviewCard'
import { reviews } from '~/data/reviews'

// Reviews VARIANT: 'bold' — identical to ReviewsBlock except it wires in the
// EXISTING SectionHeaderBold (solid Oswald, no ◆ diamond divider, no script
// flourish) instead of the default SectionHeader. Targeted polish, gated to the
// 'bold' variant so other verticals keep the default header byte-identically.
// Prop signature matches ReviewsBlock.
export function ReviewsBoldBlock({
  label = ((SITE as { homeReviews?: { label?: string; heading?: string; scriptAccent?: string } }).homeReviews?.label ?? 'Reviews'),
  heading = ((SITE as { homeReviews?: { label?: string; heading?: string; scriptAccent?: string } }).homeReviews?.heading ?? 'What customers'),
  scriptAccent = ((SITE as { homeReviews?: { label?: string; heading?: string; scriptAccent?: string } }).homeReviews?.scriptAccent ?? 'say'),
  moreLink = 'Read all reviews',
}: {
  label?: string
  heading?: string
  scriptAccent?: string
  moreLink?: string
}) {
  const previewReviews = reviews.slice(0, 6)
  if (previewReviews.length === 0) return null
  return (
    <section className="bg-background border-y border-ink-100">
      <div className="container-x py-16 md:py-24">
        <SectionHeaderBold label={label} heading={heading} scriptAccent={scriptAccent} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {previewReviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
        {reviews.length > previewReviews.length && (
          <div className="mt-10">
            <Link
              to="/reviews"
              className="inline-flex h-12 items-center rounded-md border border-ink-300 px-6 font-display text-sm font-semibold uppercase tracking-wide text-ink-900 transition-colors hover:border-emerald-600 hover:text-emerald-700"
            >
              {moreLink}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
