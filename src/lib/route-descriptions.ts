import { SITE } from '~/data/site'
import { SERVICES } from '~/data/services'
import { AREAS } from '~/data/areas'
import { tr } from '~/lib/i18n'

/**
 * ★ REAL META DESCRIPTIONS for the five index routes (2026-09-06). They used to be 25–57 characters
 * ("Where X works.") — search engines rewrite those. Each is built from what the site actually has:
 * the name, the city, the service names, the area names. Nothing generic, nothing invented, and the
 * list is capped so a description never runs past ~160 characters.
 */
const place = () => [SITE.address?.city, SITE.address?.state].filter(Boolean).join(', ')
const inPlace = () => (place() ? ` ${SITE_LANG_IN} ${place()}` : '')
const SITE_LANG_IN = tr('route.in')
function list(names: string[], max = 3): string {
  const a = names.filter(Boolean).slice(0, max)
  const more = names.length > max ? ` ${tr('route.andMore')}` : ''
  if (a.length <= 1) return (a[0] ?? '') + more
  return `${a.slice(0, -1).join(', ')} ${tr('route.and')} ${a[a.length - 1]}${more}`
}
const clamp = (s: string, n = 158) => (s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…')

export const routeDescriptions = {
  about: () => clamp(`${SITE.name}${inPlace()}: ${SITE.tagline ? SITE.tagline + ' ' : ''}${tr('route.aboutDescLong')}.`),
  areas: () => clamp(`${tr('route.areasDescLong')}: ${list(AREAS.map((a) => a.name), 4)}. ${SITE.name}${inPlace()}.`),
  pricing: () => clamp(`${tr('route.pricingDescLong')} ${SITE.name}${inPlace()}: ${list(SERVICES.map((s) => s.name), 3)}.`),
  services: () => clamp(`${tr('route.servicesDescLong')} ${SITE.name}${inPlace()}: ${list(SERVICES.map((s) => s.name), 4)}. ${tr('route.bookOrQuote')}.`),
  contact: () => clamp(`${tr('route.contactDescLong')}. ${SITE.name}${inPlace()}.`),
}
