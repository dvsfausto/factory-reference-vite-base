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
  section: 'bg-fam-statement',
  sectionAlt: 'bg-fam-statement-2',
  card: 'bg-fam-statement-2',
  border: 'border-fam-statement-hairline',
  text: 'text-fam-on-statement',
  muted: 'text-fam-on-statement-muted',
};

const LIGHT: ElegantSurface = {
  section: 'bg-fam-surface',
  sectionAlt: 'bg-fam-surface-2',
  card: 'bg-fam-card',
  border: 'border-fam-hairline',
  text: 'text-fam-ink',
  muted: 'text-fam-ink-muted',
};

export function elegantSurface(): ElegantSurface {
  return (SITE as { surface?: string }).surface === 'dark' ? DARK : LIGHT;
}
