import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { motion, useReducedMotion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'
import { reviews } from '~/data/reviews'
import { SectionHeader } from '~/components/SectionHeader'

// Reviews VARIANT: 'luminous', a set of frosted-glass quote cards floating over a
// soft radial brand-tinted surface. Each card carries a big brand-gradient quotation
// mark and lifts + glows on hover; the cards stagger in on scroll. The airy, boutique
// counterpart to the flat default grid.
//
// WOW tokens consumed (all brand-derived via color-mix, see styles/app.css):
//   · --wow-grad-surface → the section's soft radial brand tint background.
//   · --wow-grad-brand   → the oversized quotation mark fill.
//   · --wow-hairline     → each glass card's hairline border.
//   · --wow-shadow-soft  → the card resting shadow.
//   · --wow-shadow-glow  → the card hover glow.
//   · --wow-ease-out     → entrance easing.
// BRAND identity → the "more" CTA keeps the .btn utilities; the script accent and
// stars use the brand/semantic accents. NEUTRALS via ink-*/white.
//
// HONESTY: renders ONLY real reviews. Stars come solely from each review's `rating`;
// no counts, ratings or names are invented. Empty reviews → early-return null, exactly
// as the default ReviewsBlock does. Content is props with the default component's literals.
export function ReviewsLuminousBlock({
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
  if (previewReviews.length === 0) return null

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundImage: 'var(--wow-grad-surface)' }}
    >
      <div className="container-x py-16 md:py-24">
        <SectionHeader label={label} heading={heading} scriptAccent={scriptAccent} />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {previewReviews.map((r, i) => (
            <motion.figure
              key={r.id}
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{
                duration: 0.6,
                delay: reduce ? 0 : Math.min(i * 0.08, 0.4),
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={reduce ? undefined : { y: -6 }}
              className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border bg-white/70 p-7 backdrop-blur-md transition-shadow"
              style={{ borderColor: 'var(--wow-hairline)', boxShadow: 'var(--wow-shadow-soft)' }}
            >
              {/* Oversized brand-gradient quotation mark. */}
              <Quote
                aria-hidden
                className="pointer-events-none absolute -right-3 -top-3 h-24 w-24 opacity-15"
                strokeWidth={1}
                style={{
                  color: 'transparent',
                  backgroundImage: 'var(--wow-grad-brand)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                }}
                fill="currentColor"
              />
              {/* Hover glow ring (applied via inline shadow on group-hover). */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[1.5rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ boxShadow: 'var(--wow-shadow-glow)' }}
              />

              <div className="relative flex gap-0.5">
                {Array.from({ length: r.rating }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <blockquote className="relative mt-4 flex-1 text-lg leading-relaxed text-ink-700">
                “{r.text}”
              </blockquote>

              <figcaption
                className="relative mt-6 border-t pt-4 text-sm"
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
