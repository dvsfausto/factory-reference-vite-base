import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'
import { ArrowUpRight } from 'lucide-react'
import { SectionHeaderCreative } from '~/components/SectionHeaderCreative'
import { reviews as REVIEWS } from '~/data/reviews'

// Reviews VARIANT: 'creative', expressive testimonials. SectionHeaderCreative
// (no diamond, no script) + big magenta quote marks on bold off-white cards.
// Prop signature matches ReviewsBlock; returns Element | null.
//
// TOKEN DISCIPLINE: expressive light surfaces component-owned; emerald-* (DNA →
// magenta) quote marks + the "read all" CTA; rounded-* (DNA, large); font-display.
export function ReviewsCreativeBlock({
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
        <SectionHeaderCreative label={label} heading={heading} scriptAccent={scriptAccent} />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {previewReviews.map((r) => (
            <figure
              key={r.id}
              className="flex flex-col rounded-3xl bg-[#FBFAFC] p-8"
            >
              <span className="font-display text-6xl font-extrabold leading-none text-emerald-600">“</span>
              <blockquote className="-mt-3 flex-1 font-display text-xl font-semibold leading-snug text-[#18181B]">
                {r.text}
              </blockquote>
              <figcaption className="mt-6 text-sm text-[#71717A]">
                <span className="font-display font-bold text-[#18181B]">{r.author}</span>
                {r.location && <span> · {r.location}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
        {reviews.length > previewReviews.length && (
          <div className="mt-14">
            <Link
              to="/reviews"
              className="inline-flex h-14 items-center gap-2 rounded-2xl border-2 border-[#18181B] px-7 font-display text-base font-bold text-[#18181B] transition-colors hover:bg-emerald-600 hover:border-emerald-600 hover:text-white"
            >
              {moreLink} <ArrowUpRight className="h-5 w-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
