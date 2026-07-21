// Character resolver for INNER pages (service/area templates). The HOMEPAGE gets
// its character hero/CTA via HOMEPAGE_LAYOUT `variant` keys (scaffolder-stamped,
// resolved in routes/index.tsx). Inner pages have no layout array, so they resolve
// the character here from SITE.character (emitted by the scaffolder ONLY for the
// generic vertical) and render the SAME character variant with PER-PAGE content.
//
// BACKWARD COMPAT: SITE.character is absent for every known vertical (cleaning,
// painting, barbershop, …) → renderCharacterHero/Cta return null → the template
// keeps its CURRENT bespoke hero/CTA, byte-identical. Only generic-vertical sites
// (which set SITE.character) opt into the character inner-page hero/CTA.
import type { ComponentType, ReactElement } from 'react'
import { SITE } from '~/data/site'
import { HeroBoldFullbleedBlock } from './blocks/HeroBoldFullbleedBlock'
import { HeroElegantBlock } from './blocks/HeroElegantBlock'
import { HeroFriendlyBlock } from './blocks/HeroFriendlyBlock'
import { HeroModernBlock } from './blocks/HeroModernBlock'
import { HeroCorporateBlock } from './blocks/HeroCorporateBlock'
import { HeroCreativeBlock } from './blocks/HeroCreativeBlock'
import { CtaBoldBlock } from './blocks/CtaBoldBlock'
import { CtaElegantBlock } from './blocks/CtaElegantBlock'
import { CtaFriendlyBlock } from './blocks/CtaFriendlyBlock'
import { CtaModernBlock } from './blocks/CtaModernBlock'
import { CtaCorporateBlock } from './blocks/CtaCorporateBlock'
import { CtaCreativeBlock } from './blocks/CtaCreativeBlock'

/** Per-page content the inner-page character hero renders (all optional → each
 *  falls back to SITE.hero.* inside the variant, so an omitted field is safe). */
export interface CharacterHeroProps {
  headline?: string
  body?: string
  imageUrl?: string
  kicker?: string
  subheadline?: string
  ctaLabel?: string
  trustItems?: string[]
}

// SITE.character key → hero variant component. Only `bold` differs from its name
// (its hero variant key is 'bold-fullbleed'); the rest match the character name,
// mirroring CHARACTER_PRESETS.variants.hero in the factory scaffolder.
const HERO_BY_CHARACTER: Record<string, ComponentType<CharacterHeroProps>> = {
  bold: HeroBoldFullbleedBlock,
  elegant: HeroElegantBlock,
  friendly: HeroFriendlyBlock,
  modern: HeroModernBlock,
  corporate: HeroCorporateBlock,
  creative: HeroCreativeBlock,
}

const CTA_BY_CHARACTER: Record<string, ComponentType<{ title?: string; subtitle?: string }>> = {
  bold: CtaBoldBlock,
  elegant: CtaElegantBlock,
  friendly: CtaFriendlyBlock,
  modern: CtaModernBlock,
  corporate: CtaCorporateBlock,
  creative: CtaCreativeBlock,
}

function siteCharacter(): string | undefined {
  return (SITE as { character?: string }).character
}

/** Render the character hero with per-page props, or null when there's no
 *  character (known verticals) → caller renders its bespoke hero. */
export function renderCharacterHero(props: CharacterHeroProps): ReactElement | null {
  const character = siteCharacter()
  if (!character) return null
  const Hero = HERO_BY_CHARACTER[character]
  if (!Hero) return null
  return <Hero {...props} />
}

/** Render the character CTA (title/subtitle already have a SITE.homeCta fallback),
 *  or null when there's no character → caller renders its bespoke CTA. */
export function renderCharacterCta(props: { title?: string; subtitle?: string } = {}): ReactElement | null {
  const character = siteCharacter()
  if (!character) return null
  const Cta = CTA_BY_CHARACTER[character]
  if (!Cta) return null
  return <Cta {...props} />
}
