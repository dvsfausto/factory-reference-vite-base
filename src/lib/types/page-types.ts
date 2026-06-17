// Scaffolder contract: page data shapes the factory emits, the components consume.
// FAQ uses { question, answer } (Zmode canonical, matches cars-spanish reference).

export interface FAQ {
  question: string
  answer: string
}

// CANONICAL Testimonial contract (M4.2). Source of truth:
// factory-build/factory/contracts/testimonial.ts. Keep shape-identical to it
// and to the painter template — enforced by scripts/check-contract-parity.ts.
export interface Testimonial {
  text: string
  author: string
  location?: string
  rating?: number
}

export interface RelatedLink {
  href: string
  label: string
}

export interface ServiceRef {
  slug: string
  name: string
  short: string
  tagline?: string
}

export interface AreaRef {
  slug: string
  name: string
  tier?: 'home-base' | 'primary' | 'secondary'
  zipCodes?: string[]
}

export interface InfoPageRef {
  slug: string
  name: string
}

export interface ServicePageData {
  slug: string
  title: string
  description: string
  hero: {
    h1: string
    subhead: string
    trustLine?: string
  }
  whatWeBuy: {
    title: string
    body: string
    items: string[]
  }
  howPrice: {
    title: string
    body: string
    factors: { title: string; text: string }[]
  }
  scenarios: {
    title: string
    intro: string
    cards: { title: string; text: string }[]
  }
  pricing: {
    title: string
    body: string
    ranges?: { label: string; range: string }[]
    notes: string[]
  }
  coverage: {
    title: string
    intro: string
    areas: RelatedLink[]
  }
  localContext?: {
    title?: string
    body: string[]
  }
  testimonial?: Testimonial
  faqs: FAQ[]
  relatedServices: RelatedLink[]
}

export interface ServiceAreaPageData {
  slug: string
  title: string
  description: string
  name: string
  tier?: 'home-base' | 'primary' | 'secondary'
  zipCodes?: string[]
  hero: {
    h1: string
    subhead: string
  }
  about: {
    title: string
    body: string[]
  }
  servicesHere: {
    title: string
    intro: string
    featured: string[]
  }
  landmarks: {
    title: string
    intro: string
    items: string[]
  }
  localContext?: {
    title?: string
    body: string[]
  }
  testimonial?: Testimonial
  faqs: FAQ[]
  relatedAreas: RelatedLink[]
}

export interface InfoPageSection {
  heading: string
  body: string[]
  list?: string[]
}

export interface InfoPageData {
  slug: string
  title: string
  description: string
  hero: {
    h1: string
    subhead: string
  }
  intro: string[]
  sections: InfoPageSection[]
  faqs: FAQ[]
  relatedInfo: RelatedLink[]
  relatedServices: RelatedLink[]
}

// CANONICAL Review contract (M4.1). Source of truth:
// factory-build/factory/contracts/review.ts. Keep shape-identical to it and to
// the painter template — enforced by scripts/check-contract-parity.ts.
export interface Review {
  id: string
  text: string
  author: string
  rating: number
  location?: string
  service?: string
  date?: string
  source?: 'google' | 'yelp' | 'manual' | 'direct' | 'hybrid'
  avatar?: string
}
