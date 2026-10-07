import { GALLERIES } from '~/data/galleries'
import { PROJECTS, type GalleryItem } from '~/data/projects'
import type { PageGallery, ServicePageData } from '~/lib/types/page-types'
import { wallPhotos } from '~/lib/portfolio-pages'
import { customPagesData } from '~/data/custom-pages'

/* ★ EVERY PAGE HAS ITS OWN GALLERY (Fausto, 2026-10-07). The owner builds it by asking or in the dashboard: photos in order, a
   cover, a layout (grid, masonry, strip, marquee), shown or hidden. It is stored per page key in design_dna.galleries and emitted
   here; a rebuild never overwrites it. When the owner has not touched a page's gallery, it fills from the page's kind of work
   (the portfolio page's category, the service's own photos) so nothing is empty on day one. A photo may sit in several galleries;
   removing it from one page touches nothing else. */
export type PageKey = string // 'home' | 'about' | `service:${slug}` | `page:${slug}`

export function pageKeyOf(ctx?: { service?: ServicePageData; page?: string; intro?: unknown } | null): PageKey {
  if (ctx?.service?.slug) return `service:${ctx.service.slug}`
  if (ctx?.page) return `page:${ctx.page}`
  if (ctx?.intro) return 'about'
  return 'home'
}

const fileNameOf = (url: string): string => url.replace(/[?#].*$/, '').split('/').pop() ?? url

export function ownerGallery(key: PageKey): PageGallery | null {
  const g = GALLERIES[key]
  return g && Array.isArray(g.photos) ? g : null
}

/** The layout → gallery variant id the renderer uses. */
export const LAYOUT_VARIANT: Record<string, string> = { grid: 'grid', masonry: 'masonry', strip: 'photo-strip', marquee: 'photo-strip', wall: 'portfolio-wall' }

/**
 * The photos a page's gallery shows: the owner's own list when they built one (cover first), else the page's default
 * (a portfolio page's wall photos; a service page's own photo and the gallery; the home's PROJECTS).
 */
export function galleryItemsFor(key: PageKey, ctx?: { service?: ServicePageData; page?: string } | null): GalleryItem[] {
  const own = ownerGallery(key)
  if (own) {
    // a photo named by its address keeps what the library knows about it (its category, caption, alt): the cards and the
    // walls caption by category, so an owner-built gallery must not turn every photo into a nameless one
    const byUrl = new Map<string, GalleryItem>()
    for (const p of PROJECTS) { byUrl.set(p.image, p); byUrl.set(fileNameOf(p.image), p) }
    const known = (url: string): GalleryItem | undefined => byUrl.get(url) ?? byUrl.get(fileNameOf(url))
    const items = own.photos.map((p) => {
      if (typeof p === 'string') { const k = known(p); return k ? { ...k, image: p } : { title: '', image: p } }
      const k = known(p.url)
      return { title: p.title ?? k?.title ?? '', image: p.url, alt: p.alt ?? k?.alt, category: p.category ?? k?.category, caption: k?.caption }
    }) as GalleryItem[]
    if (own.cover) { const i = items.findIndex((x) => x.image === own.cover); if (i > 0) items.unshift(...items.splice(i, 1)) }
    return items
  }
  if (ctx?.page && customPagesData[ctx.page]) {
    const block = customPagesData[ctx.page]?.layout?.find((b) => b.type === 'gallery') as { params?: { category?: string; services?: string[] } } | undefined
    if (block?.params && (block.params.category || block.params.services?.length)) return wallPhotos({ category: block.params.category, services: block.params.services }).map((ph) => ({ title: ph.alt, image: ph.src, alt: ph.alt }))
  }
  return PROJECTS
}
