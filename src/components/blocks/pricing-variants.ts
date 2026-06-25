import { PricingTiersBlock } from './PricingTiersBlock'
import { PricingComparisonTableBlock } from './PricingComparisonTableBlock'
import { PricingToggleBlock } from './PricingToggleBlock'
import { PricingCardsBlock } from './PricingCardsBlock'
import { PricingSingleHighlightBlock } from './PricingSingleHighlightBlock'
import { PricingListBlock } from './PricingListBlock'

// One pricing plan. OPTIONAL data (read from SITE.plans via cast in the pricing
// blocks — never declared on the emitted SITE literal), so a site with no plans
// renders nothing and stays byte-identical. name/price are required; period,
// features, highlighted, and priceAnnual (for the monthly/annual toggle) are
// optional with graceful fallbacks. Real plans later: the scaffolder emits
// SITE.plans from intake, exactly as it emits homeServices.
export interface PricingPlan {
  name: string
  price: string
  period?: string
  features?: string[]
  highlighted?: boolean
  priceAnnual?: string
}

// Per-type variant map for the pricing section (same additive pattern as
// HERO_VARIANTS): block.variant -> component, tiers as the default fallback.
export const PRICING_VARIANTS: Record<string, typeof PricingTiersBlock> = {
  tiers: PricingTiersBlock,
  'comparison-table': PricingComparisonTableBlock,
  toggle: PricingToggleBlock,
  cards: PricingCardsBlock,
  'single-highlight': PricingSingleHighlightBlock,
  list: PricingListBlock,
}
