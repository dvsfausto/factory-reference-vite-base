import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'
import { reviews } from '~/data/reviews'
import { SectionHeader } from '~/components/SectionHeader'

// Reviews VARIANT: 'glass-wall' — a masonry "wall" of frosted-glass cards of varied
// heights, the whole cluster held inside a brand-hairline frame with a faint brand tint.
// Longer reviews naturally take more vertical space, giving an editorial pinboard feel.
// Cards stagger in on scroll and lift + glow on hover.
//
// WOW tokens consumed (all brand-derived via color-mix, see styles/app.css):
//   · --wow-hairline    → the outer frame + each card's border.
//   · --wow-tint        → the faint brand wash inside the frame.
//   · --wow-grad-brand  → each card's small corner quotation mark.
//   · --wow-shadow-soft → card resting shadow.
//   · --wow-shadow-glow → card hover glow.
//   · --wow-ease-out    → entrance easing.
// BRAND identity → the "more" CTA keeps .btn utilities; stars use the semantic accent.
//
// HONESTY: only real reviews render; stars come solely from each review's `rating`.
// No invented ratings, counts or authors. Empty reviews → early-return null, matching
// the default ReviewsBlock's self-omit.
export function ReviewsGlassWallBlock({
  label = 'Reviews',
  heading = 'What customers',
  scriptAccent = 'say',
  moreLink = 'Read all reviews →',
}: {
  label?: string
  heading?: string
  scriptAccent?: string
  moreLink?: string
}) {
  const reduce = useReducedMotion()
  const previewReviews = reviews.slice(0, 6)
  if (previewReviews.length === 0) return null

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="container-x py-16 md:py-24">
        <SectionHeader label={label} heading={heading} scriptAccent={scriptAccent} />

        {/* Brand-hairline frame with a faint brand tint wash. */}
        <div
          className="rounded-[2rem] border p-4 sm:p-6 md:p-8"
          style={{ borderColor: 'var(--wow-hairline)', backgroundColor: 'var(--wow-tint)' }}
        >
          {/* CSS columns → varied-height masonry that stays SSR-safe (no JS layout). */}
          <div className="[column-fill:_balance] gap-5 sm:columns-2 lg:columns-3">
            {previewReviews.map((r, i) => (
              <motion.figure
                key={r.id}
                initial={reduce ? { opacity: 1 } : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{
                  duration: 0.6,
                  delay: reduce ? 0 : Math.min(i * 0.08, 0.4),
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={reduce ? undefined : { y: -4 }}
                className="group relative mb-5 block break-inside-avoid overflow-hidden rounded-2xl border bg-white/80 p-6 backdrop-blur-md transition-shadow"
                style={{ borderColor: 'var(--wow-hairline)', boxShadow: 'var(--wow-shadow-soft)' }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ boxShadow: 'var(--wow-shadow-glow)' }}
                />
                <div className="relative flex items-start justify-between">
                  <div className="flex gap-0.5">
                    {Array.from({ length: r.rating }).map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Quote
                    aria-hidden
                    className="h-7 w-7 shrink-0 opacity-25"
                    strokeWidth={1.5}
                    style={{
                      color: 'transparent',
                      backgroundImage: 'var(--wow-grad-brand)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                    }}
                    fill="currentColor"
                  />
                </div>

                <blockquote className="relative mt-3 leading-relaxed text-ink-700">
                  “{r.text}”
                </blockquote>

                <figcaption
                  className="relative mt-5 border-t pt-3 text-sm"
                  style={{ borderColor: 'var(--wow-hairline)' }}
                >
                  <span className="font-semibold text-ink-900">{r.author}</span>
                  {r.location && <span className="text-ink-500"> · {r.location}</span>}
                  {(r.service || r.date) && (
                    <div className="mt-0.5 text-xs text-ink-500">
                      {[r.service, r.date].filter(Boolean).join(' · ')}
                    </div>
                  )}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>

        {reviews.length > previewReviews.length && (
          <div className="mt-10 text-center">
            <Link to="/reviews" className="btn btn-md btn-secondary">
              {moreLink}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
