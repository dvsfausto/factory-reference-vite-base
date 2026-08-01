import { createFileRoute } from '@tanstack/react-router'
import { buildMeta } from '~/lib/seo'
import { SITE } from '~/data/site'
import { PRICING_LAYOUT } from '~/data/pricing-layout'
import { SectionList } from '~/components/render-section'

export const Route = createFileRoute('/pricing')({
  head: () =>
    buildMeta({
      title: `Pricing — ${SITE.name}`,
      description: `Transparent pricing from ${SITE.name}.`,
      path: '/pricing',
    }),
  component: PricingPage,
})

// The /pricing page now renders through the SHARED renderer (Arc 3 · Stage B): the
// page-local renderPricingBlock + PricingIntro are gone. The WOW page-intro copy is
// passed as ctx.intro (shared IntroBlock, body = SITE.pricing, self-omitting when
// absent), and PRICING_LAYOUT selects the WOW variants (pricing → luxe-glass,
// trustBar → glow-cards, faq → glass-accordion, cta → aurora-glow). ctx.faqs feeds the
// faq case; the FAQ block self-omits when there are no homepage FAQs. Reveal is applied
// by SectionList.
function PricingPage() {
  return (
    <SectionList
      blocks={PRICING_LAYOUT}
      ctx={{
        intro: {
          eyebrow: 'Pricing',
          heading: 'Simple, honest pricing',
          body: SITE.pricing,
        },
        faqs: SITE.homeFaqs,
      }}
    />
  )
}
