import { Link } from '@tanstack/react-router'
import { SITE } from '~/data/site'
import { Star } from 'lucide-react'
import { SectionHeaderCorporate } from '~/components/SectionHeaderCorporate'
import { reviews } from '~/data/reviews'

// Reviews VARIANT: 'corporate' — formal client testimonials. SectionHeaderCorporate
// (no diamond, no script) + boxed bordered quote cards on a cool blue-gray section.
// Prop signature matches ReviewsBlock; returns Element | null.
//
// TOKEN DISCIPLINE: structured light surfaces component-owned; emerald-* (DNA →
// navy) stars + the "read all" CTA; rounded-* (DNA, tight); font-display.
export function ReviewsCorporateBlock({
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
    <section className="border-y border-[#D8DEE7] bg-[#F4F6F9]">
      <div className="container-x py-16 md:py-20">
        <SectionHeaderCorporate label={label} heading={heading} scriptAccent={scriptAccent} />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {previewReviews.map((r) => (
            <figure
              key={r.id}
              className="flex flex-col rounded-lg border border-[#D8DEE7] bg-white p-7"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: r.rating ?? 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-emerald-600 text-emerald-600" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-[#1A2433]">
                {r.text}
              </blockquote>
              <figcaption className="mt-6 border-t border-[#D8DEE7] pt-4 text-sm text-[#5A6678]">
                <span className="font-display font-semibold text-[#1A2433]">{r.author}</span>
                {r.location && <span> · {r.location}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
        {reviews.length > previewReviews.length && (
          <div className="mt-10">
            <Link
              to="/reviews"
              className="inline-flex h-12 items-center rounded-md border border-[#D8DEE7] bg-white px-6 font-display text-sm font-semibold text-[#1A2433] transition-colors hover:border-emerald-600 hover:text-emerald-700"
            >
              {moreLink}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
