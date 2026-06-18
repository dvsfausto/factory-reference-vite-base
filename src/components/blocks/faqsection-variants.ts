import { FaqAccordionBlock } from './FaqAccordionBlock'
import { FaqTwoColumnBlock } from './FaqTwoColumnBlock'
import { FaqListBlock } from './FaqListBlock'

// Per-type variant map for the FAQ-as-section block (additive, like
// HERO_VARIANTS), accordion as the default fallback. Reuses SITE.homeFaqs.
//
// NOTE: 'grouped' from the candidate set is intentionally NOT built — homepage
// FAQs are flat { question, answer } with no category, so a grouped layout would
// collapse to a single group identical to 'list'. Three distinct layouts instead
// of a forced fourth. (The legacy ink-tokened FaqBlock/FAQSection stays as-is for
// the homepage/composed pages; these are the DNA-tokened section variants.)
export const FAQSECTION_VARIANTS: Record<string, typeof FaqAccordionBlock> = {
  accordion: FaqAccordionBlock,
  'two-column': FaqTwoColumnBlock,
  list: FaqListBlock,
}
