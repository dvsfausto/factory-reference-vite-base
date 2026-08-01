import type { ComponentProps, ComponentType, ReactNode } from 'react'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { Reveal } from '~/components/Reveal'
import { SITE } from '~/data/site'
import { serviceImageUrl } from '~/data/images'
import type { FAQ, ServicePageData } from '~/lib/types/page-types'
// Page-specific full-content components reused by the inner-page block cases
// (servicesIndex/areasIndex/reviewsIndex/contactForm). These render the FULL list
// (not the homepage's preview) — see the cases below.
import { IntroBlock } from '~/components/blocks/IntroBlock'
import { ServicesSection } from '~/components/ServicesSection'
import { AreasSection } from '~/components/AreasSection'
import { ReviewsSection } from '~/components/ReviewsSection'
import { LeadForm } from '~/components/LeadForm'
import { SERVICES } from '~/data/services-view'
import { AREAS } from '~/data/areas'
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
// WOW layout variants (Arc 1 · Stage 2) — brand-reactive, motion-rich heroes that
// consume the --wow-* tokens (styles/app.css). Additive map keys; unknown → default.
import { HeroAuroraBlock } from '~/components/blocks/HeroAuroraBlock'
import { HeroSpotlightBlock } from '~/components/blocks/HeroSpotlightBlock'
import { HeroEditorialBlock } from '~/components/blocks/HeroEditorialBlock'
// WOW Stage 2 — additional section variants (brand-reactive + motion, consume --wow-*).
// Additive map keys only; unknown variant → the section's default component.
import { ServicesLuxeBlock } from '~/components/blocks/ServicesLuxeBlock'
import { ServicesFeatureRowsBlock } from '~/components/blocks/ServicesFeatureRowsBlock'
import { ServicesSpotlightTilesBlock } from '~/components/blocks/ServicesSpotlightTilesBlock'
import { ReviewsLuminousBlock } from '~/components/blocks/ReviewsLuminousBlock'
import { ReviewsPullQuoteBlock } from '~/components/blocks/ReviewsPullQuoteBlock'
import { ReviewsGlassWallBlock } from '~/components/blocks/ReviewsGlassWallBlock'
import { CtaAuroraGlowBlock } from '~/components/blocks/CtaAuroraGlowBlock'
import { CtaGlassPanelBlock } from '~/components/blocks/CtaGlassPanelBlock'
import { TrustBarGlowCardsBlock } from '~/components/blocks/TrustBarGlowCardsBlock'
import { TrustBarHairlineRowsBlock } from '~/components/blocks/TrustBarHairlineRowsBlock'
import { ServiceAreasGlowPinsBlock } from '~/components/blocks/ServiceAreasGlowPinsBlock'
import { ServiceAreasBrandPanelBlock } from '~/components/blocks/ServiceAreasBrandPanelBlock'
import { FaqGlassAccordionBlock } from '~/components/blocks/FaqGlassAccordionBlock'
import { FaqSplitPanelBlock } from '~/components/blocks/FaqSplitPanelBlock'
import { StoryEditorialFrameBlock } from '~/components/blocks/StoryEditorialFrameBlock'
import { StoryManifestoGlowBlock } from '~/components/blocks/StoryManifestoGlowBlock'
import { GalleryCinematicMasonryBlock } from '~/components/blocks/GalleryCinematicMasonryBlock'
import { GalleryFeaturedFilmBlock } from '~/components/blocks/GalleryFeaturedFilmBlock'
import { GalleryEdgeGridBlock } from '~/components/blocks/GalleryEdgeGridBlock'
import { PricingLuxeGlassBlock } from '~/components/blocks/PricingLuxeGlassBlock'
import { PricingSpotlightTierBlock } from '~/components/blocks/PricingSpotlightTierBlock'
import { ProcessGlowNodesBlock } from '~/components/blocks/ProcessGlowNodesBlock'
import { ProcessBoldNumeralsBlock } from '~/components/blocks/ProcessBoldNumeralsBlock'
import { FormFloatGlassBlock } from '~/components/blocks/FormFloatGlassBlock'
import { FormBrandSplitBlock } from '~/components/blocks/FormBrandSplitBlock'
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
import { TeamGridBlock } from '~/components/blocks/TeamGridBlock'
import { TEAM_VARIANTS } from '~/components/blocks/team-variants'
import { PricingTiersBlock } from '~/components/blocks/PricingTiersBlock'
import { PRICING_VARIANTS } from '~/components/blocks/pricing-variants'
import { GalleryMasonryBlock } from '~/components/blocks/GalleryMasonryBlock'
import { GALLERY_VARIANTS } from '~/components/blocks/gallery-variants'
import { ProcessNumberedStepsBlock } from '~/components/blocks/ProcessNumberedStepsBlock'
import { PROCESS_VARIANTS } from '~/components/blocks/process-variants'
import { FaqAccordionBlock } from '~/components/blocks/FaqAccordionBlock'
import { FAQSECTION_VARIANTS } from '~/components/blocks/faqsection-variants'
import { StoryNarrativeBlock } from '~/components/blocks/StoryNarrativeBlock'
import { STORY_VARIANTS } from '~/components/blocks/story-variants'
import { FormContactBlock } from '~/components/blocks/FormContactBlock'
import { FORMS_VARIANTS } from '~/components/blocks/forms-variants'
import { MembershipTierCardsBlock } from '~/components/blocks/MembershipTierCardsBlock'
import { MEMBERSHIP_VARIANTS } from '~/components/blocks/membership-variants'
import { PackagesBundleCardsBlock } from '~/components/blocks/PackagesBundleCardsBlock'
import { PACKAGES_VARIANTS } from '~/components/blocks/packages-variants'
import { CaseStudiesFeaturedBlock } from '~/components/blocks/CaseStudiesFeaturedBlock'
import { CASE_STUDIES_VARIANTS } from '~/components/blocks/case-studies-variants'
import { VideoTestimonialsGridBlock } from '~/components/blocks/VideoTestimonialsGridBlock'
import { VIDEO_TESTIMONIALS_VARIANTS } from '~/components/blocks/video-testimonials-variants'
import { PromotionsBannerBlock } from '~/components/blocks/PromotionsBannerBlock'
import { PROMOTIONS_VARIANTS } from '~/components/blocks/promotions-variants'
import { FinancingHighlightBandBlock } from '~/components/blocks/FinancingHighlightBandBlock'
import { FINANCING_VARIANTS } from '~/components/blocks/financing-variants'
import { PartnersLogoWallBlock } from '~/components/blocks/PartnersLogoWallBlock'
import { PARTNERS_VARIANTS } from '~/components/blocks/partners-variants'
import { MapEmbedStylePanelBlock } from '~/components/blocks/MapEmbedStylePanelBlock'
import { MAP_VARIANTS } from '~/components/blocks/map-variants'
import { BlogCardGridBlock } from '~/components/blocks/BlogCardGridBlock'
import { BLOG_VARIANTS } from '~/components/blocks/blog-variants'
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
// SERVICE-DETAIL per-item blocks (Arc 3 · Stage C) — each reads THIS service's
// content from ctx.service (SectionContext) and honestly omits empty sub-sections.
import { ServiceWhatWeCoverBlock } from '~/components/blocks/ServiceWhatWeCoverBlock'
import { ServiceDetailsBlock } from '~/components/blocks/ServiceDetailsBlock'
import { RelatedServicesBlock } from '~/components/blocks/RelatedServicesBlock'

// ─────────────────────────────────────────────────────────────────────────────
// SHARED SECTION RENDERER (Arc 3 · Stage B).
//
// The ONE place the per-type block switch + the inline variant maps live. Extracted
// VERBATIM from routes/index.tsx so the homepage renders byte-identically, and reused
// by every inner page (about/pricing/reviews/contact/services index/areas index) via
// their own <Page>_LAYOUT arrays. Two additions over index.tsx's old renderBlock:
//   (a) the `faq` case reads ctx.faqs (page-supplied) ?? SITE.homeFaqs;
//   (b) an `intro` case + page-specific full-content cases (servicesIndex/areasIndex/
//       reviewsIndex/contactForm), each Reveal-wrapped by SectionList.
// ─────────────────────────────────────────────────────────────────────────────

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
  // WOW variants (Arc 1 · Stage 2): brand-reactive + animated, consuming --wow-*.
  // 'aurora' = cinematic full-bleed (dark); 'spotlight' = editorial split (light);
  // 'editorial' = magazine/typographic. Selected the same way (block.variant).
  aurora: HeroAuroraBlock,
  spotlight: HeroSpotlightBlock,
  editorial: HeroEditorialBlock,
}

// SERVICE-DETAIL hero variants (Arc 3 · Stage C). The WOW heroes (aurora/spotlight/
// editorial) already accept per-item content props (headline/body/imageUrl/subheadline/
// trustItems); the DEFAULT HeroBlock does NOT — so the service-page hero path selects
// from this per-item-typed map (default 'aurora'), keeping the homepage `hero` path
// (HERO_VARIANTS, trustItems/decorativeAsset only) untouched. Same block, two content
// channels: SITE.hero on the homepage, ctx.service.hero on a service page.
const SERVICE_HERO_VARIANTS: Record<
  string,
  ComponentType<ComponentProps<typeof HeroAuroraBlock>>
> = {
  aurora: HeroAuroraBlock,
  spotlight: HeroSpotlightBlock,
  editorial: HeroEditorialBlock,
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
  // WOW Stage 2 (brand-reactive + motion): luxe glass grid, alternating feature
  // rows, lead-spotlight tiles.
  luxe: ServicesLuxeBlock,
  'feature-rows': ServicesFeatureRowsBlock,
  'spotlight-tiles': ServicesSpotlightTilesBlock,
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
  // WOW Stage 2: full-bleed brand-gradient aurora band, floating glass panel.
  'aurora-glow': CtaAuroraGlowBlock,
  'glass-panel': CtaGlassPanelBlock,
}

// ComponentType (not `typeof TrustBarBlock`): the WOW variants honestly omit
// (return null) on empty items, a wider return type than the default's — this
// annotation accepts both.
const TRUST_VARIANTS: Record<string, ComponentType<ComponentProps<typeof TrustBarBlock>>> = {
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
  // WOW Stage 2: glass cards with gradient icon badges, hairline-divided rows.
  'glow-cards': TrustBarGlowCardsBlock,
  'hairline-rows': TrustBarHairlineRowsBlock,
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
  // WOW Stage 2: luminous glass quote cards, featured pull-quote, glass wall.
  luminous: ReviewsLuminousBlock,
  'pull-quote': ReviewsPullQuoteBlock,
  'glass-wall': ReviewsGlassWallBlock,
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
  // WOW Stage 2: glass area pins on a brand field, bold brand-gradient panel.
  'glow-pins': ServiceAreasGlowPinsBlock,
  'brand-panel': ServiceAreasBrandPanelBlock,
}

// FAQ variant map (WOW Stage 2). The homepage 'faq' block historically had no
// variant swap (it rendered FaqBlock directly); this additive map gives it the
// same variant seam as every other section. Default (absent/unknown) → FaqBlock,
// so no-variant builds render byte-identically. Every entry takes the SAME props
// FaqBlock does (faqs + optional title).
const FAQ_VARIANTS: Record<string, ComponentType<ComponentProps<typeof FaqBlock>>> = {
  accordion: FaqBlock,
  'glass-accordion': FaqGlassAccordionBlock,
  'split-panel': FaqSplitPanelBlock,
}

/**
 * Per-page context passed to renderSection. `faqs` feeds the `faq` case (homepage
 * passes SITE.homeFaqs; inner pages pass their own or fall back to it). `intro`
 * feeds the shared `intro` case (IntroBlock) so a page sets its header copy as data.
 */
export interface SectionContext {
  faqs?: FAQ[]
  intro?: { eyebrow?: string; heading: string; body?: string; script?: string }
  // Per-ITEM payload for the service-detail route (Arc 3 · Stage C). When present, the
  // `hero` case renders THIS service's hero (else SITE.hero), and the three service
  // cases (serviceWhatWeCover/serviceDetails/relatedServices) render its content. Absent
  // on the homepage / about / pricing / global pages → those cases return null (no-op).
  service?: ServicePageData
}

// A layout block — the shared shape both HOMEPAGE_LAYOUT (LayoutBlock) and the
// inner-page <Page>_LAYOUT arrays satisfy (their `type` unions are ⊆ string).
interface SectionBlock {
  type: string
  variant?: string
  params?: Record<string, unknown>
}

// WOW-styled contact section — the LeadForm (EXACT, untouched: same fields, same
// frozen Supabase envelope handler) beside a brand-surfaced info card whose rows are
// the REAL SITE contact fields, each omitting when empty. Replaces contact.tsx's old
// bg-slate JSX with brand/ink tokens + --wow-* surfaces.
function ContactFormSection() {
  const addr = [SITE.address.city, SITE.address.state, SITE.address.zip]
    .filter(Boolean)
    .join(', ')
  const rows = [
    { Icon: Phone, label: SITE.phoneDisplay, href: `tel:${SITE.phone}` },
    { Icon: Mail, label: SITE.email, href: `mailto:${SITE.email}` },
    addr ? { Icon: MapPin, label: addr } : null,
    SITE.hours ? { Icon: Clock, label: SITE.hours } : null,
  ].filter(Boolean) as { Icon: typeof Phone; label: string; href?: string }[]

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundImage: 'var(--wow-grad-surface)' }}
    >
      <div className="container-x relative py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <LeadForm />
          </div>
          <aside className="lg:col-span-1">
            <div
              className="rounded-2xl border bg-white p-6"
              style={{
                borderColor: 'var(--wow-hairline)',
                boxShadow: 'var(--wow-shadow-lift)',
              }}
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-700">
                Other ways to reach us
              </p>
              <div className="mt-5 flex flex-col gap-4">
                {rows.map((r, i) => (
                  <div key={i} className="flex items-center gap-3.5">
                    <span
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white"
                      style={{ backgroundImage: 'var(--wow-grad-brand)' }}
                    >
                      <r.Icon className="h-5 w-5" />
                    </span>
                    {r.href ? (
                      <a
                        href={r.href}
                        className="font-medium text-ink-800 hover:text-brand-700"
                      >
                        {r.label}
                      </a>
                    ) : (
                      <span className="font-medium text-ink-800">{r.label}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

// Map a layout block to its rendered section. Order/presence are driven by the
// page's *_LAYOUT array; each block owns its own markup + data-conditional
// auto-omit. The faq block receives ctx.faqs (page-supplied) ?? SITE.homeFaqs.
export function renderSection(block: SectionBlock, ctx?: SectionContext): ReactNode {
  switch (block.type) {
    case 'intro':
      return ctx?.intro ? <IntroBlock {...ctx.intro} /> : null
    case 'hero': {
      // PER-ITEM hero (service-detail route): render THIS service's own headline / body /
      // image / trustLine through a WOW hero variant (default 'aurora'). Mirrors
      // ServicePageTemplate's renderCharacterHero feed: subheadline="" suppresses the
      // homepage subheadline; trustLine ("a · b · c") splits into the hero's trust row
      // (absent → hero keeps its default trust items).
      if (ctx?.service) {
        const svc = ctx.service
        const ServiceHero = SERVICE_HERO_VARIANTS[block.variant ?? ''] ?? HeroAuroraBlock
        const trustItems = svc.hero.trustLine
          ? svc.hero.trustLine.split('·').map((s) => s.trim()).filter(Boolean)
          : undefined
        return (
          <ServiceHero
            key="hero"
            headline={svc.hero.h1}
            body={svc.hero.subhead}
            subheadline=""
            imageUrl={serviceImageUrl(svc.slug)}
            trustItems={trustItems}
          />
        )
      }
      const HeroComponent = HERO_VARIANTS[block.variant ?? ''] ?? HeroBlock
      return (
        <HeroComponent
          key="hero"
          trustItems={
            (block.params?.trustItems as string[] | undefined) ??
            (SITE as { trustItems?: { title: string }[] }).trustItems?.map((t) => t.title)
          }
          decorativeAsset={block.params?.decorativeAsset as string | undefined}
        />
      )
    }
    // ── SERVICE-DETAIL per-item cases (Arc 3 · Stage C) ───────────────────────
    // Each renders THIS service's content via ctx.service, and returns null when
    // ctx.service is absent (backward-compat: homepage/about/pricing/global pages
    // are unaffected) OR when the block itself has nothing to show (honest omit).
    case 'serviceWhatWeCover':
      return ctx?.service ? (
        <ServiceWhatWeCoverBlock service={ctx.service} variant={block.variant} />
      ) : null
    case 'serviceDetails':
      return ctx?.service ? <ServiceDetailsBlock service={ctx.service} /> : null
    case 'relatedServices':
      return ctx?.service ? <RelatedServicesBlock service={ctx.service} /> : null
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
            (block.params?.items as
              | { title: string; description: string }[]
              | undefined) ??
            (SITE as { trustItems?: { title: string; description: string }[] }).trustItems
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
    case 'faq': {
      const FaqComponent = FAQ_VARIANTS[block.variant ?? ''] ?? FaqBlock
      return (
        <FaqComponent
          key="faq"
          faqs={ctx?.faqs ?? SITE.homeFaqs}
          title={block.params?.title as string | undefined}
        />
      )
    }
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
    case 'team': {
      const TeamComponent = TEAM_VARIANTS[block.variant ?? ''] ?? TeamGridBlock
      return (
        <TeamComponent
          key="team"
          label={block.params?.label as string | undefined}
          heading={block.params?.heading as string | undefined}
          body={block.params?.body as string | undefined}
        />
      )
    }
    case 'pricing': {
      const PricingComponent = PRICING_VARIANTS[block.variant ?? ''] ?? PricingTiersBlock
      return (
        <PricingComponent
          key="pricing"
          label={block.params?.label as string | undefined}
          heading={block.params?.heading as string | undefined}
          body={block.params?.body as string | undefined}
        />
      )
    }
    case 'gallery': {
      const GalleryComponent = GALLERY_VARIANTS[block.variant ?? ''] ?? GalleryMasonryBlock
      return (
        <GalleryComponent
          key="gallery"
          label={block.params?.label as string | undefined}
          heading={block.params?.heading as string | undefined}
          body={block.params?.body as string | undefined}
        />
      )
    }
    case 'process': {
      const ProcessComponent = PROCESS_VARIANTS[block.variant ?? ''] ?? ProcessNumberedStepsBlock
      return (
        <ProcessComponent
          key="process"
          label={block.params?.label as string | undefined}
          heading={block.params?.heading as string | undefined}
          body={block.params?.body as string | undefined}
        />
      )
    }
    case 'faqSection': {
      const FaqSectionComponent = FAQSECTION_VARIANTS[block.variant ?? ''] ?? FaqAccordionBlock
      return (
        <FaqSectionComponent
          key="faqSection"
          label={block.params?.label as string | undefined}
          heading={block.params?.heading as string | undefined}
          body={block.params?.body as string | undefined}
        />
      )
    }
    case 'story': {
      const StoryComponent = STORY_VARIANTS[block.variant ?? ''] ?? StoryNarrativeBlock
      return (
        <StoryComponent
          key="story"
          label={block.params?.label as string | undefined}
          heading={block.params?.heading as string | undefined}
          body={block.params?.body as string | undefined}
        />
      )
    }
    case 'forms': {
      const FormsComponent = FORMS_VARIANTS[block.variant ?? ''] ?? FormContactBlock
      return (
        <FormsComponent
          key="forms"
          label={block.params?.label as string | undefined}
          heading={block.params?.heading as string | undefined}
          body={block.params?.body as string | undefined}
        />
      )
    }
    case 'membership': {
      const MembershipComponent = MEMBERSHIP_VARIANTS[block.variant ?? ''] ?? MembershipTierCardsBlock
      return (
        <MembershipComponent
          key="membership"
          label={block.params?.label as string | undefined}
          heading={block.params?.heading as string | undefined}
          body={block.params?.body as string | undefined}
        />
      )
    }
    case 'packages': {
      const PackagesComponent = PACKAGES_VARIANTS[block.variant ?? ''] ?? PackagesBundleCardsBlock
      return (
        <PackagesComponent
          key="packages"
          label={block.params?.label as string | undefined}
          heading={block.params?.heading as string | undefined}
          body={block.params?.body as string | undefined}
        />
      )
    }
    case 'caseStudies': {
      const CaseStudiesComponent = CASE_STUDIES_VARIANTS[block.variant ?? ''] ?? CaseStudiesFeaturedBlock
      return (
        <CaseStudiesComponent
          key="caseStudies"
          label={block.params?.label as string | undefined}
          heading={block.params?.heading as string | undefined}
          body={block.params?.body as string | undefined}
        />
      )
    }
    case 'videoTestimonials': {
      const VideoTestimonialsComponent = VIDEO_TESTIMONIALS_VARIANTS[block.variant ?? ''] ?? VideoTestimonialsGridBlock
      return (
        <VideoTestimonialsComponent
          key="videoTestimonials"
          label={block.params?.label as string | undefined}
          heading={block.params?.heading as string | undefined}
          body={block.params?.body as string | undefined}
        />
      )
    }
    case 'promotions': {
      const PromotionsComponent = PROMOTIONS_VARIANTS[block.variant ?? ''] ?? PromotionsBannerBlock
      return (
        <PromotionsComponent
          key="promotions"
          label={block.params?.label as string | undefined}
          heading={block.params?.heading as string | undefined}
          body={block.params?.body as string | undefined}
        />
      )
    }
    case 'financing': {
      const FinancingComponent = FINANCING_VARIANTS[block.variant ?? ''] ?? FinancingHighlightBandBlock
      return (
        <FinancingComponent
          key="financing"
          label={block.params?.label as string | undefined}
          heading={block.params?.heading as string | undefined}
          body={block.params?.body as string | undefined}
        />
      )
    }
    case 'partners': {
      const PartnersComponent = PARTNERS_VARIANTS[block.variant ?? ''] ?? PartnersLogoWallBlock
      return (
        <PartnersComponent
          key="partners"
          label={block.params?.label as string | undefined}
          heading={block.params?.heading as string | undefined}
          body={block.params?.body as string | undefined}
        />
      )
    }
    case 'map': {
      const MapComponent = MAP_VARIANTS[block.variant ?? ''] ?? MapEmbedStylePanelBlock
      return (
        <MapComponent
          key="map"
          label={block.params?.label as string | undefined}
          heading={block.params?.heading as string | undefined}
          body={block.params?.body as string | undefined}
        />
      )
    }
    case 'blog': {
      const BlogComponent = BLOG_VARIANTS[block.variant ?? ''] ?? BlogCardGridBlock
      return (
        <BlogComponent
          key="blog"
          label={block.params?.label as string | undefined}
          heading={block.params?.heading as string | undefined}
          body={block.params?.body as string | undefined}
        />
      )
    }
    // ── Page-specific FULL-CONTENT cases (Arc 3 · Stage B) ────────────────────
    // These render the page's EXISTING full-list / form components (NOT the
    // homepage previews), reused verbatim so the listing pages don't lose content.
    case 'servicesIndex':
      return (
        <ServicesSection
          key="servicesIndex"
          heading={(block.params?.heading as string | undefined) ?? 'Services'}
          intro={block.params?.intro as string | undefined}
          services={SERVICES}
        />
      )
    case 'areasIndex':
      return (
        <AreasSection
          key="areasIndex"
          heading={(block.params?.heading as string | undefined) ?? 'Service areas'}
          intro={block.params?.intro as string | undefined}
          areas={AREAS}
        />
      )
    case 'reviewsIndex':
      return (
        <ReviewsSection
          key="reviewsIndex"
          heading={(block.params?.heading as string | undefined) ?? 'All reviews'}
          count={(block.params?.count as number | undefined) ?? 50}
        />
      )
    case 'contactForm':
      return <ContactFormSection key="contactForm" />
    default:
      return null
  }
}

/**
 * The ONE place Reveal is applied — for the homepage AND every inner page. Maps a
 * page's blocks → renderSection, each wrapped in <Reveal> with the SAME disabling
 * rule the homepage used (the first block + any hero skip the reveal; they own their
 * own entrance). Additive/backward-compat: a page with no layout renders nothing here.
 */
export function SectionList({
  blocks,
  ctx,
}: {
  blocks: SectionBlock[]
  ctx?: SectionContext
}): ReactNode {
  return (
    <>
      {blocks.map((block, i) => (
        <Reveal key={i} disabled={i === 0 || block.type === 'hero'}>
          {renderSection(block, ctx)}
        </Reveal>
      ))}
    </>
  )
}
