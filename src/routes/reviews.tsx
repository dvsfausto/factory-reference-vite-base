import { createFileRoute, notFound } from '@tanstack/react-router'
import { reviews as REVIEWS } from '~/data/reviews'
import { tr } from '~/lib/i18n'
import { buildMeta, breadcrumbLd } from '~/lib/seo'
import { SITE } from '~/data/site'
import { REVIEWS_LAYOUT } from '~/data/reviews-layout'
import { SectionList } from '~/components/render-section'

export const Route = createFileRoute('/reviews')({
  // ★ DATA-GATED (2026-09-04): with no reviews the page is a heading above nothing ("Verified customer
  //   reviews…" on 57 of 61 live sites). Like /services and /areas on an empty list, it does not exist:
  //   404 here, no nav link (Header/Footer read the same list), no sitemap entry (the emitter drops it).
  //   The first real review the owner pastes brings all three back — every gate reads REVIEWS.
  loader: () => {
    if (REVIEWS.length === 0) throw notFound()
  },
  head: () =>
    ({ ...buildMeta({
      title: `${tr('nav.reviews')} | ${SITE.name}`,
      description: `${tr('route.reviewsDesc')} ${SITE.name}.`,
      path: '/reviews',
    }), scripts: [{ type: 'application/ld+json', children: JSON.stringify(breadcrumbLd([{ name: tr('breadcrumb.home'), url: '/' }, { name: tr('nav.reviews'), url: '/reviews' }])) }] }),
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
          eyebrow: tr('nav.reviews'),
          heading: tr('nav.reviews'),
          body: tr('reviews.body'),
        },
      }}
    />
  )
}
