import { FormContactBlock } from './FormContactBlock'
import { FormBookingBlock } from './FormBookingBlock'
import { FormQuoteBlock } from './FormQuoteBlock'
import { FormSplitWithInfoBlock } from './FormSplitWithInfoBlock'
import { FormMinimalBlock } from './FormMinimalBlock'

// Per-type variant map for the Forms (contact/booking/quote) section (additive,
// like HERO_VARIANTS), contact as the default fallback. Every variant posts the
// SAME confirmed handle-website-lead envelope via submitLead (see forms-submit.ts);
// they differ only in fields, layout, and source_page. Always rendered — a form is
// useful on any site (no omit-when-absent).
export const FORMS_VARIANTS: Record<string, typeof FormContactBlock> = {
  contact: FormContactBlock,
  booking: FormBookingBlock,
  quote: FormQuoteBlock,
  'split-with-info': FormSplitWithInfoBlock,
  minimal: FormMinimalBlock,
}
