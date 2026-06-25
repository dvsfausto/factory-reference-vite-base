import { MembershipTierCardsBlock } from './MembershipTierCardsBlock'
import { MembershipComparisonBlock } from './MembershipComparisonBlock'
import { MembershipSingleTierHighlightBlock } from './MembershipSingleTierHighlightBlock'
import { MembershipPerksGridBlock } from './MembershipPerksGridBlock'
import { MembershipTableBlock } from './MembershipTableBlock'

// One membership plan. OPTIONAL data (read from SITE.memberships via cast — never
// declared on the emitted SITE literal), so a site with no memberships renders
// nothing and stays byte-identical. Distinct from pricing: recurring + perks-
// driven (a membership a customer joins, not a one-time service price).
export interface Membership {
  name: string
  price: string
  period?: string
  perks?: string[]
  highlighted?: boolean
}

// Per-type variant map (additive, like HERO_VARIANTS), tier-cards default.
export const MEMBERSHIP_VARIANTS: Record<string, typeof MembershipTierCardsBlock> = {
  'tier-cards': MembershipTierCardsBlock,
  comparison: MembershipComparisonBlock,
  'single-tier-highlight': MembershipSingleTierHighlightBlock,
  'perks-grid': MembershipPerksGridBlock,
  table: MembershipTableBlock,
}
