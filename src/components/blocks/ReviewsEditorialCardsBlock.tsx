import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'
import { reviews as REVIEWS } from '~/data/reviews'
import { EditorialButton, EditorialHeading, Kicker } from '~/components/editorial/Primitives'
import { spreadByCategory } from '~/lib/review-category'

// Reviews VARIANT: 'editorial-cards' (the Editorial look, ZB-147 W1.2). A two-column head (kicker left, serif heading
// right), then three beige cards with a hairline border: the quote in the display face between typographic quotes,
// the author as a small tracked line. The first three reviews with text; none → nothing. Below, when the business has
// its Google place id, a text link to ITS OWN Google reviews page (the exact profile, not a search).
//
// TOKEN DISCIPLINE: fam-* only; rhythm py-section. Takes the same props as ReviewsBlock (scriptAccent/moreLink unused).
export function ReviewsEditorialCardsBlock({
  reviews = REVIEWS,
  label = tr('editorial.reviewsKicker'),
  heading = tr('editorial.reviewsHeading'),
}: {
  reviews?: typeof REVIEWS
  label?: string
  heading?: string
  scriptAccent?: string
  moreLink?: string
}) {
  // three reviews that cover three kinds of work when the data allows it (one per category first), else the first three
  const shown = spreadByCategory(reviews.filter((r) => typeof r.text === 'string' && r.text.trim().length > 0)).slice(0, 3)
  if (shown.length === 0) return null
  const placeId = (SITE as { googlePlaceId?: string }).googlePlaceId
  return (
    <section className="bg-fam-page">
      <div className="container-x py-section">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-12">
          <Kicker>{label}</Kicker>
          <EditorialHeading text={heading} size="lg" />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {shown.map((r) => (
            <figure key={r.id} className="flex flex-col justify-between border border-fam-hairline bg-fam-surface-2 p-8">
              <blockquote className="font-display text-[22px] font-normal leading-relaxed text-fam-ink">
                “{r.text.trim()}”
              </blockquote>
              <figcaption className="mt-8 font-sans text-[11px] uppercase tracking-[0.18em] text-fam-ink-muted">
                — {r.author}
              </figcaption>
            </figure>
          ))}
        </div>

        {placeId && (
          <div className="mt-12 text-fam-ink">
            <EditorialButton href={`https://search.google.com/local/reviews?placeid=${encodeURIComponent(placeId)}`} tone="link" external>
              {tr('editorial.googleReviews')}
            </EditorialButton>
          </div>
        )}
      </div>
    </section>
  )
}
