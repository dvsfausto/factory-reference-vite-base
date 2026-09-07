// CHARACTER_TOKENS — the character visual language, codified from the existing
// homepage variant components (Services/Reviews/Cta/SectionHeader per character).
// Threaded into the SHARED inner-page middle sections (service/area templates) so
// those sections adopt the character's surface, text, card, and heading treatment
// instead of the generic default — WITHOUT per-character copies of the DOM.
//
// BACKWARD COMPAT: resolveCharacterTokens() returns null for known verticals (no
// SITE.character) → the templates keep their CURRENT hardcoded classes verbatim
// (byte-identical). Only generic-vertical sites (which set SITE.character) opt in.
//
// DERIVED, not invented — every value below is lifted from the real variant classes
// (Services{Bold,Elegant,Friendly,Modern,Corporate,Creative}Block + elegantSurface).
// Operator decisions (2026-07-21):
//   · accentRole (REVISED 2026-07-22): the customer brand color (text-brand-*) is
//     BRAND EXPRESSION and stays on the primary CTA (CtaBlock, a separate section).
//     But DECORATIVE CHROME inside the shared middle sections — eyebrow chips, script
//     flourishes, section numerals, dividers, read-more links, feature-check icons —
//     is CHARACTER chrome, not brand: bright brand-blue on an elegant cream surface
//     reads as broken. So on a character site those adopt the character accent
//     (emerald, the DNA accent every character block already uses) via the accent*
//     tokens below; known verticals keep text-brand-* (byte-identical). There is no
//     primary CTA in the middle sections, so nothing brand-expressive is retinted.
//   · bold sectionAlt: border-based (white + border-y border-ink-100), no invented
//     tint — hairlines are bold's language.
//   · dark elegant card: lifted to #2C221B (from #241C16) for card/section
//     separation — flat cards are the dark-mode muddy failure mode.
//
// font + base radius scale already carry via CSS vars (--font-display, --radius-*),
// so they are not tokens. headerTreatment reuses the existing SectionHeader{Char}.
import type { ComponentType } from 'react'
import { SITE } from '~/data/site'
import { SectionHeader } from '~/components/SectionHeader'
import { SectionHeaderBold } from '~/components/SectionHeaderBold'
import { SectionHeaderElegant } from '~/components/SectionHeaderElegant'
import { SectionHeaderFriendly } from '~/components/SectionHeaderFriendly'
import { SectionHeaderModern } from '~/components/SectionHeaderModern'
import { SectionHeaderCorporate } from '~/components/SectionHeaderCorporate'
import { SectionHeaderCreative } from '~/components/SectionHeaderCreative'

type SectionHeaderComponent = typeof SectionHeader

export interface CharacterTokens {
  /** Plain section background. */
  section: string
  /** Alternate (banded) section background. */
  sectionAlt: string
  /** Raised card background. */
  card: string
  /** Hairline border for sections + cards. */
  border: string
  /** Primary text (headings + body). MUST be legible on `section`/`sectionAlt`. */
  text: string
  /** Secondary/muted text. */
  muted: string
  /** Optional breadcrumb-band override for a character whose HERO is dark but whose `section` is
   *  light. The crumb sits directly OVER the hero, so it must coordinate with the hero surface, not
   *  the middle-section surface. Only `bold` needs it (bold's `section` IS bg-background/white, so
   *  wrapping the crumb in the section renders a white band over its dark navy hero). Undefined →
   *  the crumb uses `section` + `text`/`muted` (today's behaviour; every other character unchanged). */
  crumb?: { surface: string; text: string; muted: string }
  /** Decorative-chrome accent (eyebrow chips, script flourishes, links, em-dashes) —
   *  the character DNA accent, replacing brand-blue inside tokenized sections. */
  accent: string
  /** Stronger accent shade (prominent numerals, e.g. price ranges). */
  accentStrong: string
  /** Faint accent shade (large ghosted numerals). */
  accentFaint: string
  /** Soft accent background (eyebrow-chip fill). */
  accentBg: string
  /** Accent hairline (eyebrow-chip border). */
  accentBorder: string
  /** Accent hover (interactive chips/links). */
  accentHover: string
  /** Card corner radius (on top of the DNA radius scale). */
  cardRadius: string
  /** Card elevation/hover treatment. */
  cardElevation: string
  /** Button corner radius. */
  buttonRadius: string
  /** '' | 'uppercase' — inline heading case. */
  headingCase: string
  /** Section vertical rhythm. */
  spacingY: string
  /** The character's SectionHeader (eyebrow treatment). */
  SectionHeader: SectionHeaderComponent
}

const CHARACTER_ACCENT = {
  accent: 'text-fam-accent-text',
  accentStrong: 'text-fam-accent-text-strong',
  accentFaint: 'text-fam-accent-tint',
  accentBg: 'bg-fam-accent-soft',
  accentBorder: 'border-fam-accent-soft-2',
  accentHover: 'hover:border-fam-accent hover:text-fam-accent-text',
} as const

const BOLD: CharacterTokens = {
  ...CHARACTER_ACCENT,
  section: 'bg-background',
  sectionAlt: 'bg-background', // border-based rhythm (decision): white + border-y border-ink-100
  card: 'bg-white',
  border: 'border-ink-100',
  text: 'text-ink-900',
  muted: 'text-ink-500',
  // Bold's hero is dark navy (HeroBoldFullbleedBlock → bg-ink-900 text-white) but its section is
  // white. The crumb sits over the hero, so it coordinates with the hero's dark chrome (matching the
  // dark footer, bg-ink-900) with light text — not the white section that produced the white band.
  crumb: { surface: 'bg-ink-900', text: 'text-white', muted: 'text-white/70' },
  cardRadius: 'rounded-lg',
  cardElevation: 'transition-all hover:-translate-y-1 hover:border-fam-accent hover:shadow-xl',
  buttonRadius: 'rounded-lg',
  headingCase: 'uppercase',
  spacingY: 'py-16 md:py-24',
  SectionHeader: SectionHeaderBold as SectionHeaderComponent,
}

const ELEGANT_LIGHT: CharacterTokens = {
  ...CHARACTER_ACCENT,
  section: 'bg-fam-surface',
  sectionAlt: 'bg-fam-surface-2',
  card: 'bg-white',
  border: 'border-fam-hairline',
  text: 'text-fam-ink',
  muted: 'text-fam-ink-muted',
  cardRadius: 'rounded-xl',
  cardElevation: 'transition-all hover:-translate-y-1 hover:border-fam-accent',
  buttonRadius: 'rounded-lg',
  headingCase: '',
  spacingY: 'py-20 md:py-28',
  SectionHeader: SectionHeaderElegant as SectionHeaderComponent,
}

const ELEGANT_DARK: CharacterTokens = {
  ...ELEGANT_LIGHT,
  section: 'bg-[#1A1410]',
  sectionAlt: 'bg-[#241C16]',
  card: 'bg-[#2C221B]', // lifted from #241C16 for card/section separation (decision)
  border: 'border-[#3A2E24]',
  text: 'text-[#F2E8DC]',
  muted: 'text-[#B8A893]',
}

const FRIENDLY: CharacterTokens = {
  ...CHARACTER_ACCENT,
  section: 'bg-fam-surface-2',
  sectionAlt: 'bg-fam-surface',
  card: 'bg-white',
  border: 'border-fam-hairline',
  text: 'text-fam-ink',
  muted: 'text-fam-ink-muted',
  cardRadius: 'rounded-3xl',
  cardElevation: 'shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl',
  buttonRadius: 'rounded-2xl',
  headingCase: '',
  spacingY: 'py-16 md:py-24',
  SectionHeader: SectionHeaderFriendly as SectionHeaderComponent,
}

const MODERN: CharacterTokens = {
  ...CHARACTER_ACCENT,
  section: 'bg-fam-surface-2',
  sectionAlt: 'bg-white',
  card: 'bg-white',
  border: 'border-fam-hairline',
  text: 'text-fam-ink',
  muted: 'text-fam-ink-muted',
  cardRadius: 'rounded-2xl',
  cardElevation: 'transition-all hover:-translate-y-1 hover:border-fam-accent',
  buttonRadius: 'rounded-2xl',
  headingCase: '',
  spacingY: 'py-16 md:py-24',
  SectionHeader: SectionHeaderModern as SectionHeaderComponent,
}

const CORPORATE: CharacterTokens = {
  ...CHARACTER_ACCENT,
  section: 'bg-fam-surface-2',
  sectionAlt: 'bg-white',
  card: 'bg-white',
  border: 'border-fam-hairline',
  text: 'text-fam-ink',
  muted: 'text-fam-ink-muted',
  cardRadius: 'rounded-lg',
  cardElevation: 'transition-all hover:-translate-y-1 hover:shadow-md',
  buttonRadius: 'rounded-md',
  headingCase: '',
  spacingY: 'py-16 md:py-24',
  SectionHeader: SectionHeaderCorporate as SectionHeaderComponent,
}

const CREATIVE: CharacterTokens = {
  ...CHARACTER_ACCENT,
  section: 'bg-white',
  sectionAlt: 'bg-fam-surface-2',
  card: 'bg-fam-surface-2',
  border: 'border-transparent', // creative cards are borderless (derived)
  text: 'text-fam-ink',
  muted: 'text-fam-ink-muted',
  cardRadius: 'rounded-2xl',
  cardElevation: 'transition-transform hover:-translate-y-1.5',
  buttonRadius: 'rounded-2xl',
  headingCase: '',
  spacingY: 'py-16 md:py-24',
  SectionHeader: SectionHeaderCreative as SectionHeaderComponent,
}

// Exported so the palette harness can compare a rendered crumb's ink classes against each
// character's OWN tokens (bold legitimately uses text-ink-500/900, so a blanket "no ink"
// assertion would false-positive it — the harness must know the per-character tokens).
export const BY_CHARACTER: Record<string, CharacterTokens> = {
  bold: BOLD,
  elegant: ELEGANT_LIGHT,
  friendly: FRIENDLY,
  modern: MODERN,
  corporate: CORPORATE,
  creative: CREATIVE,
}

/**
 * The character tokens for THIS site, or null for known verticals (no
 * SITE.character) → callers keep their current hardcoded classes (byte-identical).
 * elegant honors SITE.surface='dark' (the espresso palette).
 */
export function resolveCharacterTokens(): CharacterTokens | null {
  const character = (SITE as { character?: string }).character
  if (!character) return null
  if (character === 'elegant') {
    return (SITE as { surface?: string }).surface === 'dark' ? ELEGANT_DARK : ELEGANT_LIGHT
  }
  return BY_CHARACTER[character] ?? null
}
