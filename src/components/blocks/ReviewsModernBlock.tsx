import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'
import { Star } from 'lucide-react'
import { SectionHeaderModern } from '~/components/SectionHeaderModern'
import { reviews as REVIEWS } from '~/data/reviews'

// Reviews VARIANT: 'modern', clean testimonials. SectionHeaderModern (no diamond,
// no script) + sharp minimal white quote cards on white, indigo stars, generous
// whitespace. Prop signature matches ReviewsBlock; returns Element | null.
//
// TOKEN DISCIPLINE: cool light surfaces component-owned; emerald-* (DNA → indigo)
// stars + the "read all" CTA; rounded-* (DNA, restrained); font-display.
export function ReviewsModernBlock({
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
    <section className="bg-white">
      <div className="container-x py-20 md:py-28">
        <SectionHeaderModern label={label} heading={heading} scriptAccent={scriptAccent} />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {previewReviews.map((r) => (
            <figure
              key={r.id}
              className="flex flex-col rounded-2xl border border-[#E6E8EC] bg-white p-7"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: r.rating ?? 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-emerald-600 text-emerald-600" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-[#0F172A]">
                {r.text}
              </blockquote>
              <figcaption className="mt-6 text-sm text-[#64748B]">
                <span className="font-display font-semibold text-[#0F172A]">{r.author}</span>
                {r.location && <span> · {r.location}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
        {reviews.length > previewReviews.length && (
          <div className="mt-12">
            <Link
              to="/reviews"
              className="inline-flex h-12 items-center rounded-xl border border-[#E6E8EC] px-6 font-display text-sm font-semibold text-[#0F172A] transition-colors hover:border-emerald-600 hover:text-emerald-700"
            >
              {moreLink}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
