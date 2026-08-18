import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { Star, Quote } from 'lucide-react'
import { reviews } from '~/data/reviews'

// Reviews LAYOUT: 'spotlight' — one featured review carries real editorial weight
// (a large pull-quote in a prominent panel with a big quote mark and the author),
// flanked by a column of smaller supporting reviews. Character-agnostic.
//
// Editorial, not default-minus: the hero review is set at display scale with a
// decorative Quote glyph and an emerald rule; supporting cards are deliberately
// quieter so the eye lands on the spotlight first. Degrades gracefully — with a
// single review the supporting column simply omits.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary / text-primary-foreground (BRAND-
// owned). Accent -> emerald-* (DNA) restricted to 50/100/600/700: emerald-600
// stars + rule, emerald-50 spotlight wash. Radius -> rounded-* (DNA). Font ->
// font-display (DNA). Light surface component-owned (white / slate / #E6E8EC).
// Never bg-brand-* / .btn.
//
// Prop signature identical to ReviewsBlock; returns Element | null.
export function ReviewsSpotlightBlock({
  label = tr('nav.reviews'),
  heading = tr('section.whatCustomersSay'),
  moreLink = tr('section.readAllReviews'),
}: {
  label?: string
  heading?: string
  scriptAccent?: string
  moreLink?: string
}) {
  const all = reviews.slice(0, 5)
  if (all.length === 0) return null
  const [hero, ...rest] = all
  const supporting = rest.slice(0, 3)
  return (
    <section className="bg-white">
      <div className="container-x py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            <span className="h-px w-6 bg-emerald-600" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">
            {heading}
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <figure className="relative isolate flex flex-col justify-between overflow-hidden rounded-3xl bg-emerald-50 p-8 md:p-12 lg:col-span-2">
            <Quote className="absolute -right-4 -top-4 -z-10 h-40 w-40 text-emerald-100" strokeWidth={1} />
            <div>
              <div className="flex gap-1">
                {Array.from({ length: hero.rating ?? 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-emerald-600 text-emerald-600" />
                ))}
              </div>
              <blockquote className="mt-6 font-display text-2xl font-medium leading-snug tracking-tight text-[#0F172A] sm:text-3xl">
                {hero.text}
              </blockquote>
            </div>
            <figcaption className="mt-8 flex items-center gap-4">
              {hero.avatar ? (
                <img src={hero.avatar} alt={hero.author} className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-600 font-display font-semibold text-white">
                  {hero.author.slice(0, 1)}
                </span>
              )}
              <span className="text-sm text-[#64748B]">
                <span className="block font-display font-semibold text-[#0F172A]">{hero.author}</span>
                {hero.location && <span>{hero.location}</span>}
              </span>
            </figcaption>
          </figure>

          {supporting.length > 0 && (
            <div className="flex flex-col gap-6">
              {supporting.map((r) => (
                <figure key={r.id} className="flex flex-1 flex-col rounded-2xl border border-[#E6E8EC] p-6">
                  <div className="flex gap-0.5">
                    {Array.from({ length: r.rating ?? 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-emerald-600 text-emerald-600" />
                    ))}
                  </div>
                  <blockquote className="mt-3 flex-1 leading-relaxed text-[#0F172A]">{r.text}</blockquote>
                  <figcaption className="mt-4 text-sm text-[#64748B]">
                    <span className="font-display font-semibold text-[#0F172A]">{r.author}</span>
                    {r.location && <span> · {r.location}</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>

        {reviews.length > all.length && (
          <div className="mt-12">
            <Link
              to="/reviews"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-7 font-display text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {moreLink}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
