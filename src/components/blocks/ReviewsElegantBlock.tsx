import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'
import { ArrowRight } from 'lucide-react'
import { elegantSurface } from '~/lib/elegant-surface'
import { reviews } from '~/data/reviews'

// Reviews VARIANT: 'elegant', refined testimonials. SectionHeaderElegant (serif,
// no ◆ diamond, no script) + quote cards whose surface comes from elegantSurface()
//, LIGHT by default (white cards on warm ivory), DARK on opt-in (leather cards,
// the original byte-identical). Prop signature matches ReviewsBlock; returns
// Element | null.
//
// TOKEN DISCIPLINE: surface neutrals from elegantSurface(); emerald-* (DNA accent)
// for the stars + the "read all" border; rounded-* (DNA); font-display serif.
export function ReviewsElegantBlock({
  label = ((SITE as { homeReviews?: { label?: string; heading?: string; scriptAccent?: string } }).homeReviews?.label ?? tr('nav.reviews')),
  heading = ((SITE as { homeReviews?: { label?: string; heading?: string; scriptAccent?: string } }).homeReviews?.heading ?? tr('section.whatCustomersHeading')),
  scriptAccent = ((SITE as { homeReviews?: { label?: string; heading?: string; scriptAccent?: string } }).homeReviews?.scriptAccent ?? tr('section.sayAccent')),
  moreLink = tr('section.readAllReviews'),
}: {
  label?: string
  heading?: string
  scriptAccent?: string
  moreLink?: string
}) {
  const s = elegantSurface()
  const previewReviews = reviews.slice(0, 5)
  if (previewReviews.length === 0) return null
  const [featured, ...rest] = previewReviews
  void heading
  void scriptAccent
  void label
  // EDITORIAL, taste-skill revised: NO eyebrow (the pull-quote leads). One large featured pull-quote, then
  // supporting quotes as two hairline-divided columns (a letters-to-the-editor page), NOT a card grid.
  return (
    <section className={s.section}>
      <div className="container-x py-20 md:py-28">
        {featured && (
          <figure className="max-w-4xl">
            <div className="font-display text-7xl leading-none text-emerald-700/30" aria-hidden>“</div>
            <blockquote className={`-mt-8 font-display text-3xl font-medium italic leading-snug ${s.text} sm:text-[2.5rem] sm:leading-[1.15]`}>
              {featured.text}
            </blockquote>
            <figcaption className={`mt-6 text-xs uppercase tracking-[0.2em] ${s.muted}`}>
              <span className={s.text}>{featured.author}</span>
              {featured.location && ` · ${featured.location}`}
            </figcaption>
          </figure>
        )}
        {rest.length > 0 && (
          <div className={`mt-14 grid grid-cols-1 gap-x-16 border-t ${s.border} pt-2 md:grid-cols-2`}>
            {rest.map((r) => (
              <figure key={r.id} className={`border-b ${s.border} py-8`}>
                <blockquote className={`font-display text-lg italic leading-relaxed ${s.text}`}>“{r.text}”</blockquote>
                <figcaption className={`mt-4 text-xs uppercase tracking-[0.16em] ${s.muted}`}>
                  <span className={s.text}>{r.author}</span>
                  {r.location && ` · ${r.location}`}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
        {reviews.length > previewReviews.length && (
          <div className="mt-12">
            <Link to="/reviews" className="inline-flex items-center gap-2 font-display text-sm font-medium uppercase tracking-[0.18em] text-emerald-800 underline-offset-4 transition-colors hover:underline">
              {moreLink} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
