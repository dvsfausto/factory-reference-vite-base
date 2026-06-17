import { createFileRoute } from '@tanstack/react-router'
import { JsonLd } from '~/components/JsonLd'
import { faqLd } from '~/lib/seo'
import { SITE } from '~/data/site'
import type { FAQ } from '~/lib/types/page-types'
import { HOMEPAGE_LAYOUT, type LayoutBlock } from '~/data/layout'
import { HeroBlock } from '~/components/blocks/HeroBlock'
import { HeroBoldFullbleedBlock } from '~/components/blocks/HeroBoldFullbleedBlock'
import { TaglineBarBlock } from '~/components/blocks/TaglineBarBlock'
import { LocalBarBlock } from '~/components/blocks/LocalBarBlock'
import { TrustBarBlock } from '~/components/blocks/TrustBarBlock'
import { ServicesPreviewBlock } from '~/components/blocks/ServicesPreviewBlock'
import { ServiceAreasBlock } from '~/components/blocks/ServiceAreasBlock'
import { ReviewsBlock } from '~/components/blocks/ReviewsBlock'
import { FaqBlock } from '~/components/blocks/FaqBlock'
import { CtaBlock } from '~/components/blocks/CtaBlock'

// Homepage FAQ — vertical-varied, emitted into SITE.homeFaqs by the scaffolder
// (Phase 1 copy de-leak). No longer a hardcoded network-wide constant.
const HOME_FAQS: FAQ[] = SITE.homeFaqs

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: `${SITE.name} — ${SITE.tagline}` },
      { name: 'description', content: SITE.tagline },
      { property: 'og:title', content: SITE.name },
      { property: 'og:description', content: SITE.tagline },
      { property: 'og:url', content: SITE.domain },
    ],
    links: [{ rel: 'canonical', href: SITE.domain }],
  }),
  component: HomePage,
})

// Per-type component VARIANTS. A block may select an alternate composition of
// the same type via block.variant; an absent/unknown variant falls back to the
// block's default component (backward-compat). Keyed type → variant id →
// component. Today only 'hero' has a variant ('bold-fullbleed', for trades).
const HERO_VARIANTS: Record<string, typeof HeroBlock> = {
  'bold-fullbleed': HeroBoldFullbleedBlock,
}

// Map a layout block to its rendered section. Order/presence are driven by
// HOMEPAGE_LAYOUT (src/data/layout.ts); each block owns its own markup +
// data-conditional auto-omit. The faq block receives HOME_FAQS from this route
// (the scaffolder-target constant above).
function renderBlock(block: LayoutBlock) {
  switch (block.type) {
    case 'hero': {
      const HeroComponent = HERO_VARIANTS[block.variant ?? ''] ?? HeroBlock
      return (
        <HeroComponent
          key="hero"
          trustItems={block.params?.trustItems as string[] | undefined}
          decorativeAsset={block.params?.decorativeAsset as string | undefined}
        />
      )
    }
    case 'taglineBar':
      return <TaglineBarBlock key="taglineBar" />
    case 'localBar':
      return (
        <LocalBarBlock
          key="localBar"
          label={block.params?.label as string | undefined}
        />
      )
    case 'trustBar':
      return (
        <TrustBarBlock
          key="trustBar"
          items={
            block.params?.items as
              | { title: string; description: string }[]
              | undefined
          }
        />
      )
    case 'servicesPreview':
      return (
        <ServicesPreviewBlock
          key="servicesPreview"
          label={block.params?.label as string | undefined}
          heading={block.params?.heading as string | undefined}
          scriptAccent={block.params?.scriptAccent as string | undefined}
          body={block.params?.body as string | undefined}
          exploreLabel={block.params?.exploreLabel as string | undefined}
          moreLink={block.params?.moreLink as string | undefined}
        />
      )
    case 'serviceAreas':
      return (
        <ServiceAreasBlock
          key="serviceAreas"
          label={block.params?.label as string | undefined}
          heading={block.params?.heading as string | undefined}
          scriptAccent={block.params?.scriptAccent as string | undefined}
          body={block.params?.body as string | undefined}
          moreLink={block.params?.moreLink as string | undefined}
        />
      )
    case 'reviews':
      return (
        <ReviewsBlock
          key="reviews"
          label={block.params?.label as string | undefined}
          heading={block.params?.heading as string | undefined}
          scriptAccent={block.params?.scriptAccent as string | undefined}
          moreLink={block.params?.moreLink as string | undefined}
        />
      )
    case 'faq':
      return (
        <FaqBlock
          key="faq"
          faqs={HOME_FAQS}
          title={block.params?.title as string | undefined}
        />
      )
    case 'cta':
      return (
        <CtaBlock
          key="cta"
          title={block.params?.title as string | undefined}
          subtitle={block.params?.subtitle as string | undefined}
        />
      )
  }
}

function HomePage() {
  return (
    <>
      <JsonLd data={faqLd(HOME_FAQS)} />
      {HOMEPAGE_LAYOUT.map(renderBlock)}
    </>
  )
}
