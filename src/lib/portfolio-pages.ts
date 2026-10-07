import { PROJECTS } from '~/data/projects'
import { SERVICES } from '~/data/services-view'
import { customPagesData } from '~/data/custom-pages'
import { ownerServiceImageUrl, serviceImageFocus } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'
import { projectCategory } from '~/lib/editorial-media'

/* ★ THE PORTFOLIO WALL'S PHOTOS, ONE RULE (ZB-147): the owner's photos TAGGED with the page's kind of work (their job:<Category>
   tag; the generic 'gallery' tag names none; a caption is never a tag) plus the named services' own photos; with no category
   and no services, every real photo. The wall block draws them; the header counts them for the menu rule below. */
export type WallPhoto = { src: string; alt: string; focus: string | null }
const stem = (w: string) => w.toLowerCase().replace(/(ies|s)$/, (m) => (m === 'ies' ? 'y' : ''))
const words = (s: string) => s.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 2).map(stem)
export const sameCategory = (a: string, b: string) => { const wa = words(a), wb = words(b); return wa.some((w) => wb.includes(w)) }

export function wallPhotos(params: { category?: string; services?: string[] }, projects = PROJECTS): WallPhoto[] {
  const out: WallPhoto[] = []
  const push = (ph: WallPhoto) => { if (!out.some((x) => x.src === ph.src)) out.push(ph) }
  const { category, services = [] } = params
  if (category) for (const p of projects) { const c = projectCategory(p); if (c && c.toLowerCase() !== 'gallery' && sameCategory(c, category)) push({ src: imageSrc(p.image), alt: p.alt ?? p.title, focus: null }) }
  for (const slug of services) { const own = ownerServiceImageUrl(slug); if (own) push({ src: own, alt: SERVICES.find((x) => x.slug === slug)?.name ?? '', focus: serviceImageFocus(slug) }) }
  if (!category && services.length === 0) {
    for (const s of SERVICES) { const u = ownerServiceImageUrl(s.slug); if (u) push({ src: u, alt: s.name, focus: serviceImageFocus(s.slug) }) }
    for (const p of projects) { const src = imageSrc(p.image); if (/\/public-assets\//.test(src)) push({ src, alt: p.alt ?? p.title, focus: null }) }
  }
  return out
}

/** ★ THE MENU RULE (Fausto, 2026-10-07): a portfolio page earns its menu link with at least this many photos. */
export const PORTFOLIO_MENU_MIN_PHOTOS = 8

const wallParamsOf = (slug: string): { category?: string; services?: string[] } | null => {
  const page = customPagesData[slug]
  const block = page?.layout?.find((b) => b.type === 'gallery' && (b as { variant?: string }).variant === 'portfolio-wall') as { params?: { category?: unknown; services?: unknown } } | undefined
  if (!block) return null
  const p = block.params ?? {}
  const services = Array.isArray(p.services) ? (p.services as unknown[]).filter((x): x is string => typeof x === 'string') : typeof p.services === 'string' ? p.services.split(',').map((x) => x.trim()).filter(Boolean) : []
  return { category: typeof p.category === 'string' ? p.category : undefined, services }
}

/**
 * Where a menu link to a portfolio page should really go: the page itself once it holds enough photos, else the first service
 * named for it (its service page), so a visitor never lands on a near-empty wall. The page keeps existing at its address.
 * A link to anything but a thin portfolio page is returned unchanged.
 */
export function portfolioMenuHref(href: string): string {
  const slug = href.replace(/^\//, '').replace(/[?#].*$/, '')
  if (!slug || slug.includes('/')) return href
  const params = wallParamsOf(slug)
  if (!params) return href
  if (wallPhotos(params).length >= PORTFOLIO_MENU_MIN_PHOTOS) return href
  const first = params.services?.find((s) => SERVICES.some((x) => x.slug === s))
  return first ? `/services/${first}` : href
}
