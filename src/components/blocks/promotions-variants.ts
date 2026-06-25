import { PromotionsBannerBlock } from './PromotionsBannerBlock'
import { PromotionsCardsBlock } from './PromotionsCardsBlock'
import { PromotionsOfferGridBlock } from './PromotionsOfferGridBlock'
import { PromotionsCountdownBandBlock } from './PromotionsCountdownBandBlock'

// One promotion / special. OPTIONAL data (read from SITE.promotions via cast —
// never on the emitted SITE literal). The section OMITS entirely when there are no
// promotions — it NEVER fabricates an offer. title/detail required; code (a real
// promo code) and expires (a real end date) optional with graceful fallbacks.
export interface Promotion {
  title: string
  detail: string
  code?: string
  expires?: string
}

// Per-type variant map (additive, like HERO_VARIANTS), banner default.
export const PROMOTIONS_VARIANTS: Record<string, typeof PromotionsBannerBlock> = {
  banner: PromotionsBannerBlock,
  cards: PromotionsCardsBlock,
  'offer-grid': PromotionsOfferGridBlock,
  'countdown-band': PromotionsCountdownBandBlock,
}
