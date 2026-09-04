import type { ComponentProps, ComponentType, CSSProperties, ReactNode } from 'react'
import { Fragment } from 'react'
import { tr } from '~/lib/i18n'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { Reveal } from '~/components/Reveal'
import { SITE } from '~/data/site'
import { serviceImageUrl } from '~/data/images'
import type { FAQ, ServicePageData, ServiceAreaPageData, InfoPageData } from '~/lib/types/page-types'
// Page-specific full-content components reused by the inner-page block cases
// (servicesIndex/areasIndex/reviewsIndex/contactForm). These render the FULL list
// (not the homepage's preview) — see the cases below.
import { IntroBlock } from '~/components/blocks/IntroBlock'
import { RichTextBlock } from '~/components/blocks/RichTextBlock'
import { ServicesSection } from '~/components/ServicesSection'
import { AreasSection } from '~/components/AreasSection'
import { ReviewsSection } from '~/components/ReviewsSection'
import { LeadForm } from '~/components/LeadForm'
import { SERVICES } from '~/data/services-view'
import { AREAS } from '~/data/areas'
import { reviews as REVIEWS } from '~/data/reviews'
import { PROJECTS } from '~/data/projects'
import { BLOCK_NEEDS, INTO_KIND, type BlockNeed } from '~/data/block-contract'
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
import { HeroServiceBannerBlock } from '~/components/blocks/HeroServiceBannerBlock'
import { serviceCta } from '~/lib/primaryCta'
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
// Area-detail per-item blocks (Arc 3 · Stage D)
import { AreaAboutBlock } from '~/components/blocks/AreaAboutBlock'
import { AreaDetailsBlock } from '~/components/blocks/AreaDetailsBlock'
import { RelatedAreasBlock } from '~/components/blocks/RelatedAreasBlock'
// Info-page per-item blocks (Arc 3 · Stage E)
import { InfoArticleBlock } from '~/components/blocks/InfoArticleBlock'
import { RelatedInfoBlock } from '~/components/blocks/RelatedInfoBlock'
// Native self-service BOOKING wizard (Arc 4a · Stage 2) — self-gates on BOOKING.enabled.
import { BookingWizardBlock } from '~/components/blocks/BookingWizardBlock'
import { HAS_PHONE } from '~/lib/phone'

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
  // Compact, family-aware inner-page banner (Phase 2) — the DEFAULT for detail heroes now.
  banner: HeroServiceBannerBlock,
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
  // Compact, family-aware inner-page banner (Phase 2) — the DEFAULT for detail heroes now.
  banner: HeroServiceBannerBlock,
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

// BOOKING variant map (Arc 4a · Stage 2). One native wizard today ('wizard' = default);
// the map gives the section the same additive variant seam as every other block, and
// BookingWizardBlock itself returns null when BOOKING.enabled is false (honest no-op).
const BOOKING_VARIANTS: Record<string, ComponentType<ComponentProps<typeof BookingWizardBlock>>> = {
  wizard: BookingWizardBlock,
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
  // Per-ITEM payloads for the area-detail (Stage D) and info (Stage E) routes. Same
  // contract as `service`: when present the `hero` case renders THIS item's hero and
  // the area/info cases render its content; absent everywhere else → those cases no-op.
  area?: ServiceAreaPageData
  info?: InfoPageData
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
    HAS_PHONE ? { Icon: Phone, label: SITE.phoneDisplay, href: `tel:${SITE.phone}` } : null,
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
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-700">{tr('misc.otherWays')}</p>
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

/**
 * Half B · P1b — the data a block instance renders from. Every data-bearing block component
 * takes optional `site` / `services` / `areas` / `reviews` / `projects` props that default to
 * the module read (SITE, SERVICES, …), so a block placed with no data params renders exactly
 * what it rendered before P1b. This resolves, per BLOCK_NEEDS[type]:
 *     params.<need.params>  →  ctx.<need.ctx>  →  (nothing: the component's own default)
 * and shapes the winner by `need.into`: an array module name (SERVICES/AREAS/REVIEWS/PROJECTS)
 * → that array prop; ONE SITE key → `site` is SITE with that key replaced; several SITE keys
 * (story) → the value is an object whose listed keys overlay SITE. A value of the wrong kind
 * (INTO_KIND: a non-array for an array key, a non-object for an object key or the overlay) is
 * ignored → default read; it never reaches a variant's `.slice().map()`.
 * Returns {} when nothing was supplied, so the spread adds no prop and the render is byte-identical.
 */
export interface BlockData {
  site?: typeof SITE
  services?: typeof SERVICES
  areas?: typeof AREAS
  reviews?: typeof REVIEWS
  projects?: typeof PROJECTS
}
const ARRAY_SLOT: Record<string, keyof BlockData> = {
  SERVICES: 'services',
  AREAS: 'areas',
  REVIEWS: 'reviews',
  PROJECTS: 'projects',
}
function kindOk(key: string, value: unknown): boolean {
  const kind = INTO_KIND[key]
  if (kind === 'array') return Array.isArray(value)
  if (kind === 'object') return typeof value === 'object' && value !== null && !Array.isArray(value)
  if (kind === 'string') return typeof value === 'string'
  return false // unknown key: never written into site
}
export function resolveData(block: SectionBlock, ctx?: SectionContext): BlockData {
  const need = (BLOCK_NEEDS as Record<string, BlockNeed | undefined>)[block.type]
  if (!need?.into || need.into.length === 0) return {}
  const fromParams = need.params ? block.params?.[need.params] : undefined
  const fromCtx = need.ctx ? (ctx as Record<string, unknown> | undefined)?.[need.ctx] : undefined
  const value = fromParams ?? fromCtx
  if (value === undefined || value === null) return {}
  if (need.into.length === 1) {
    const key = need.into[0]
    const slot = ARRAY_SLOT[key]
    if (slot) return Array.isArray(value) ? ({ [slot]: value } as BlockData) : {}
    return kindOk(key, value) ? { site: { ...SITE, [key]: value } as typeof SITE } : {}
  }
  if (typeof value !== 'object' || Array.isArray(value)) return {}
  const overlay: Record<string, unknown> = {}
  for (const key of need.into) {
    const v = (value as Record<string, unknown>)[key]
    if (v !== undefined && kindOk(key, v)) overlay[key] = v
  }
  if (Object.keys(overlay).length === 0) return {}
  return { site: { ...SITE, ...overlay } as typeof SITE }
}

// Map a layout block to its rendered section. Order/presence are driven by the
// page's *_LAYOUT array; each block owns its own markup + data-conditional
// auto-omit. The faq block receives params.faqs ?? ctx.faqs (page-supplied) ?? SITE.homeFaqs.
// Every site-scoped case spreads `data` (resolveData, above): {} unless the block carries params.
/** Per-block render options (not page context): SectionList sets them for the ONE block they apply to. */
export interface RenderOptions {
  /** 1 → the block's own heading renders as the page's <h1> (a custom page whose layout names no `intro`). */
  headingLevel?: 1 | 2
}

export function renderSection(block: SectionBlock, ctx?: SectionContext, opts?: RenderOptions): ReactNode {
  const data = resolveData(block, ctx)
  switch (block.type) {
    case 'intro':
      return ctx?.intro ? <IntroBlock {...ctx.intro} /> : null
    // Generic PROSE block (Phase 2 — custom pages). Copy rides entirely in params so any
    // page can carry supplied text; self-omits when there's no heading/body. Absent from
    // every factory page's layout → this case is never hit on existing pages (byte-identical).
    case 'richText':
      return (
        <RichTextBlock
          key="richText"
          eyebrow={block.params?.eyebrow as string | undefined}
          heading={block.params?.heading as string | undefined}
          body={block.params?.body as string | undefined}
          headingLevel={opts?.headingLevel}
        />
      )
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
        // PER-SERVICE CTA (mixed catalogues): the banner takes this service's own target — book →
        // /book?service=, quote → /quote?service=, buy → order — from serviceCta(slug). Other hero variants
        // keep the site-wide CTA (they have no cta prop); the banner is the default detail hero.
        const perService = ServiceHero === HeroServiceBannerBlock ? { cta: serviceCta(svc.slug) } : {}
        return (
          <ServiceHero
            key="hero"
            headline={svc.hero.h1}
            body={svc.hero.subhead}
            subheadline=""
            imageUrl={serviceImageUrl(svc.slug)}
            trustItems={trustItems}
            {...(perService as Record<string, never>)}
          />
        )
      }
      // PER-ITEM hero for the area (Stage D) + info (Stage E) routes. Areas/info have no
      // own image, so the hero uses the business hero photo (SITE.hero.image_url) — honest
      // (the business's own photo), never a fabricated image. Reuses the per-item WOW hero map.
      if (ctx?.area) {
        const AreaHero = SERVICE_HERO_VARIANTS[block.variant ?? ''] ?? HeroAuroraBlock
        return (
          <AreaHero
            key="hero"
            headline={ctx.area.hero.h1}
            body={ctx.area.hero.subhead}
            subheadline=""
            imageUrl={SITE.hero.image_url}
          />
        )
      }
      if (ctx?.info) {
        const InfoHero = SERVICE_HERO_VARIANTS[block.variant ?? ''] ?? HeroAuroraBlock
        return (
          <InfoHero
            key="hero"
            headline={ctx.info.hero.h1}
            body={ctx.info.hero.subhead}
            subheadline=""
            imageUrl={SITE.hero.image_url}
          />
        )
      }
      const HeroComponent = HERO_VARIANTS[block.variant ?? ''] ?? HeroBlock
      return (
        <HeroComponent
          key="hero"
          {...data}
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
    // ── AREA-DETAIL per-item cases (Arc 3 · Stage D) — via ctx.area, else null ──
    case 'areaAbout':
      return ctx?.area ? <AreaAboutBlock area={ctx.area} variant={block.variant} /> : null
    case 'areaDetails':
      return ctx?.area ? <AreaDetailsBlock area={ctx.area} /> : null
    case 'relatedAreas':
      return ctx?.area ? <RelatedAreasBlock area={ctx.area} /> : null
    // ── INFO-page per-item cases (Arc 3 · Stage E) — via ctx.info, else null ──
    case 'infoArticle':
      return ctx?.info ? <InfoArticleBlock info={ctx.info} variant={block.variant} /> : null
    case 'relatedInfo':
      return ctx?.info ? <RelatedInfoBlock info={ctx.info} /> : null
    case 'taglineBar':
      return <TaglineBarBlock key="taglineBar" {...data} />
    case 'localBar':
      return (
        <LocalBarBlock
          key="localBar"
          {...data}
          label={block.params?.label as string | undefined}
        />
      )
    case 'trustBar': {
      const TrustComponent = TRUST_VARIANTS[block.variant ?? ''] ?? TrustBarBlock
      return (
        <TrustComponent
          key="trustBar"
          {...data}
          // params.items rides resolveData (into: trustItems) so a wrong-shaped value falls back
          // to SITE instead of throwing inside the variant (a string here took /about down in the
          // P1b probe); an array param is the same value it was, byte-identical.
          items={
            ((data.site ?? SITE) as { trustItems?: { title: string; description: string }[] }).trustItems
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
          {...data}
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
          {...data}
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
          {...data}
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
          faqs={(block.params?.faqs as FAQ[] | undefined) ?? ctx?.faqs ?? SITE.homeFaqs}
          title={block.params?.title as string | undefined}
        />
      )
    }
    case 'cta': {
      const CtaComponent = CTA_VARIANTS[block.variant ?? ''] ?? CtaBlock
      return (
        <CtaComponent
          key="cta"
          {...data}
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
          {...data}
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
          {...data}
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
          {...data}
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
          {...data}
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
          {...data}
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
          {...data}
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
          {...data}
          label={block.params?.label as string | undefined}
          heading={block.params?.heading as string | undefined}
          body={block.params?.body as string | undefined}
          // Catalog-widget params (quote form): editable button + the owner-chosen quotable-service
          // list. Other variants ignore them. Absent `services` → the quote block offers all quotable.
          submitLabel={block.params?.submitLabel as string | undefined}
          services={
            block.params?.services as { slug: string; name: string }[] | undefined
          }
          headingLevel={opts?.headingLevel}
        />
      )
    }
    case 'membership': {
      const MembershipComponent = MEMBERSHIP_VARIANTS[block.variant ?? ''] ?? MembershipTierCardsBlock
      return (
        <MembershipComponent
          key="membership"
          {...data}
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
          {...data}
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
          {...data}
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
          {...data}
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
          {...data}
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
          {...data}
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
          {...data}
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
          {...data}
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
          {...data}
          label={block.params?.label as string | undefined}
          heading={block.params?.heading as string | undefined}
          body={block.params?.body as string | undefined}
        />
      )
    }
    case 'booking': {
      const BookingComponent = BOOKING_VARIANTS[block.variant ?? ''] ?? BookingWizardBlock
      return (
        <BookingComponent
          key="booking"
          label={block.params?.label as string | undefined}
          heading={block.params?.heading as string | undefined}
          body={block.params?.body as string | undefined}
          forceEnabled={block.params?.forceEnabled as boolean | undefined}
          headingLevel={opts?.headingLevel}
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
          services={data.services ?? SERVICES}
        />
      )
    case 'areasIndex':
      return (
        <AreasSection
          key="areasIndex"
          heading={(block.params?.heading as string | undefined) ?? 'Service areas'}
          intro={block.params?.intro as string | undefined}
          areas={data.areas ?? AREAS}
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
// Section-level style (Phase 1 · Step 5b). A block's optional params.style carries semantic color
// overrides for THIS section only; we set them as CSS custom properties on a scope wrapper so the
// block's utilities (bg-primary, text-foreground, …) resolve them from the nearest ancestor —
// overriding the global :root for this subtree, leaving every other section on the global palette.
// Semantic colors (primary/accent/background/foreground; WOW brand-ramp/gradient deferred) PLUS fonts
// (Phase 1 · Step 5c): fontDisplay → --font-display, fontBody → --font-sans, scoped on the SAME
// wrapper. The scoped --font-* reaches headings via the @layer-base h1–h6 { font-family:
// var(--font-display) } rule, and reaches the .font-display/.font-sans utility classes via the
// unlayered `.font-x { var }` re-point rules the factory emits when section fonts exist. When a body
// font is set we also apply font-family on the wrapper so plain body text (which inherits <body>'s
// computed font, not the var) follows the section font. Absent params.style → no wrapper → byte-identical.
const SECTION_STYLE_VARS: Record<string, string> = {
  primary: '--primary',
  accent: '--accent',
  background: '--background',
  foreground: '--foreground',
  fontDisplay: '--font-display',
  fontBody: '--font-sans',
}
function sectionStyleVars(style: unknown): CSSProperties | undefined {
  if (!style || typeof style !== 'object') return undefined
  const s = style as Record<string, unknown>
  const out: Record<string, string> = {}
  for (const [key, cssVar] of Object.entries(SECTION_STYLE_VARS)) {
    const v = s[key]
    if (typeof v === 'string' && v.trim()) out[cssVar] = v.trim()
  }
  if (Object.keys(out).length === 0) return undefined
  // A section BODY font must be applied on the wrapper too — plain body text inherits <body>'s
  // COMPUTED font (set at <body> from var(--font-sans)), so a scoped --font-sans alone wouldn't
  // reach it. Headings still override via the base h1–h6 rule. Only when fontBody is set.
  if (typeof s.fontBody === 'string' && s.fontBody.trim()) out.fontFamily = 'var(--font-sans)'
  return out as CSSProperties
}

/**
 * ★★★ Blocks that render SEVERAL <section>s reveal EACH section themselves (their SubSection wraps
 * one <Reveal> per rendered section) and get NO outer wrapper here. One Reveal around five sections
 * was 5,212 px on desktop and 9,551 px on a phone; Reveal's IntersectionObserver threshold (0.12 of
 * the element) can never be met by an element ~11× the viewport, so the wrapper stayed at opacity 0
 * and the lower ~58% of every service page was blank on phones and on desktop windows under ~690 px.
 * Measured live on two sites (2026-09-03). Per-section is the shape the wrapper was designed for.
 */
const SELF_REVEALING_BLOCKS: ReadonlySet<string> = new Set(['serviceDetails', 'areaDetails', 'infoArticle'])

export function SectionList({
  blocks,
  ctx,
  titleFromFirstBlock = false,
}: {
  blocks: SectionBlock[]
  ctx?: SectionContext
  /**
   * Custom pages (/book, /quote, /p/$slug): when the layout names no `intro` block, the FIRST
   * block's own heading is the page's <h1>. The seeded book/quote pages carry an intro record
   * their layout never places, and rendering it above the wizard pushes the wizard below the
   * fold on a phone — so the semantics move, not the layout. Factory pages never pass this.
   */
  titleFromFirstBlock?: boolean
}): ReactNode {
  const firstIsTitle = titleFromFirstBlock && !blocks.some((b) => b.type === 'intro')
  return (
    <>
      {blocks.map((block, i) => {
        const rendered = renderSection(block, ctx, firstIsTitle && i === 0 ? { headingLevel: 1 } : undefined)
        const scope = sectionStyleVars(block.params?.style)
        const scoped = scope ? <div data-zsec={block.type} style={scope}>{rendered}</div> : rendered
        if (SELF_REVEALING_BLOCKS.has(block.type)) return <Fragment key={i}>{scoped}</Fragment>
        return (
          <Reveal key={i} disabled={i === 0 || block.type === 'hero'}>
            {scoped}
          </Reveal>
        )
      })}
    </>
  )
}
