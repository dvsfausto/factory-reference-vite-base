import { ProcessNumberedStepsBlock } from './ProcessNumberedStepsBlock'
import { ProcessTimelineBlock } from './ProcessTimelineBlock'
import { ProcessCardsBlock } from './ProcessCardsBlock'
import { ProcessAlternatingBlock } from './ProcessAlternatingBlock'
import { ProcessVerticalRailBlock } from './ProcessVerticalRailBlock'

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
export const PROCESS_VARIANTS: Record<string, typeof ProcessNumberedStepsBlock> = {
  'numbered-steps': ProcessNumberedStepsBlock,
  timeline: ProcessTimelineBlock,
  cards: ProcessCardsBlock,
  alternating: ProcessAlternatingBlock,
  'vertical-rail': ProcessVerticalRailBlock,
}
