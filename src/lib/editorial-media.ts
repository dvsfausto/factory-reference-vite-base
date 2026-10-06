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

/** The service page a portfolio card belongs to: the service whose name shares a word with the card's title or category ("Wedding photography" → /services/wedding). */
export function serviceHrefFor(...labels: Array<string | undefined | null>): string | null {
  const words = labels.filter((l): l is string => !!l).join(' ').toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 3 && !['photography', 'session', 'sessions', 'photos', 'photo', 'work'].includes(w))
  if (!words.length) return null
  const hit = SERVICES.find((s) => { const name = String((s as { displayName?: string; name?: string }).displayName ?? (s as { name?: string }).name ?? '').toLowerCase(); return words.some((w) => name.includes(w)) })
  return hit ? `/services/${(hit as { slug: string }).slug}` : null
}
