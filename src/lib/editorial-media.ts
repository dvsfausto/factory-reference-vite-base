import type { CSSProperties } from 'react'
import { PORTRAIT_DEFAULT_FOCUS } from '~/lib/hero-focus'
import { CUSTOM_PAGES, customPagesData } from '~/data/custom-pages'
import { PROJECTS, type GalleryItem } from '~/data/projects'
import { SERVICES } from '~/data/services'

/* Shared reads for the Editorial variants (ZB-147 W1.2). No colour, no copy: only where a photo is anchored, which
   page the gallery lives on, and how the portfolio picks its three cards. */

/**
 * FACE-SAFE CROP: a portrait photo drawn into a landscape or square box must keep heads. The owner's own focal
 * point wins when the data has one; otherwise the photo is anchored towards its top (the same "50% 22%" the hero
 * portrait rule uses), never the centre.
 */
export function faceSafeStyle(focus?: string | null): CSSProperties {
  return { objectPosition: focus || PORTRAIT_DEFAULT_FOCUS }
}

/** A project's category when the data carries one (the GalleryItem type has none today; owner data may). */
export function projectCategory(p: GalleryItem): string {
  const c = (p as GalleryItem & { category?: unknown }).category
  return typeof c === 'string' ? c.trim() : ''
}

/**
 * The gallery page's address, or null when the site has none: the first custom page whose layout holds a gallery
 * block (a slug named gallery/portfolio first). Custom pages serve at /<slug> (routes/$slug.tsx).
 */
export function galleryPageHref(): string | null {
  const slugs = CUSTOM_PAGES.map((p) => p.slug).filter((s) => customPagesData[s])
  const withGallery = slugs.filter((s) => customPagesData[s]?.layout?.some((b) => b.type === 'gallery'))
  const preferred = withGallery.find((s) => /gallery|portfolio|galeria|galería|portafolio/i.test(s))
  const slug = preferred ?? withGallery[0]
  return slug ? `/${slug}` : null
}

/**
 * The portfolio's cards: PROJECTS grouped by category (title when none), the first photo of the first three groups;
 * fewer than three groups → filled with the first photos of the remaining projects, in order. At most three.
 */
export function portfolioPicks(projects: GalleryItem[] = PROJECTS, max = 3): GalleryItem[] {
  const seenGroup = new Set<string>()
  const picks: GalleryItem[] = []
  for (const p of projects) {
    const key = projectCategory(p) || p.title
    if (seenGroup.has(key)) continue
    seenGroup.add(key)
    picks.push(p)
    if (picks.length === max) return picks
  }
  for (const p of projects) {
    if (picks.length === max) break
    if (!picks.includes(p)) picks.push(p)
  }
  return picks
}

type ServiceLike = { slug: string; displayName?: string; name?: string }
const serviceName = (s: ServiceLike): string => String(s.displayName ?? s.name ?? '')
const stem = (w: string): string => w.replace(/(ies|s)$/, (m) => (m === 'ies' ? 'y' : ''))

/**
 * The service a portfolio card belongs to: the service whose name shares a word with the card's title or category
 * ("Wedding photography" → wedding). Words are stemmed (portraits = portrait), filler words dropped, and the best
 * match wins: more shared words first, then the shorter name ("Portrait session" → Family Portraits, not Business
 * Lifestyle Portraits). Null when no service shares a word.
 */
export function serviceFor(...labels: Array<string | undefined | null>): ServiceLike | null {
  const words = labels.filter((l): l is string => !!l).join(' ').toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 3 && !['photography', 'session', 'sessions', 'photos', 'photo', 'work', 'project'].includes(w)).map(stem)
  if (!words.length) return null
  let best: { s: ServiceLike; score: number } | null = null
  for (const s of SERVICES as ServiceLike[]) {
    const nameWords = serviceName(s).toLowerCase().split(/[^a-z]+/).filter(Boolean).map(stem)
    const score = words.filter((w) => nameWords.includes(w)).length
    if (!score) continue
    if (!best || score > best.score || (score === best.score && serviceName(s).length < serviceName(best.s).length)) best = { s, score }
  }
  return best?.s ?? null
}

/** The service page a portfolio card belongs to (see serviceFor), or null. */
export function serviceHrefFor(...labels: Array<string | undefined | null>): string | null {
  const hit = serviceFor(...labels)
  return hit ? `/services/${hit.slug}` : null
}

/** A service by its slug (the owner's card<N>Service setting), or null. */
export function serviceBySlug(slug: string | undefined | null): ServiceLike | null {
  if (!slug) return null
  const s = slug.trim().replace(/^\/?services\//, '').replace(/\/$/, '')
  return (SERVICES as ServiceLike[]).find((x) => x.slug === s) ?? null
}

/**
 * A portfolio card's title and page. The owner's setting first (card<N>Title, card<N>Service); else the card is titled
 * by the service it matches and opens that service's page; else by its own category. A card that matches no service
 * and carries no category has no title of its own (a gallery or site title is never a card's title) → null, the card is
 * left out.
 */
export function portfolioCard(p: GalleryItem, owner?: { title?: string; service?: string }): { title: string; href: string | null } | null {
  const chosen = serviceBySlug(owner?.service)
  const matched = chosen ?? serviceFor(p.title, projectCategory(p))
  const title = owner?.title?.trim() || (matched ? serviceName(matched) : projectCategory(p))
  if (!title) return null
  return { title, href: matched ? `/services/${matched.slug}` : galleryPageHref() }
}
