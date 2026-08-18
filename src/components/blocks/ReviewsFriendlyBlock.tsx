import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'
import { Star } from 'lucide-react'
import { SectionHeaderFriendly } from '~/components/SectionHeaderFriendly'
import { reviews } from '~/data/reviews'

// Reviews VARIANT: 'friendly' — warm, bright testimonials. SectionHeaderFriendly
// (no ◆ diamond, no script) + white rounded quote cards on a peach-cream section.
// Prop signature matches ReviewsBlock; returns Element | null.
//
// TOKEN DISCIPLINE: light-warm surfaces component-owned; emerald-* (DNA → coral)
// stars + "read all" CTA; rounded-* (DNA, soft); font-display.
export function ReviewsFriendlyBlock({
  label = ((SITE as { homeReviews?: { label?: string; heading?: string; scriptAccent?: string } }).homeReviews?.label ?? 'Reviews'),
  heading = ((SITE as { homeReviews?: { label?: string; heading?: string; scriptAccent?: string } }).homeReviews?.heading ?? 'What customers'),
  scriptAccent = ((SITE as { homeReviews?: { label?: string; heading?: string; scriptAccent?: string } }).homeReviews?.scriptAccent ?? 'say'),
  moreLink = tr('section.readAllReviews'),
}: {
  label?: string
  heading?: string
  scriptAccent?: string
  moreLink?: string
}) {
  const previewReviews = reviews.slice(0, 6)
  if (previewReviews.length === 0) return null
  return (
    <section className="bg-[#FFF6EC]">
      <div className="container-x py-16 md:py-24">
        <SectionHeaderFriendly label={label} heading={heading} scriptAccent={scriptAccent} />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {previewReviews.map((r) => (
            <figure
              key={r.id}
              className="flex flex-col rounded-3xl border border-[#F0E6DA] bg-white p-6 shadow-sm"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: r.rating ?? 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-[#3D3530]">
                “{r.text}”
              </blockquote>
              <figcaption className="mt-5 text-sm text-[#7A6F66]">
                <span className="font-display font-semibold text-[#3D3530]">{r.author}</span>
                {r.location && <span> · {r.location}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
        {reviews.length > previewReviews.length && (
          <div className="mt-10">
            <Link
              to="/reviews"
              className="inline-flex h-12 items-center rounded-2xl border-2 border-emerald-600/40 bg-white px-6 font-display text-sm font-semibold text-[#3D3530] transition-colors hover:border-emerald-600 hover:bg-emerald-50"
            >
              {moreLink}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
