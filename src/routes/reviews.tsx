import { createFileRoute } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { buildMeta } from '~/lib/seo'
import { SITE } from '~/data/site'
import { REVIEWS_LAYOUT } from '~/data/reviews-layout'
import { SectionList } from '~/components/render-section'

export const Route = createFileRoute('/reviews')({
  head: () =>
    buildMeta({
      title: `Reviews — ${SITE.name}`,
      description: `What customers say about ${SITE.name}.`,
      path: '/reviews',
    }),
  component: ReviewsPage,
})

// The /reviews page now renders through the SHARED renderer (Arc 3 · Stage B): the
// old bg-slate intro + ReviewsSection + CTA JSX is replaced by REVIEWS_LAYOUT. The
// WOW page-intro copy is passed as ctx.intro (shared IntroBlock), the 'reviewsIndex'
// block renders the FULL reviews list (ALL reviews, count 50 — self-omitting when
// there are none, which is honest), and the cta is the WOW aurora-glow with the
// original CTA copy preserved. Reveal is applied by SectionList.
function ReviewsPage() {
  return (
    <SectionList
      blocks={REVIEWS_LAYOUT}
      ctx={{
        intro: {
          eyebrow: 'Reviews',
          heading: 'Reviews',
          body: tr('reviews.body'),
        },
      }}
    />
  )
}
