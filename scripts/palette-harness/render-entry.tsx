import { createElement, type ComponentType } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { SITE } from '~/data/site'
import { ServicePageTemplate } from '~/components/ServicePageTemplate'

// Runs INSIDE the vite SSR module graph (loaded via ssrLoadModule by
// scripts/check-standalone-palette.mjs) so it shares the app's React instance and
// can render route components / templates loaded from the same graph.

// Mutate SITE.character so a single loaded module renders as any character (or a
// known vertical when ch is null). This is the ONLY thing that flips a page between
// the default palette and a character palette, so it's what the harness sweeps.
export function setCharacter(ch: string | null): void {
  const s = SITE as { character?: string }
  if (ch) s.character = ch
  else delete s.character
}

// Render a route component (route.options.component) to static markup.
export function renderComponent(Component: ComponentType): string {
  return renderToStaticMarkup(createElement(Component))
}

// A minimal-but-complete service page whose hero carries a per-service trustLine —
// the exact shape the scaffolder emits for a character site. Used to assert the
// trustLine renders integrated in the hero (not an orphaned band below it).
const SERVICE_MOCK = {
  slug: 'sample-service',
  title: 'Sample Service',
  description: 'A sample service.',
  hero: {
    h1: 'Sample Service in Anytown',
    subhead: 'A sample service tailored to you.',
    trustLine: 'trusted local · up-front pricing · tailored to you',
  },
  whatWeBuy: { title: 'What we cover', body: 'b', items: ['x'] },
  howPrice: { title: 'Pricing', body: 'b', factors: [{ title: 'f', text: 't' }] },
  scenarios: { title: 's', intro: 'i', cards: [{ title: 'c', text: 't' }] },
  pricing: { title: 'p', body: 'b', notes: ['n'] },
  coverage: { title: 'c', intro: 'i', areas: [] },
  faqs: [],
  relatedServices: [],
} as unknown as Parameters<typeof ServicePageTemplate>[0]['data']

export function renderServicePage(): string {
  return renderToStaticMarkup(createElement(ServicePageTemplate, { data: SERVICE_MOCK }))
}
