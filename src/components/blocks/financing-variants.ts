import { FinancingHighlightBandBlock } from './FinancingHighlightBandBlock'
import { FinancingCardsBlock } from './FinancingCardsBlock'
import { FinancingStepsBlock } from './FinancingStepsBlock'

// Financing info — a single optional object (read from SITE.financing via cast,
// never on the emitted SITE literal). The section OMITS entirely when absent —
// never fabricates terms. headline + options required; partner (the financing
// provider) optional, surfaced within each variant.
export interface Financing {
  headline: string
  options: string[]
  partner?: string
}

// Per-type variant map (additive, like HERO_VARIANTS), highlight-band default.
//
// NOTE: the candidate 'partner-logos' is intentionally NOT built — Financing's
// `partner` is a single provider, and a partner-logo wall is exactly the dedicated
// Partners section (which has a partners[] shape). Building it here would duplicate
// that section; the partner is instead surfaced inside these three variants.
export const FINANCING_VARIANTS: Record<string, typeof FinancingHighlightBandBlock> = {
  'highlight-band': FinancingHighlightBandBlock,
  cards: FinancingCardsBlock,
  steps: FinancingStepsBlock,
}
