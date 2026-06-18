import { PartnersLogoWallBlock } from './PartnersLogoWallBlock'
import { PartnersStripBlock } from './PartnersStripBlock'
import { PartnersGridBlock } from './PartnersGridBlock'
import { PartnersWithTextBlock } from './PartnersWithTextBlock'

// One partner / affiliated brand. OPTIONAL data (read from SITE.partners via cast
// — never on the emitted SITE literal), so a site with none renders nothing and
// stays byte-identical. Distinct from the trust bar (in-house guarantees): these
// are EXTERNAL brands/partners. name required; logo optional with a graceful
// name-text fallback (mirrors the trustBar logo-strip pattern).
export interface Partner {
  name: string
  logo?: string
}

// Per-type variant map (additive, like HERO_VARIANTS), logo-wall default.
export const PARTNERS_VARIANTS: Record<string, typeof PartnersLogoWallBlock> = {
  'logo-wall': PartnersLogoWallBlock,
  strip: PartnersStripBlock,
  grid: PartnersGridBlock,
  'with-text': PartnersWithTextBlock,
}
