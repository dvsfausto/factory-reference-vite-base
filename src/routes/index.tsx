import { createFileRoute } from '@tanstack/react-router'
import { JsonLd } from '~/components/JsonLd'
import { faqLd } from '~/lib/seo'
import { SITE } from '~/data/site'
import type { FAQ } from '~/lib/types/page-types'
import { HOMEPAGE_LAYOUT, type LayoutBlock } from '~/data/layout'
import { HeroBlock } from '~/components/blocks/HeroBlock'
import { HeroBoldFullbleedBlock } from '~/components/blocks/HeroBoldFullbleedBlock'
import { HeroElegantBlock } from '~/components/blocks/HeroElegantBlock'
import { HeroFriendlyBlock } from '~/components/blocks/HeroFriendlyBlock'
import { HeroModernBlock } from '~/components/blocks/HeroModernBlock'
import { HeroCorporateBlock } from '~/components/blocks/HeroCorporateBlock'
import { HeroCreativeBlock } from '~/components/blocks/HeroCreativeBlock'
import { HeroCenteredBlock } from '~/components/blocks/HeroCenteredBlock'
import { HeroBackgroundBlock } from '~/components/blocks/HeroBackgroundBlock'
import { HeroSplitReversedBlock } from '~/components/blocks/HeroSplitReversedBlock'
import { HeroMinimalBlock } from '~/components/blocks/HeroMinimalBlock'
import { HeroVideoBlock } from '~/components/blocks/HeroVideoBlock'
import { TaglineBarBlock } from '~/components/blocks/TaglineBarBlock'
import { LocalBarBlock } from '~/components/blocks/LocalBarBlock'
import { TrustBarBlock } from '~/components/blocks/TrustBarBlock'
import { TrustBarBoldBlock } from '~/components/blocks/TrustBarBoldBlock'
import { TrustBarElegantBlock } from '~/components/blocks/TrustBarElegantBlock'
import { TrustBarFriendlyBlock } from '~/components/blocks/TrustBarFriendlyBlock'
import { TrustBarModernBlock } from '~/components/blocks/TrustBarModernBlock'
import { TrustBarCorporateBlock } from '~/components/blocks/TrustBarCorporateBlock'
import { TrustBarCreativeBlock } from '~/components/blocks/TrustBarCreativeBlock'
import { TrustBarStatNumbersBlock } from '~/components/blocks/TrustBarStatNumbersBlock'
import { TrustBarLogoStripBlock } from '~/components/blocks/TrustBarLogoStripBlock'
import { TrustBarCredentialCellsBlock } from '~/components/blocks/TrustBarCredentialCellsBlock'
import { ServicesPreviewBlock } from '~/components/blocks/ServicesPreviewBlock'
import { ServicesBoldBlock } from '~/components/blocks/ServicesBoldBlock'
import { ServicesElegantBlock } from '~/components/blocks/ServicesElegantBlock'
import { ServicesFriendlyBlock } from '~/components/blocks/ServicesFriendlyBlock'
import { ServicesModernBlock } from '~/components/blocks/ServicesModernBlock'
import { ServicesCorporateBlock } from '~/components/blocks/ServicesCorporateBlock'
import { ServicesCreativeBlock } from '~/components/blocks/ServicesCreativeBlock'
import { ServicesAlternatingRowsBlock } from '~/components/blocks/ServicesAlternatingRowsBlock'
import { ServicesBentoBlock } from '~/components/blocks/ServicesBentoBlock'
import { ServicesListBlock } from '~/components/blocks/ServicesListBlock'
import { ServicesIconTilesBlock } from '~/components/blocks/ServicesIconTilesBlock'
import { ServicesCarouselBlock } from '~/components/blocks/ServicesCarouselBlock'
import { ServiceAreasBlock } from '~/components/blocks/ServiceAreasBlock'
import { ServiceAreasBoldBlock } from '~/components/blocks/ServiceAreasBoldBlock'
import { ServiceAreasElegantBlock } from '~/components/blocks/ServiceAreasElegantBlock'
import { ServiceAreasFriendlyBlock } from '~/components/blocks/ServiceAreasFriendlyBlock'
import { ServiceAreasModernBlock } from '~/components/blocks/ServiceAreasModernBlock'
import { ServiceAreasCorporateBlock } from '~/components/blocks/ServiceAreasCorporateBlock'
import { ServiceAreasCreativeBlock } from '~/components/blocks/ServiceAreasCreativeBlock'
import { ServiceAreasMapStyleBlock } from '~/components/blocks/ServiceAreasMapStyleBlock'
import { ServiceAreasColumnedListBlock } from '~/components/blocks/ServiceAreasColumnedListBlock'
import { ServiceAreasCardsBlock } from '~/components/blocks/ServiceAreasCardsBlock'
import { ServiceAreasStackedBlock } from '~/components/blocks/ServiceAreasStackedBlock'
import { ReviewsBlock } from '~/components/blocks/ReviewsBlock'
import { ReviewsBoldBlock } from '~/components/blocks/ReviewsBoldBlock'
import { ReviewsElegantBlock } from '~/components/blocks/ReviewsElegantBlock'
import { ReviewsFriendlyBlock } from '~/components/blocks/ReviewsFriendlyBlock'
import { ReviewsModernBlock } from '~/components/blocks/ReviewsModernBlock'
import { ReviewsCorporateBlock } from '~/components/blocks/ReviewsCorporateBlock'
import { ReviewsCreativeBlock } from '~/components/blocks/ReviewsCreativeBlock'
import { ReviewsSpotlightBlock } from '~/components/blocks/ReviewsSpotlightBlock'
import { ReviewsCarouselBlock } from '~/components/blocks/ReviewsCarouselBlock'
import { ReviewsMasonryBlock } from '~/components/blocks/ReviewsMasonryBlock'
import { ReviewsStackedBlock } from '~/components/blocks/ReviewsStackedBlock'
import { FaqBlock } from '~/components/blocks/FaqBlock'
import { CtaBlock } from '~/components/blocks/CtaBlock'
import { CtaBoldBlock } from '~/components/blocks/CtaBoldBlock'
import { CtaElegantBlock } from '~/components/blocks/CtaElegantBlock'
import { CtaFriendlyBlock } from '~/components/blocks/CtaFriendlyBlock'
import { CtaModernBlock } from '~/components/blocks/CtaModernBlock'
import { CtaCorporateBlock } from '~/components/blocks/CtaCorporateBlock'
import { CtaCreativeBlock } from '~/components/blocks/CtaCreativeBlock'
import { CtaColorBlock } from '~/components/blocks/CtaColorBlock'
import { CtaSplitWithImageBlock } from '~/components/blocks/CtaSplitWithImageBlock'
import { CtaBoxedCardBlock } from '~/components/blocks/CtaBoxedCardBlock'
import { CtaStackedCenteredBlock } from '~/components/blocks/CtaStackedCenteredBlock'

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
  elegant: HeroElegantBlock,
  friendly: HeroFriendlyBlock,
  modern: HeroModernBlock,
  corporate: HeroCorporateBlock,
  creative: HeroCreativeBlock,
  // LAYOUT variants (composite scheme): character-agnostic re-compositions of the
  // hero, orthogonal to the character keys above. Selected the same way
  // (block.variant === '<layout>'); the resolver and LayoutBlock type are
  // unchanged — these are pure additive map keys.
  centered: HeroCenteredBlock,
  background: HeroBackgroundBlock,
  'split-reversed': HeroSplitReversedBlock,
  minimal: HeroMinimalBlock,
  video: HeroVideoBlock,
}

// Per-type variant maps for the other character-carrying blocks (same pattern as
// HERO_VARIANTS: absent/unknown variant → the default component, backward-compat).
const SERVICES_VARIANTS: Record<string, typeof ServicesPreviewBlock> = {
  bold: ServicesBoldBlock,
  elegant: ServicesElegantBlock,
  friendly: ServicesFriendlyBlock,
  modern: ServicesModernBlock,
  corporate: ServicesCorporateBlock,
  creative: ServicesCreativeBlock,
  // LAYOUT variants (composite scheme): character-agnostic re-compositions of the
  // services section, orthogonal to the character keys above and selected the same
  // way (block.variant === '<layout>'). Pure additive map keys — the resolver and
  // LayoutBlock type are unchanged. 'grid' explicitly names the default fallback
  // so the swap-variant op can switch back to it.
  grid: ServicesPreviewBlock,
  'alternating-rows': ServicesAlternatingRowsBlock,
  bento: ServicesBentoBlock,
  list: ServicesListBlock,
  'icon-tiles': ServicesIconTilesBlock,
  carousel: ServicesCarouselBlock,
}

const CTA_VARIANTS: Record<string, typeof CtaBlock> = {
  bold: CtaBoldBlock,
  elegant: CtaElegantBlock,
  friendly: CtaFriendlyBlock,
  modern: CtaModernBlock,
  corporate: CtaCorporateBlock,
  creative: CtaCreativeBlock,
  // LAYOUT variants (composite scheme): character-agnostic compositions of the CTA
  // section, additive + selected the same way (block.variant). 'band' names the
  // default fallback explicitly so the swap-variant op can switch back to it.
  band: CtaBlock,
  'color-block': CtaColorBlock,
  'split-with-image': CtaSplitWithImageBlock,
  'boxed-card': CtaBoxedCardBlock,
  'stacked-centered': CtaStackedCenteredBlock,
}

const TRUST_VARIANTS: Record<string, typeof TrustBarBlock> = {
  bold: TrustBarBoldBlock,
  elegant: TrustBarElegantBlock,
  friendly: TrustBarFriendlyBlock,
  modern: TrustBarModernBlock,
  corporate: TrustBarCorporateBlock,
  creative: TrustBarCreativeBlock,
  // LAYOUT variants (composite scheme): character-agnostic compositions of the
  // trust bar, additive + selected the same way (block.variant). 'icon-row' names
  // the default fallback explicitly so the swap-variant op can switch back to it.
  'icon-row': TrustBarBlock,
  'stat-numbers': TrustBarStatNumbersBlock,
  'logo-strip': TrustBarLogoStripBlock,
  'credential-cells': TrustBarCredentialCellsBlock,
}

const REVIEWS_VARIANTS: Record<string, typeof ReviewsBlock> = {
  bold: ReviewsBoldBlock,
  elegant: ReviewsElegantBlock,
  friendly: ReviewsFriendlyBlock,
  modern: ReviewsModernBlock,
  corporate: ReviewsCorporateBlock,
  creative: ReviewsCreativeBlock,
  // LAYOUT variants (composite scheme): character-agnostic re-compositions of the
  // reviews section, additive + selected the same way (block.variant). 'grid' names
  // the default fallback explicitly so the swap-variant op can switch back to it.
  grid: ReviewsBlock,
  spotlight: ReviewsSpotlightBlock,
  carousel: ReviewsCarouselBlock,
  masonry: ReviewsMasonryBlock,
  stacked: ReviewsStackedBlock,
}

const AREAS_VARIANTS: Record<string, typeof ServiceAreasBlock> = {
  bold: ServiceAreasBoldBlock,
  elegant: ServiceAreasElegantBlock,
  friendly: ServiceAreasFriendlyBlock,
  modern: ServiceAreasModernBlock,
  corporate: ServiceAreasCorporateBlock,
  creative: ServiceAreasCreativeBlock,
  // LAYOUT variants (composite scheme): character-agnostic compositions of the
  // service-areas section, additive + selected the same way (block.variant).
  // 'chips' names the default fallback explicitly so the swap-variant op can
  // switch back to it.
  chips: ServiceAreasBlock,
  'map-style': ServiceAreasMapStyleBlock,
  'columned-list': ServiceAreasColumnedListBlock,
  cards: ServiceAreasCardsBlock,
  stacked: ServiceAreasStackedBlock,
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
    case 'trustBar': {
      const TrustComponent = TRUST_VARIANTS[block.variant ?? ''] ?? TrustBarBlock
      return (
        <TrustComponent
          key="trustBar"
          items={
            block.params?.items as
              | { title: string; description: string }[]
              | undefined
          }
        />
      )
    }
    case 'servicesPreview': {
      const ServicesComponent =
        SERVICES_VARIANTS[block.variant ?? ''] ?? ServicesPreviewBlock
      return (
        <ServicesComponent
          key="servicesPreview"
          label={block.params?.label as string | undefined}
          heading={block.params?.heading as string | undefined}
          scriptAccent={block.params?.scriptAccent as string | undefined}
          body={block.params?.body as string | undefined}
          exploreLabel={block.params?.exploreLabel as string | undefined}
          moreLink={block.params?.moreLink as string | undefined}
        />
      )
    }
    case 'serviceAreas': {
      const AreasComponent = AREAS_VARIANTS[block.variant ?? ''] ?? ServiceAreasBlock
      return (
        <AreasComponent
          key="serviceAreas"
          label={block.params?.label as string | undefined}
          heading={block.params?.heading as string | undefined}
          scriptAccent={block.params?.scriptAccent as string | undefined}
          body={block.params?.body as string | undefined}
          moreLink={block.params?.moreLink as string | undefined}
        />
      )
    }
    case 'reviews': {
      const ReviewsComponent = REVIEWS_VARIANTS[block.variant ?? ''] ?? ReviewsBlock
      return (
        <ReviewsComponent
          key="reviews"
          label={block.params?.label as string | undefined}
          heading={block.params?.heading as string | undefined}
          scriptAccent={block.params?.scriptAccent as string | undefined}
          moreLink={block.params?.moreLink as string | undefined}
        />
      )
    }
    case 'faq':
      return (
        <FaqBlock
          key="faq"
          faqs={HOME_FAQS}
          title={block.params?.title as string | undefined}
        />
      )
    case 'cta': {
      const CtaComponent = CTA_VARIANTS[block.variant ?? ''] ?? CtaBlock
      return (
        <CtaComponent
          key="cta"
          title={block.params?.title as string | undefined}
          subtitle={block.params?.subtitle as string | undefined}
        />
      )
    }
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
