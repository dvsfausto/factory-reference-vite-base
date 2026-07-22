import { SITE } from '~/data/site'

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

export function localBusinessLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE.name,
    url: SITE.domain,
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.state,
      postalCode: SITE.address.zip,
      addressCountry: 'US',
    },
    priceRange: '$$',
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
      '@type': 'LocalBusiness',
      name: SITE.name,
      telephone: SITE.phone,
    },
    ...(image && { image: image.startsWith('http') ? image : `${SITE.domain}${image}` }),
  }
}

export function faqLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
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
    headline: input.headline,
    description: input.description,
    mainEntityOfPage: { '@type': 'WebPage', '@id': input.url },
    author: { '@type': 'Organization', name: SITE.name },
    publisher: { '@type': 'Organization', name: SITE.name },
  }
}
