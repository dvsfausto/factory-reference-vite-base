import { Link } from '@tanstack/react-router'
import { Star } from 'lucide-react'
import { SectionHeaderElegant } from '~/components/SectionHeaderElegant'
import { elegantSurface } from '~/lib/elegant-surface'
import { reviews } from '~/data/reviews'

// Reviews VARIANT: 'elegant' — refined testimonials. SectionHeaderElegant (serif,
// no ◆ diamond, no script) + quote cards whose surface comes from elegantSurface()
// — LIGHT by default (white cards on warm ivory), DARK on opt-in (leather cards,
// the original byte-identical). Prop signature matches ReviewsBlock; returns
// Element | null.
//
// TOKEN DISCIPLINE: surface neutrals from elegantSurface(); emerald-* (DNA accent)
// for the stars + the "read all" border; rounded-* (DNA); font-display serif.
export function ReviewsElegantBlock({
  label = 'In their words',
  heading = 'Regulars, and how they',
  scriptAccent = 'tell it',
  moreLink = 'Read all reviews',
}: {
  label?: string
  heading?: string
  scriptAccent?: string
  moreLink?: string
}) {
  const s = elegantSurface()
  const previewReviews = reviews.slice(0, 6)
  if (previewReviews.length === 0) return null
  return (
    <section className={s.section}>
      <div className="container-x py-20 md:py-28">
        <SectionHeaderElegant label={label} heading={heading} scriptAccent={scriptAccent} />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {previewReviews.map((r) => (
            <figure
              key={r.id}
              className={`flex flex-col rounded-xl border ${s.border} ${s.card} p-6`}
            >
              <div className="flex gap-0.5">
                {Array.from({ length: r.rating ?? 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-emerald-600 text-emerald-600" />
                ))}
              </div>
              <blockquote className={`mt-4 flex-1 font-display text-lg italic leading-relaxed ${s.text}`}>
                “{r.text}”
              </blockquote>
              <figcaption className={`mt-5 text-sm ${s.muted}`}>
                <span className={`font-medium ${s.text}`}>{r.author}</span>
                {r.location && <span> · {r.location}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
        {reviews.length > previewReviews.length && (
          <div className="mt-10">
            <Link
              to="/reviews"
              className={`inline-flex h-12 items-center rounded-lg border border-emerald-600/60 px-6 font-display text-sm font-medium uppercase tracking-[0.18em] ${s.text} transition-colors hover:border-emerald-600 hover:bg-emerald-600/10`}
            >
              {moreLink}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
