import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { motion, useReducedMotion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'
import { reviews, getAggregateRating } from '~/data/reviews'
import { SectionHeader } from '~/components/SectionHeader'

// Reviews VARIANT: 'pull-quote', an editorial spotlight. One large featured review is
// set as an oversized pull-quote beside a brand-gradient rule; when there are genuinely
// enough reviews to compute one, the REAL aggregate rating sits alongside it. The
// remaining reviews trail below as small frosted-glass chips. Typographic and restrained.
//
// WOW tokens consumed (all brand-derived via color-mix, see styles/app.css):
//   · --wow-grad-brand   → the vertical rule beside the pull-quote + the mark fill.
//   · --wow-grad-surface → the section's soft radial brand tint background.
//   · --wow-hairline     → the glass chips' hairline borders.
//   · --wow-shadow-glow  → the aggregate-rating badge glow.
//   · --wow-shadow-soft  → the chip resting shadow.
//   · --wow-ease-out     → entrance easing.
// BRAND identity → the "more" CTA keeps .btn utilities; stars use the semantic accent.
//
// HONESTY: the featured quote and chips are real reviews only; stars come solely from
// each review's `rating`. The aggregate badge renders ONLY when getAggregateRating()
// is non-null (i.e. real reviews exist), never a fabricated score. Empty reviews →
// early-return null, matching the default ReviewsBlock.
export function ReviewsPullQuoteBlock({
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
  const reduce = useReducedMotion()
  const previewReviews = reviews.slice(0, 6)
  const featured = previewReviews[0]
  if (!featured) return null

  const rest = previewReviews.slice(1)
  const rating = getAggregateRating()

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundImage: 'var(--wow-grad-surface)' }}
    >
      <div className="container-x py-16 md:py-24">
        <SectionHeader label={label} heading={heading} scriptAccent={scriptAccent} align="left" />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Featured pull-quote. */}
          <motion.figure
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative lg:col-span-8"
          >
            <div className="flex gap-6">
              {/* Brand-gradient vertical rule. */}
              <div
                aria-hidden
                className="mt-2 hidden w-1.5 shrink-0 rounded-full sm:block"
                style={{ backgroundImage: 'var(--wow-grad-brand)' }}
              />
              <div className="min-w-0">
                <Quote
                  aria-hidden
                  className="h-12 w-12"
                  strokeWidth={1.25}
                  style={{
                    color: 'transparent',
                    backgroundImage: 'var(--wow-grad-brand)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                  }}
                  fill="currentColor"
                />
                <blockquote className="mt-3 font-display text-2xl leading-snug text-ink-900 sm:text-3xl">
                  “{featured.text}”
                </blockquote>
                <figcaption className="mt-6 text-sm">
                  <div className="flex gap-0.5">
                    {Array.from({ length: featured.rating }).map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div className="mt-2 font-semibold text-ink-900">
                    {featured.author}
                    {featured.location && (
                      <span className="font-normal text-ink-500"> · {featured.location}</span>
                    )}
                  </div>
                  {(featured.service || featured.date) && (
                    <div className="mt-0.5 text-xs text-ink-500">
                      {[featured.service, featured.date].filter(Boolean).join(' · ')}
                    </div>
                  )}
                </figcaption>
              </div>
            </div>
          </motion.figure>

          {/* Aggregate rating, ONLY when real (getAggregateRating() non-null). */}
          {rating && (
            <motion.div
              initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6, delay: reduce ? 0 : 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-4"
            >
              <div
                className="flex h-full flex-col justify-center rounded-[1.5rem] border bg-white/75 p-8 text-center backdrop-blur-md"
                style={{ borderColor: 'var(--wow-hairline)', boxShadow: 'var(--wow-shadow-glow)' }}
              >
                <span className="text-5xl font-bold tracking-tight text-ink-900">
                  {rating.value.toFixed(1)}
                </span>
                <div className="mt-2 flex justify-center gap-0.5">
                  {Array.from({ length: Math.round(rating.value) }).map((_, s) => (
                    <Star key={s} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="mt-2 text-sm text-ink-500">
                  from {rating.count} review{rating.count === 1 ? '' : 's'}
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Remaining reviews as small glass chips. */}
        {rest.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((r, i) => (
              <motion.figure
                key={r.id}
                initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{
                  duration: 0.5,
                  delay: reduce ? 0 : Math.min(i * 0.07, 0.35),
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="rounded-2xl border bg-white/65 p-5 backdrop-blur-md"
                style={{ borderColor: 'var(--wow-hairline)', boxShadow: 'var(--wow-shadow-soft)' }}
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: r.rating }).map((_, s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="mt-3 line-clamp-4 text-sm leading-relaxed text-ink-700">
                  “{r.text}”
                </blockquote>
                <figcaption className="mt-3 text-xs font-semibold text-ink-900">
                  {r.author}
                  {r.location && <span className="font-normal text-ink-500"> · {r.location}</span>}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        )}

        {reviews.length > previewReviews.length && (
          <div className="mt-10 text-center lg:text-left">
            <Link to="/reviews" className="btn btn-md btn-secondary">
              {moreLink}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
