import type { ComponentType } from 'react'
import { FormContactBlock } from './FormContactBlock'
import { FormBookingBlock } from './FormBookingBlock'
import { FormQuoteBlock } from './FormQuoteBlock'
import { FormSplitWithInfoBlock } from './FormSplitWithInfoBlock'
import { FormMinimalBlock } from './FormMinimalBlock'
import { FormFloatGlassBlock } from './FormFloatGlassBlock'
import { FormBrandSplitBlock } from './FormBrandSplitBlock'

// The props every Forms variant may receive from its block.params (all optional → each variant reads
// the subset it needs). label/heading/body/submitLabel are editable copy; `services` is the catalog
// widget's owner-chosen service list (the quote form's picker). A contact variant simply ignores the
// last two. This is the widget-as-config seam: booking/cart become new variants reading these props.
export interface FormBlockProps {
  label?: string
  heading?: string
  body?: string
  submitLabel?: string
  services?: { slug: string; name: string; id?: string }[]
}

// Per-type variant map for the Forms (contact/booking/quote) section (additive, like HERO_VARIANTS),
// contact as the default fallback. The CONTACT/booking skins post the generic handle-website-lead
// envelope (submitLead); the QUOTE variant posts a structured quote_request (submitQuoteRequest) —
// they differ in endpoint, fields, and layout. Always rendered — a form is useful on any site.
export const FORMS_VARIANTS: Record<string, ComponentType<FormBlockProps>> = {
  contact: FormContactBlock,
  booking: FormBookingBlock,
  quote: FormQuoteBlock,
  'split-with-info': FormSplitWithInfoBlock,
  minimal: FormMinimalBlock,
  // WOW Stage 2 (brand-reactive + motion; same submitLead handler/fields, restyled shell only).
  'float-glass': FormFloatGlassBlock,
  'brand-split': FormBrandSplitBlock,
}
