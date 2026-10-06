import { ProcessNumberedStepsBlock } from './ProcessNumberedStepsBlock'
import { ProcessTimelineBlock } from './ProcessTimelineBlock'
import { ProcessCardsBlock } from './ProcessCardsBlock'
import { ProcessAlternatingBlock } from './ProcessAlternatingBlock'
import { ProcessVerticalRailBlock } from './ProcessVerticalRailBlock'
import { ProcessGlowNodesBlock } from './ProcessGlowNodesBlock'
import { ProcessBoldNumeralsBlock } from './ProcessBoldNumeralsBlock'
import { ProcessPullQuoteStepsBlock } from './ProcessPullQuoteStepsBlock'
import type { ComponentProps, ComponentType } from 'react'

// One process step. OPTIONAL data (read from SITE.steps via cast in the process
// blocks — never declared on the emitted SITE literal), so a site with no steps
// renders nothing and stays byte-identical. title/description required; icon is an
// optional lucide key (see process-icons.ts) that falls back to the step number.
export interface ProcessStep {
  title: string
  description: string
  icon?: string
}

// Per-type variant map for the process section (additive, like HERO_VARIANTS),
// numbered-steps as the default fallback.
// `quote` / `ctaLabel` / `ctaHref` (ZB-147 W1.2): the block's own params, read by the Editorial 'pull-quote-steps'
// layout; every other layout ignores them, so passing them changes nothing it renders.
export type ProcessVariantProps = ComponentProps<typeof ProcessNumberedStepsBlock> & { quote?: string; ctaLabel?: string; ctaHref?: string }
export const PROCESS_VARIANTS: Record<string, ComponentType<ProcessVariantProps>> = {
  'numbered-steps': ProcessNumberedStepsBlock,
  timeline: ProcessTimelineBlock,
  cards: ProcessCardsBlock,
  alternating: ProcessAlternatingBlock,
  'vertical-rail': ProcessVerticalRailBlock,
  // WOW Stage 2 (brand-reactive + motion): gradient-connector timeline, bold index numerals.
  'glow-nodes': ProcessGlowNodesBlock,
  'bold-numerals': ProcessBoldNumeralsBlock,
  // The Editorial theme (ZB-147 W1.2): kicker, serif pull quote, four hairline-topped numbered columns.
  'pull-quote-steps': ProcessPullQuoteStepsBlock,
}
