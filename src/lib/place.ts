import { SITE } from '~/data/site'

/**
 * ★ WHERE THE BUSINESS WORKS, AS THE PAGE SAYS IT (ZB-147, 2026-10-06). A business that set its service area to a REGION
 * (the owner's setting; the factory then emits `SITE.region`) is named by its region in the page chrome, never by its home
 * city: "South Florida", not "Weston, FL". A site built without the setting has no `region` key and reads exactly as before.
 * The street address (contact blocks, the search listing's data) is the business's real address and is not touched here.
 */
type RegionFacts = { region?: string; areaScope?: string; voiceStatement?: string }
const facts = SITE as unknown as RegionFacts

/** The region's name, or '' for a business that is written by its city. */
export const REGION: string = typeof facts.region === 'string' ? facts.region.trim() : ''

/** "South Florida", else "Weston, FL". */
export function placeLine(site: { address: { city: string; state: string } } = SITE): string {
  return REGION || [site.address.city, site.address.state].filter(Boolean).join(', ')
}

/** "South Florida", else "Weston". */
export function placeName(site: { address: { city: string } } = SITE): string {
  return REGION || site.address.city
}

/** Who does the work, in the owner's words (site.voiceStatement); '' when the owner set none. */
export const VOICE_STATEMENT: string = typeof facts.voiceStatement === 'string' ? facts.voiceStatement.trim() : ''
