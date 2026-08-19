import { SITE } from '~/data/site'

// Approach A, Phase 1 — the index/static pages (pricing/about/reviews/contact/services-index/areas-index)
// hardcode WOW variants (aurora-glow / glow-cards) in their _LAYOUT arrays, so they render WOW regardless of
// the site's design-wave family — an inner page that doesn't match the homepage. The family variants for
// these shared section types (cta / trustBar) ALREADY EXIST and are simply not used here.
//
// familyOr() repoints a layout block to the site's family variant when one is registered, else keeps the WOW
// default. Only the six CHARACTER families have per-section variants (bold/elegant/friendly/modern/corporate/
// creative); 'clean' / 'wow-glass' have none, so they (and non-family sites, headerVariant absent) fall back
// to the WOW default — byte-identical. SITE.headerVariant is the emitted family (design_dna.design.direction).
const FAMILY_VARIANT_FAMILIES = ['bold', 'elegant', 'friendly', 'modern', 'corporate', 'creative']

/** The site's family variant for a shared section, or `fallback` when there is no registered family variant. */
export function familyOr(fallback: string): string {
  const fam = (SITE as { headerVariant?: string }).headerVariant
  return fam && FAMILY_VARIANT_FAMILIES.includes(fam) ? fam : fallback
}
