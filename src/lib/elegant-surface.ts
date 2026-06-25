import { SITE } from '~/data/site'

// Elegant surface palette, selected by SITE.surface. ELEGANT DEFAULTS LIGHT
// (warm ivory, refined + airy) and opts into DARK (the premium espresso
// sub-flavor) only when the build sets design_dna.surface='dark'. The DARK values
// reproduce the original elegant components' hardcoded espresso palette
// byte-for-byte, so a dark-opt-in build (e.g. the cigar lounge) renders
// identically to before. The accent stays the DNA emerald role (amber/steel/
// coral per the build) in BOTH modes — only the surface + text neutrals swap.
export interface ElegantSurface {
  /** Deepest section background. */
  section: string;
  /** Alternate section background (a tint). */
  sectionAlt: string;
  /** Raised card background. */
  card: string;
  /** Hairline border. */
  border: string;
  /** Primary text. */
  text: string;
  /** Muted/secondary text. */
  muted: string;
}

const DARK: ElegantSurface = {
  section: 'bg-[#1A1410]',
  sectionAlt: 'bg-[#241C16]',
  card: 'bg-[#241C16]',
  border: 'border-[#3A2E24]',
  text: 'text-[#F2E8DC]',
  muted: 'text-[#B8A893]',
};

const LIGHT: ElegantSurface = {
  section: 'bg-[#FBF7EF]',
  sectionAlt: 'bg-[#F3ECDE]',
  card: 'bg-white',
  border: 'border-[#E7DCC9]',
  text: 'text-[#2B2620]',
  muted: 'text-[#8A7E6E]',
};

export function elegantSurface(): ElegantSurface {
  return (SITE as { surface?: string }).surface === 'dark' ? DARK : LIGHT;
}
