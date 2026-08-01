// Per-build VARIANT MANIFEST (Arc 1 · Stage 2).
//
// A machine-readable list of the LAYOUT variants each homepage section can be
// swapped to, so the AI editor can OFFER the available layouts (instead of the
// owner having to know variant ids). The editor clones the deployed repo and
// reads THIS file, so the offered set always matches what the built site can
// actually render — a per-build manifest, shipped in every site.
//
// SOURCE OF TRUTH: the *_VARIANTS maps in src/routes/index.tsx (+ the per-section
// *-variants.ts files) own the id → component wiring. This file mirrors their
// KEYS with human labels. An id here that the render path doesn't know still
// falls back to the section's default component (non-destructive), and an id the
// render path knows but that's missing here just isn't OFFERED — neither breaks a
// build. Keep the two in sync when adding a variant.
//
// `default: true` marks the variant a section renders with no `variant` set.
// `wow: true` marks the Arc-1 brand-reactive, motion-rich variants.

export interface VariantOption {
  /** The id used as LayoutBlock.variant (e.g. 'aurora'). */
  id: string
  /** Human label for the editor to show. */
  label: string
  /** One-line description of the look. */
  description: string
  /** True for the section's default (no-variant) composition. */
  default?: boolean
  /** True for the Arc-1 WOW (brand-reactive + animated) variants. */
  wow?: boolean
}

export interface SectionVariants {
  /** The homepage block type (matches layout.ts BlockType + renderBlock case). */
  section: string
  /** Friendly section name for the editor. */
  label: string
  variants: VariantOption[]
}

export const VARIANT_MANIFEST: SectionVariants[] = [
  {
    section: 'hero',
    label: 'Hero',
    variants: [
      { id: 'modern', label: 'Modern split', description: 'Left copy / right image — the default split.', default: true },
      { id: 'aurora', label: 'Aurora (cinematic)', description: 'Full-bleed photo with a drifting brand-colored aurora and a frosted glass panel.', wow: true },
      { id: 'spotlight', label: 'Spotlight (editorial)', description: 'Light editorial split — a framed photo over a radial brand glow with floating trust chips.', wow: true },
      { id: 'editorial', label: 'Editorial (magazine)', description: 'Oversized headline revealed word by word, a brand hairline rule, and a wide image band.', wow: true },
      { id: 'bold-fullbleed', label: 'Bold full-bleed', description: 'Dark, industrial full-bleed image with a heavy uppercase headline and a trust band.' },
      { id: 'centered', label: 'Centered', description: 'Centered, full-width single-column hero.' },
      { id: 'background', label: 'Background image', description: 'Text over a background image.' },
      { id: 'split-reversed', label: 'Split (reversed)', description: 'Image left / copy right.' },
      { id: 'minimal', label: 'Minimal', description: 'Sparse, type-first hero.' },
      { id: 'video', label: 'Video', description: 'Hero with a video background.' },
      { id: 'elegant', label: 'Elegant', description: 'Refined character composition.' },
      { id: 'friendly', label: 'Friendly', description: 'Warm, approachable character composition.' },
      { id: 'corporate', label: 'Corporate', description: 'Buttoned-up character composition.' },
      { id: 'creative', label: 'Creative', description: 'Expressive character composition.' },
    ],
  },
  {
    section: 'servicesPreview',
    label: 'Services',
    variants: [
      { id: 'grid', label: 'Grid', description: 'Cards in a grid — the default.', default: true },
      { id: 'alternating-rows', label: 'Alternating rows', description: 'Full-width rows that alternate image side.' },
      { id: 'bento', label: 'Bento', description: 'Mixed-size bento tiles.' },
      { id: 'list', label: 'List', description: 'Compact stacked list.' },
      { id: 'icon-tiles', label: 'Icon tiles', description: 'Icon-led tiles.' },
      { id: 'carousel', label: 'Carousel', description: 'Horizontal carousel.' },
      { id: 'bold', label: 'Bold', description: 'Bold character composition.' },
      { id: 'elegant', label: 'Elegant', description: 'Refined character composition.' },
      { id: 'friendly', label: 'Friendly', description: 'Warm character composition.' },
      { id: 'modern', label: 'Modern', description: 'Modern character composition.' },
      { id: 'corporate', label: 'Corporate', description: 'Corporate character composition.' },
      { id: 'creative', label: 'Creative', description: 'Creative character composition.' },
    ],
  },
  {
    section: 'trustBar',
    label: 'Trust bar',
    variants: [
      { id: 'icon-row', label: 'Icon row', description: 'A row of icon + label items — the default.', default: true },
      { id: 'stat-numbers', label: 'Stat numbers', description: 'Big-number stat cells.' },
      { id: 'logo-strip', label: 'Logo strip', description: 'A strip of partner/credential logos.' },
      { id: 'credential-cells', label: 'Credential cells', description: 'Bordered credential cells.' },
      { id: 'bold', label: 'Bold', description: 'Bold character composition.' },
      { id: 'elegant', label: 'Elegant', description: 'Refined character composition.' },
      { id: 'friendly', label: 'Friendly', description: 'Warm character composition.' },
      { id: 'modern', label: 'Modern', description: 'Modern character composition.' },
      { id: 'corporate', label: 'Corporate', description: 'Corporate character composition.' },
      { id: 'creative', label: 'Creative', description: 'Creative character composition.' },
    ],
  },
  {
    section: 'serviceAreas',
    label: 'Service areas',
    variants: [
      { id: 'chips', label: 'Chips', description: 'A cloud of area chips — the default.', default: true },
      { id: 'map-style', label: 'Map style', description: 'A map-styled area layout.' },
      { id: 'columned-list', label: 'Columned list', description: 'Areas in tidy columns.' },
      { id: 'cards', label: 'Cards', description: 'Area cards.' },
      { id: 'stacked', label: 'Stacked', description: 'Stacked area rows.' },
      { id: 'bold', label: 'Bold', description: 'Bold character composition.' },
      { id: 'elegant', label: 'Elegant', description: 'Refined character composition.' },
      { id: 'friendly', label: 'Friendly', description: 'Warm character composition.' },
      { id: 'modern', label: 'Modern', description: 'Modern character composition.' },
      { id: 'corporate', label: 'Corporate', description: 'Corporate character composition.' },
      { id: 'creative', label: 'Creative', description: 'Creative character composition.' },
    ],
  },
  {
    section: 'reviews',
    label: 'Reviews',
    variants: [
      { id: 'grid', label: 'Grid', description: 'Review cards in a grid — the default.', default: true },
      { id: 'spotlight', label: 'Spotlight', description: 'One featured review, large.' },
      { id: 'carousel', label: 'Carousel', description: 'Horizontal review carousel.' },
      { id: 'masonry', label: 'Masonry', description: 'Masonry review wall.' },
      { id: 'stacked', label: 'Stacked', description: 'Stacked review rows.' },
      { id: 'bold', label: 'Bold', description: 'Bold character composition.' },
      { id: 'elegant', label: 'Elegant', description: 'Refined character composition.' },
      { id: 'friendly', label: 'Friendly', description: 'Warm character composition.' },
      { id: 'modern', label: 'Modern', description: 'Modern character composition.' },
      { id: 'corporate', label: 'Corporate', description: 'Corporate character composition.' },
      { id: 'creative', label: 'Creative', description: 'Creative character composition.' },
    ],
  },
  {
    section: 'cta',
    label: 'Call to action',
    variants: [
      { id: 'band', label: 'Band', description: 'A full-width CTA band — the default.', default: true },
      { id: 'color-block', label: 'Color block', description: 'A solid brand color block.' },
      { id: 'split-with-image', label: 'Split with image', description: 'Copy beside an image.' },
      { id: 'boxed-card', label: 'Boxed card', description: 'A contained CTA card.' },
      { id: 'stacked-centered', label: 'Stacked centered', description: 'Centered, stacked CTA.' },
      { id: 'bold', label: 'Bold', description: 'Bold character composition.' },
      { id: 'elegant', label: 'Elegant', description: 'Refined character composition.' },
      { id: 'friendly', label: 'Friendly', description: 'Warm character composition.' },
      { id: 'modern', label: 'Modern', description: 'Modern character composition.' },
      { id: 'corporate', label: 'Corporate', description: 'Corporate character composition.' },
      { id: 'creative', label: 'Creative', description: 'Creative character composition.' },
    ],
  },
]

/** Look up a section's variants by type (returns null if the section isn't listed). */
export function getSectionVariants(section: string): SectionVariants | null {
  return VARIANT_MANIFEST.find((s) => s.section === section) ?? null
}
