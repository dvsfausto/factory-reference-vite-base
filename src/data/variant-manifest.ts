// Per-build VARIANT MANIFEST (Arc 1 · Stage 2).
//
// A machine-readable list of the LAYOUT variants each section can be swapped to,
// so the AI editor can OFFER the available layouts (instead of the owner having
// to know variant ids), and so a preview/style-guide can enumerate them. The
// editor clones the deployed repo and reads THIS file, so the offered set always
// matches what the built site can actually render — a per-build manifest.
//
// SOURCE OF TRUTH: the *_VARIANTS maps (in src/routes/index.tsx for hero/services/
// trustBar/serviceAreas/reviews/cta/faq, and the src/components/blocks/*-variants.ts
// files for story/gallery/pricing/process/forms) own the id → component wiring.
// This file mirrors their KEYS with human labels. An id here the render path
// doesn't know still falls back to the section default (non-destructive); an id
// the render path knows but that's missing here just isn't OFFERED. Keep in sync.
//
// `default: true` = the variant a section renders with no `variant` set.
// `wow: true`     = the Arc-1 brand-reactive, motion-rich variants.

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
  /** The block type (matches layout.ts BlockType + renderBlock case). */
  section: string
  /** Friendly section name for the editor. */
  label: string
  variants: VariantOption[]
}

// Character variants shared by most sections (bold/elegant/friendly/modern/
// corporate/creative) — brief labels, appended per section that has them.
const CHARACTER_VARIANTS: VariantOption[] = [
  { id: 'bold', label: 'Bold', description: 'Bold character composition.' },
  { id: 'elegant', label: 'Elegant', description: 'Refined character composition.' },
  { id: 'friendly', label: 'Friendly', description: 'Warm, approachable character composition.' },
  { id: 'modern', label: 'Modern', description: 'Modern character composition.' },
  { id: 'corporate', label: 'Corporate', description: 'Buttoned-up character composition.' },
  { id: 'creative', label: 'Creative', description: 'Expressive character composition.' },
]

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
      ...CHARACTER_VARIANTS.filter((v) => v.id !== 'bold' && v.id !== 'modern'),
    ],
  },
  {
    section: 'servicesPreview',
    label: 'Services',
    variants: [
      { id: 'grid', label: 'Grid', description: 'Cards in a grid — the default.', default: true },
      { id: 'luxe', label: 'Luxe glass', description: 'Frosted glass cards that lift and glow on hover, with a gradient index badge.', wow: true },
      { id: 'feature-rows', label: 'Feature rows', description: 'Large alternating rows with an oversized brand-gradient numeral and a lifted photo.', wow: true },
      { id: 'spotlight-tiles', label: 'Spotlight tiles', description: 'The lead service as a big brand-gradient spotlight tile; the rest as compact glass tiles.', wow: true },
      { id: 'alternating-rows', label: 'Alternating rows', description: 'Full-width rows that alternate image side.' },
      { id: 'bento', label: 'Bento', description: 'Mixed-size bento tiles.' },
      { id: 'list', label: 'List', description: 'Compact stacked list.' },
      { id: 'icon-tiles', label: 'Icon tiles', description: 'Icon-led tiles.' },
      { id: 'carousel', label: 'Carousel', description: 'Horizontal carousel.' },
      ...CHARACTER_VARIANTS,
    ],
  },
  {
    section: 'trustBar',
    label: 'Trust bar',
    variants: [
      { id: 'icon-row', label: 'Icon row', description: 'A row of icon + label items — the default.', default: true },
      { id: 'glow-cards', label: 'Glow cards', description: 'Glass cards with gradient icon badges that lift and glow on hover.', wow: true },
      { id: 'hairline-rows', label: 'Hairline row', description: 'A sleek row divided by brand hairlines over a faint brand tint.', wow: true },
      { id: 'stat-numbers', label: 'Stat numbers', description: 'Big-number stat cells.' },
      { id: 'logo-strip', label: 'Logo strip', description: 'A strip of partner/credential logos.' },
      { id: 'credential-cells', label: 'Credential cells', description: 'Bordered credential cells.' },
      ...CHARACTER_VARIANTS,
    ],
  },
  {
    section: 'serviceAreas',
    label: 'Service areas',
    variants: [
      { id: 'chips', label: 'Chips', description: 'A cloud of area chips — the default.', default: true },
      { id: 'glow-pins', label: 'Glow pins', description: 'Glass area cards on a brand field with gradient pins and hover glow.', wow: true },
      { id: 'brand-panel', label: 'Brand panel', description: 'A bold brand-gradient panel listing areas in tidy hairline-divided columns.', wow: true },
      { id: 'map-style', label: 'Map style', description: 'A map-styled area layout.' },
      { id: 'columned-list', label: 'Columned list', description: 'Areas in tidy columns.' },
      { id: 'cards', label: 'Cards', description: 'Area cards.' },
      { id: 'stacked', label: 'Stacked', description: 'Stacked area rows.' },
      ...CHARACTER_VARIANTS,
    ],
  },
  {
    section: 'reviews',
    label: 'Reviews',
    variants: [
      { id: 'grid', label: 'Grid', description: 'Review cards in a grid — the default.', default: true },
      { id: 'luminous', label: 'Luminous', description: 'Frosted glass quote cards over a soft brand surface with a big gradient quote mark.', wow: true },
      { id: 'pull-quote', label: 'Pull quote', description: 'One large featured pull-quote beside a brand rule, with the real rating and small chips.', wow: true },
      { id: 'glass-wall', label: 'Glass wall', description: 'A masonry wall of varied-height glass cards in a brand hairline frame.', wow: true },
      { id: 'spotlight', label: 'Spotlight', description: 'One featured review, large.' },
      { id: 'carousel', label: 'Carousel', description: 'Horizontal review carousel.' },
      { id: 'masonry', label: 'Masonry', description: 'Masonry review wall.' },
      { id: 'stacked', label: 'Stacked', description: 'Stacked review rows.' },
      ...CHARACTER_VARIANTS,
    ],
  },
  {
    section: 'cta',
    label: 'Call to action',
    variants: [
      { id: 'band', label: 'Band', description: 'A full-width CTA band — the default.', default: true },
      { id: 'aurora-glow', label: 'Aurora glow', description: 'A full-bleed brand-gradient band with ambient glow and a glowing CTA.', wow: true },
      { id: 'glass-panel', label: 'Glass panel', description: 'A frosted glass CTA card floating over a soft brand surface.', wow: true },
      { id: 'color-block', label: 'Color block', description: 'A solid brand color block.' },
      { id: 'split-with-image', label: 'Split with image', description: 'Copy beside an image.' },
      { id: 'boxed-card', label: 'Boxed card', description: 'A contained CTA card.' },
      { id: 'stacked-centered', label: 'Stacked centered', description: 'Centered, stacked CTA.' },
      ...CHARACTER_VARIANTS,
    ],
  },
  {
    section: 'faq',
    label: 'FAQ',
    variants: [
      { id: 'accordion', label: 'Accordion', description: 'The standard FAQ accordion — the default.', default: true },
      { id: 'glass-accordion', label: 'Glass accordion', description: 'Glass cards with a gradient “+” that rotates open and a soft glow on the open item.', wow: true },
      { id: 'split-panel', label: 'Split panel', description: 'A brand-gradient side panel beside the Q&A list on a soft brand surface.', wow: true },
    ],
  },
  {
    section: 'story',
    label: 'About / Story',
    variants: [
      { id: 'narrative', label: 'Narrative', description: 'A centered story narrative — the default.', default: true },
      { id: 'editorial-frame', label: 'Editorial frame', description: 'Story copy beside a framed photo over a radial brand glow with a hairline rule.', wow: true },
      { id: 'manifesto-glow', label: 'Manifesto', description: 'A large centered narrative with an oversized brand-gradient quote mark and script accent.', wow: true },
      { id: 'split-image', label: 'Split image', description: 'Story copy beside an image.' },
      { id: 'stat-band', label: 'Stat band', description: 'Story with a stats band (only if real stats exist).' },
      { id: 'milestone-timeline', label: 'Milestone timeline', description: 'A timeline of milestones (only if real milestones exist).' },
    ],
  },
  {
    section: 'gallery',
    label: 'Gallery',
    variants: [
      { id: 'masonry', label: 'Masonry', description: 'A masonry image wall — the default.', default: true },
      { id: 'cinematic-masonry', label: 'Cinematic masonry', description: 'Rounded brand-framed masonry with hover zoom and a brand-gradient caption.', wow: true },
      { id: 'featured-film', label: 'Featured filmstrip', description: 'A large featured image over a brand glow, then a filmstrip of the rest with glass chips.', wow: true },
      { id: 'edge-grid', label: 'Edge grid', description: 'An edge-to-edge grid with brand-gradient corner accents and staggered reveal.', wow: true },
      { id: 'grid', label: 'Grid', description: 'A uniform image grid.' },
      { id: 'before-after-slider', label: 'Before / after', description: 'Before-and-after sliders.' },
      { id: 'carousel', label: 'Carousel', description: 'A horizontal image carousel.' },
      { id: 'featured-thumbs', label: 'Featured + thumbs', description: 'A featured image with thumbnails.' },
      { id: 'justified', label: 'Justified', description: 'A justified photo grid.' },
    ],
  },
  {
    section: 'pricing',
    label: 'Pricing',
    variants: [
      { id: 'tiers', label: 'Tiers', description: 'Pricing tier cards — the default.', default: true },
      { id: 'luxe-glass', label: 'Luxe glass', description: 'Premium glass tier cards with the featured tier filled by the brand gradient and glow.', wow: true },
      { id: 'spotlight-tier', label: 'Spotlight tier', description: 'The featured plan spotlighted as a large brand-gradient card, the rest as glass rows.', wow: true },
      { id: 'comparison-table', label: 'Comparison table', description: 'A feature comparison table.' },
      { id: 'toggle', label: 'Monthly / annual toggle', description: 'Tiers with a billing-period toggle.' },
      { id: 'cards', label: 'Cards', description: 'Plain pricing cards.' },
      { id: 'single-highlight', label: 'Single highlight', description: 'One highlighted plan.' },
      { id: 'list', label: 'List', description: 'A simple pricing list.' },
    ],
  },
  {
    section: 'process',
    label: 'Process',
    variants: [
      { id: 'numbered-steps', label: 'Numbered steps', description: 'Numbered process steps — the default.', default: true },
      { id: 'glow-nodes', label: 'Glow timeline', description: 'A vertical timeline with a brand-gradient connector and glowing numbered nodes.', wow: true },
      { id: 'bold-numerals', label: 'Bold numerals', description: 'Big glass step cards watermarked with oversized brand-gradient index numerals.', wow: true },
      { id: 'timeline', label: 'Timeline', description: 'A horizontal timeline.' },
      { id: 'cards', label: 'Cards', description: 'Step cards.' },
      { id: 'alternating', label: 'Alternating', description: 'Alternating step rows.' },
      { id: 'vertical-rail', label: 'Vertical rail', description: 'A vertical rail of steps.' },
    ],
  },
  {
    section: 'forms',
    label: 'Contact form',
    variants: [
      { id: 'contact', label: 'Contact', description: 'The standard contact form — the default.', default: true },
      { id: 'float-glass', label: 'Floating glass', description: 'The form as a frosted glass card floating over a soft brand surface with a brand hairline.', wow: true },
      { id: 'brand-split', label: 'Brand split', description: 'A brand-gradient side panel with real contact details beside the form card.', wow: true },
      { id: 'booking', label: 'Booking', description: 'A booking-style form.' },
      { id: 'quote', label: 'Quote', description: 'A request-a-quote form.' },
      { id: 'split-with-info', label: 'Split with info', description: 'The form beside a contact-info panel.' },
      { id: 'minimal', label: 'Minimal', description: 'A minimal inline form.' },
    ],
  },
]

/** Look up a section's variants by type (returns null if the section isn't listed). */
export function getSectionVariants(section: string): SectionVariants | null {
  return VARIANT_MANIFEST.find((s) => s.section === section) ?? null
}

/** All WOW (brand-reactive, animated) variants for a section, in manifest order. */
export function getWowVariants(section: string): VariantOption[] {
  return getSectionVariants(section)?.variants.filter((v) => v.wow) ?? []
}
