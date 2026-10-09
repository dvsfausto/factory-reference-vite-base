import { PROJECTS } from '~/data/projects'
import { SERVICES } from '~/data/services-view'
import { ownerServiceImageUrl, serviceImageFocus } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'

/* ★ THE BUSINESS'S REAL PHOTOS (ZB-147): the owner's own service photos and the owner's gallery uploads, never stock.
   Used wherever a block wants real pictures first (the photo strip marquee, the reviews page rails). Empty when the
   business has none: the caller decides what that means (nothing, or the stock it already shows). */
export type OwnerPhoto = { src: string; alt: string; focus: string | null }

export const isOwnerUpload = (src: string) => /\/public-assets\//.test(src) || /\/business-logos\//.test(src)

export function ownerPhotos(leadServiceSlug?: string | null): OwnerPhoto[] {
  const out: OwnerPhoto[] = []
  const push = (ph: OwnerPhoto) => { if (!out.some((x) => x.src === ph.src)) out.push(ph) }
  if (leadServiceSlug) { const u = ownerServiceImageUrl(leadServiceSlug); const s = SERVICES.find((x) => x.slug === leadServiceSlug); if (u) push({ src: u, alt: s?.name ?? '', focus: serviceImageFocus(leadServiceSlug) }) }
  for (const s of SERVICES) { if (s.slug === leadServiceSlug) continue; const u = ownerServiceImageUrl(s.slug); if (u) push({ src: u, alt: s.name, focus: serviceImageFocus(s.slug) }) }
  for (const p of PROJECTS) { const src = imageSrc(p.image); const c = (p as { category?: string }).category; if (isOwnerUpload(src)) push({ src, alt: c && c.toLowerCase() !== 'gallery' ? c : (p.alt ?? p.title), focus: null }) }
  return out
}
