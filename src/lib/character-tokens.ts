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
//   · accentRole: KEEP the customer brand color (text-brand-*) on inner-page
//     icons/numerals — the character is hash-assigned; the brand kit is the
//     customer's. So accents are NOT tokenized here; templates keep text-brand-*.
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

const BOLD: CharacterTokens = {
  section: 'bg-background',
  sectionAlt: 'bg-background', // border-based rhythm (decision): white + border-y border-ink-100
  card: 'bg-white',
  border: 'border-ink-100',
  text: 'text-ink-900',
  muted: 'text-ink-500',
  cardRadius: 'rounded-lg',
  cardElevation: 'transition-all hover:-translate-y-1 hover:border-emerald-600 hover:shadow-xl',
  buttonRadius: 'rounded-lg',
  headingCase: 'uppercase',
  spacingY: 'py-16 md:py-24',
  SectionHeader: SectionHeaderBold as SectionHeaderComponent,
}

const ELEGANT_LIGHT: CharacterTokens = {
  section: 'bg-[#FBF7EF]',
  sectionAlt: 'bg-[#F3ECDE]',
  card: 'bg-white',
  border: 'border-[#E7DCC9]',
  text: 'text-[#2B2620]',
  muted: 'text-[#8A7E6E]',
  cardRadius: 'rounded-xl',
  cardElevation: 'transition-all hover:-translate-y-1 hover:border-emerald-600',
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
  section: 'bg-[#FFF6EC]',
  sectionAlt: 'bg-[#FFFBF5]',
  card: 'bg-white',
  border: 'border-[#F0E6DA]',
  text: 'text-[#3D3530]',
  muted: 'text-[#7A6F66]',
  cardRadius: 'rounded-3xl',
  cardElevation: 'shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl',
  buttonRadius: 'rounded-2xl',
  headingCase: '',
  spacingY: 'py-16 md:py-24',
  SectionHeader: SectionHeaderFriendly as SectionHeaderComponent,
}

const MODERN: CharacterTokens = {
  section: 'bg-[#F6F7F9]',
  sectionAlt: 'bg-white',
  card: 'bg-white',
  border: 'border-[#E6E8EC]',
  text: 'text-[#0F172A]',
  muted: 'text-[#64748B]',
  cardRadius: 'rounded-2xl',
  cardElevation: 'transition-all hover:-translate-y-1 hover:border-emerald-600',
  buttonRadius: 'rounded-2xl',
  headingCase: '',
  spacingY: 'py-16 md:py-24',
  SectionHeader: SectionHeaderModern as SectionHeaderComponent,
}

const CORPORATE: CharacterTokens = {
  section: 'bg-[#F4F6F9]',
  sectionAlt: 'bg-white',
  card: 'bg-white',
  border: 'border-[#D8DEE7]',
  text: 'text-[#1A2433]',
  muted: 'text-[#5A6678]',
  cardRadius: 'rounded-lg',
  cardElevation: 'transition-all hover:-translate-y-1 hover:shadow-md',
  buttonRadius: 'rounded-md',
  headingCase: '',
  spacingY: 'py-16 md:py-24',
  SectionHeader: SectionHeaderCorporate as SectionHeaderComponent,
}

const CREATIVE: CharacterTokens = {
  section: 'bg-white',
  sectionAlt: 'bg-[#FBFAFC]',
  card: 'bg-[#FBFAFC]',
  border: 'border-transparent', // creative cards are borderless (derived)
  text: 'text-[#18181B]',
  muted: 'text-[#71717A]',
  cardRadius: 'rounded-2xl',
  cardElevation: 'transition-transform hover:-translate-y-1.5',
  buttonRadius: 'rounded-2xl',
  headingCase: '',
  spacingY: 'py-16 md:py-24',
  SectionHeader: SectionHeaderCreative as SectionHeaderComponent,
}

const BY_CHARACTER: Record<string, CharacterTokens> = {
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
