import { SITE, SITE_LANGUAGE } from '~/data/site'
import { AREAS } from '~/data/areas'
import { SERVICES } from '~/data/services-view'

// Per-route meta tag helpers + JSON-LD builders.
// Used by route head() functions. Mirrors the Next.js mode's buildMetadata
// helper so artifact->page emission is symmetrical across the two modes.

export interface BuildMetaInput {
  title: string
  description: string
  path: string
  ogImage?: string
  ogAlt?: string
}

export function buildMeta(input: BuildMetaInput) {
  const url = `${SITE.domain}${input.path}`
  const meta = [
    { title: input.title },
    { name: 'description', content: input.description },
    { property: 'og:title', content: input.title },
    { property: 'og:description', content: input.description },
    { property: 'og:url', content: url },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: input.title },
    { name: 'twitter:description', content: input.description },
  ]
  if (input.ogImage) {
    const fullImg = input.ogImage.startsWith('http')
      ? input.ogImage
      : `${SITE.domain}${input.ogImage}`
    meta.push({ property: 'og:image', content: fullImg })
    meta.push({ name: 'twitter:image', content: fullImg })
    if (input.ogAlt) {
      meta.push({ property: 'og:image:alt', content: input.ogAlt })
    }
  }
  return { meta, links: [{ rel: 'canonical', href: url }] }
}

// Phase A1: business hours → schema.org OpeningHoursSpecification. SITE.openingHours is an
// optional structured record ({ "Monday": { open, close }, ... }) that the factory scaffolder
// emits ONLY when the business has real hours; the generated `export const SITE` is a bare
// literal that omits the field otherwise, so it is read through an optional cast. Absent/empty
// → returns {} → localBusinessLd() output is BYTE-IDENTICAL to before. Partial (weekdays only)
// → only the present days appear; closed days are never invented.
function openingHoursSpecification() {
  const oh = (SITE as { openingHours?: Record<string, { open: string; close: string }> })
    .openingHours
  if (!oh) return {}
  const spec = Object.entries(oh).map(([day, h]) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: day,
    opens: h.open,
    closes: h.close,
  }))
  return spec.length > 0 ? { openingHoursSpecification: spec } : {}
}

// SEO-1: a LocalBusiness node that VALIDATES. Google's structured-data checker rejects empty
// strings and a bare "+" telephone; four of six real fixtures have no phone (SITE.phone === "+")
// and five have no street/zip. Every optional value is emitted only when it carries data —
// omitting a key is valid, an empty one is not. name/url/address.locality are always present.
const present = (v: string | undefined) => (typeof v === 'string' && v.trim() !== '' ? v : undefined)
const telephone = (v: string | undefined) => (v && /\d/.test(v) ? v : undefined)
function compact<T extends Record<string, unknown>>(o: T): Partial<T> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(o)) if (v !== undefined) out[k] = v
  return out as Partial<T>
}

// ★★★ THE BUSINESS AS GOOGLE SHOULD READ IT (the local SEO arc, 2026-09-25). One node, the most specific
// schema.org type the trade allows, the real country, no invented price range, coordinates when the business
// has them, the areas it serves, its services as an offer catalogue, its social links when it has any.
// Every value comes from the site's data; an absent value is omitted, never guessed.
const SCHEMA_TYPE_BY_TRADE: Record<string, string> = {
  barbershop: 'HairSalon', 'hair-salon': 'HairSalon', 'nail-salon': 'NailSalon', 'massage-therapy-studio': 'HealthAndBeautyBusiness',
  'day-spa': 'DaySpa', spa: 'DaySpa', 'beauty-salon': 'BeautySalon', 'tattoo': 'TattooParlor',
  gym: 'HealthClub', 'indoor-cycling-gym': 'HealthClub', 'personal-trainer': 'HealthClub', 'yoga-studio': 'HealthClub', 'pilates-studio': 'HealthClub',
  plumbing: 'Plumber', electrical: 'Electrician', hvac: 'HVACBusiness', roofing: 'RoofingContractor', painting: 'HousePainter',
  locksmith: 'Locksmith', moving: 'MovingCompany', 'remodeling-and-new-construction-company': 'GeneralContractor', 'general-contractor': 'GeneralContractor',
  handyman: 'HomeAndConstructionBusiness', landscaping: 'HomeAndConstructionBusiness', cleaning: 'LocalBusiness',
  'auto-detailing': 'AutoWash', 'mobile-car-wash': 'AutoWash', 'auto-repair': 'AutoRepair',
  legal: 'LegalService', accountant: 'AccountingService', consulting: 'ProfessionalService', saas: 'ProfessionalService',
  photography: 'ProfessionalService', 'travel-agency': 'TravelAgency', bakery: 'Bakery', restaurant: 'Restaurant', cafe: 'CafeOrCoffeeShop',
  florist: 'Florist', jewelry: 'JewelryStore', streetwear: 'ClothingStore', 'mobile-device-repair': 'Store', 'pet-grooming': 'LocalBusiness',
  dentist: 'Dentist', 'real-estate': 'RealEstateAgent', insurance: 'InsuranceAgency', 'child-care': 'ChildCare', 'event-venue': 'EventVenue',
}
const DEFAULT_BUSINESS_TYPE = 'LocalBusiness' // a schema.org type name, not a word a customer reads
const siteExtra = SITE as {
  industryKey?: string
  geo?: { lat: number; lng: number }
  social?: Record<string, string>
  logo_url?: string
  hero?: { image_url?: string }
}
/** The schema.org type for the business: the trade's own sub-type, else LocalBusiness. */
export function schemaBusinessType(): string {
  return SCHEMA_TYPE_BY_TRADE[(siteExtra.industryKey ?? '').toLowerCase()] ?? DEFAULT_BUSINESS_TYPE
}
/** A stable node id so every page's Service and Article can point at the same business. */
export function businessNodeId(): string {
  return `${SITE.domain}/#business`
}
/** The country the schema states: the site's own, else the US (a site with no country was always a US site). */
export function businessCountry(): string {
  const c = (SITE.address as { country?: string }).country
  return c && c.trim() ? c.trim().toUpperCase() : 'US'
}
/** og:locale for the site: the language plus the country (es_PE, es_CO, pt_BR, en_US). */
export function businessLocale(): string {
  const c = businessCountry()
  const lang = c === 'BR' ? 'pt' : SITE_LANGUAGE
  return `${lang}_${c}`
}
function absoluteImage(ref: string | undefined): string | undefined {
  if (!ref || !ref.trim()) return undefined
  if (ref.startsWith('http')) return ref
  return `${SITE.domain}/images/${ref.replace(/^\/?images\//, '').replace(/^\//, '')}`
}
function sameAs(): string[] | undefined {
  const links = Object.values(siteExtra.social ?? {}).filter((v) => typeof v === 'string' && /^https?:\/\//.test(v))
  return links.length ? links : undefined
}
function areaServed() {
  if ((SITE as { national?: boolean }).national) return undefined
  const region = present(SITE.address.state)
  const places = AREAS.map((a) => ({ '@type': 'Place', name: region ? `${a.name}, ${region}` : a.name }))
  return places.length ? places : undefined
}
function offerCatalog() {
  if (!SERVICES.length) return undefined
  return {
    '@type': 'OfferCatalog',
    name: SITE.name,
    itemListElement: SERVICES.map((svc) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: svc.name, url: `${SITE.domain}/services/${svc.slug}` },
    })),
  }
}

export function localBusinessLd() {
  const geo = siteExtra.geo
  return {
    '@context': 'https://schema.org',
    '@type': schemaBusinessType(),
    '@id': businessNodeId(),
    name: SITE.name,
    url: SITE.domain,
    ...compact({
      telephone: telephone(SITE.phone),
      email: present(SITE.email),
      image: absoluteImage(siteExtra.hero?.image_url),
      logo: absoluteImage(siteExtra.logo_url),
      sameAs: sameAs(),
      areaServed: areaServed(),
      hasOfferCatalog: offerCatalog(),
    }),
    address: {
      '@type': 'PostalAddress',
      ...compact({
        streetAddress: present(SITE.address.street),
        addressLocality: present(SITE.address.city),
        addressRegion: present(SITE.address.state),
        postalCode: present(SITE.address.zip),
      }),
      addressCountry: businessCountry(),
    },
    ...(geo && Number.isFinite(geo.lat) && Number.isFinite(geo.lng)
      ? { geo: { '@type': 'GeoCoordinates', latitude: geo.lat, longitude: geo.lng } }
      : {}),
    ...openingHoursSpecification(),
  }
}

export function serviceLd(name: string, description: string, image?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': schemaBusinessType(),
      '@id': businessNodeId(),
      name: SITE.name,
      ...compact({ telephone: telephone(SITE.phone) }),
    },
    ...compact({ areaServed: areaServed() }),
    ...(image && { image: image.startsWith('http') ? image : `${SITE.domain}${image}` }),
  }
}

export function faqLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: SITE_LANGUAGE,
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE.domain}${it.url}`,
    })),
  }
}

export function articleLd(input: {
  headline: string
  description: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    inLanguage: SITE_LANGUAGE,
    headline: input.headline,
    description: input.description,
    mainEntityOfPage: { '@type': 'WebPage', '@id': input.url },
    author: { '@type': 'Organization', name: SITE.name },
    publisher: { '@type': 'Organization', name: SITE.name },
  }
}
