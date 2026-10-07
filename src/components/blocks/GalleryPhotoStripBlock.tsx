import { useState } from 'react'
import { PROJECTS } from '~/data/projects'
import { SERVICES } from '~/data/services-view'
import { SERVICE_IMAGES, ownerServiceImageUrl, serviceImageFocus, serviceImageUrl } from '~/data/images'
import { SITE } from '~/data/site'
import type { ServicePageData } from '~/lib/types/page-types'
import { imageSrc } from '~/lib/asset-url'
import { faceSafeStyle } from '~/lib/editorial-media'
import { isOwnerUpload, ownerPhotos } from '~/lib/owner-photos'

// Gallery VARIANT: 'photo-strip' (the Editorial look, ZB-147 W1.2). Edge to edge, no container: five square photos in
// a row on desktop with 2px gaps; on a phone the same photos as a horizontal scroll-snap strip, two per screen (48vw),
// working with CSS alone. On a service page (the renderer passes ctx.service) the service's own photo leads and
// PROJECTS fill the rest; on the homepage PROJECTS alone. No photo → nothing.
//
// ★ MARQUEE (the owner's setting, ZB-147): SITE.photoStrip = { motion: 'marquee', rows: 1..3, speed: 'slow' | 'medium' | 'fast' }
// (content keys site.photoStripMotion / site.photoStripRows / site.photoStripSpeed). Each row is one seamless loop (the
// sequence twice, translated by half), rows alternate direction (1 left, 2 right, 3 left), slow by default; it pauses on
// hover and while a finger is on it; a device asking for reduced motion gets a still strip; boxes have a fixed size, so
// nothing shifts; images lazy, face-safe. The photos are the business's REAL ones first: this service's own photo, the
// other services' own photos, the owner's gallery; stock only when there is no real photo at all. Unset → the strip above,
// byte-identical.
//
// TOKEN DISCIPLINE: fam-* grounds only; rhythm py-band; photos through imageSrc(), lazy, face-safe crop.
type Photo = { src: string; alt: string; focus: string | null }
type StripSetting = { motion?: string; rows?: number | string; speed?: string }


export function GalleryPhotoStripBlock({
  projects = PROJECTS,
  service,
  motion,
  ownerBuilt = false,
}: {
  projects?: typeof PROJECTS
  /** the page's gallery is the owner's own list (render-section): the strip shows exactly those photos, in order */
  ownerBuilt?: boolean
  label?: string
  heading?: string
  body?: string
  /** the service whose page this strip sits on (renderer-supplied); absent on the homepage */
  service?: ServicePageData
  /** a page's own choice (its gallery layout): marquee or still, over the site setting */
  motion?: 'marquee' | 'still'
}) {
  const [paused, setPaused] = useState(false)
  const setting = (SITE as { photoStrip?: StripSetting }).photoStrip
  const marquee = motion ? motion === 'marquee' : setting?.motion === 'marquee'

  // ★ an OWNER-BUILT gallery: exactly the owner's photos in the owner's order, nothing led in, nothing filled from elsewhere
  const ownPhotos: Photo[] = ownerBuilt ? projects.map((p) => ({ src: imageSrc(p.image), alt: p.alt ?? p.title, focus: null })) : []

  if (!marquee) {
    const photos: Photo[] = ownPhotos
    if (!ownerBuilt && service && SERVICE_IMAGES[service.slug]) {
      const ref = SERVICES.find((s) => s.slug === service.slug)
      photos.push({ src: serviceImageUrl(service.slug), alt: ref?.name ?? service.hero.h1, focus: serviceImageFocus(service.slug) })
    }
    if (!ownerBuilt) for (const p of projects) {
      const src = imageSrc(p.image)
      if (photos.some((x) => x.src === src)) continue
      photos.push({ src, alt: p.alt ?? p.title, focus: null })
      if (photos.length === 5) break
    }
    if (photos.length === 0) return null
    return (
      <section className="bg-fam-page py-band">
        <ul className="flex snap-x snap-mandatory gap-[2px] overflow-x-auto [scrollbar-width:none] md:grid md:grid-cols-5 md:overflow-visible">
          {photos.map((ph, i) => (
            <li key={`${ph.src}-${i}`} className="aspect-square w-[48vw] shrink-0 snap-start overflow-hidden bg-fam-surface-2 md:w-auto">
              <img src={ph.src} alt={ph.alt} loading="lazy" style={faceSafeStyle(ph.focus)} className="h-full w-full object-cover" />
            </li>
          ))}
        </ul>
      </section>
    )
  }

  // the real photos first (lib/owner-photos: this service's own, the other services' own, the owner's gallery); stock only when none is real
  const real: Photo[] = ownerPhotos(service?.slug)
  const stock: Photo[] = []
  for (const p of projects) { const src = imageSrc(p.image); if (!isOwnerUpload(src) && !stock.some((x) => x.src === src)) stock.push({ src, alt: p.alt ?? p.title, focus: null }) }
  if (service && SERVICE_IMAGES[service.slug] && !ownerServiceImageUrl(service.slug)) stock.unshift({ src: serviceImageUrl(service.slug), alt: service.hero.h1, focus: serviceImageFocus(service.slug) })
  const photos = ownerBuilt ? ownPhotos : real.length ? real : stock
  if (photos.length === 0) return null

  const rows = Math.min(3, Math.max(1, Number(setting?.rows) || 1))
  // the speed is pixels per second on a desktop box (220 px + 2 px gap): slow 60, medium 100, fast 160; a phone's smaller boxes move proportionally slower
  const pxPerSecond = setting?.speed === 'fast' ? 160 : setting?.speed === 'medium' ? 100 : 60
  // ★ NO PHOTO TWICE AT ONCE (Fausto, 2026-10-07): with enough photos each row gets its OWN disjoint set, so a photo is never
  // in two rows; a row's sequence is at least six long (the widest screen shows about six boxes), so within a row the same
  // photo cannot be on screen twice either. Too few photos for disjoint rows → the rows share the list, offset by a third.
  const perRowMin = 6
  const disjoint = photos.length >= rows * Math.min(perRowMin, Math.max(3, Math.floor(photos.length / rows)))
  const rowItems = (r: number): Photo[] => {
    if (disjoint) {
      const size = Math.floor(photos.length / rows)
      const slice = photos.slice(r * size, r === rows - 1 ? photos.length : (r + 1) * size)
      // a short slice repeats itself to reach six boxes (the repeat sits a whole slice apart, never side by side on screen for slices of 3+)
      const out: Photo[] = []
      while (out.length < Math.max(perRowMin, slice.length)) out.push(...slice)
      return out
    }
    const perRow = Math.max(8, photos.length)
    return Array.from({ length: perRow }, (_, i) => photos[(i + r * Math.ceil(photos.length / rows)) % photos.length]!)
  }

  return (
    <section
      className="bg-fam-page py-band"
      data-photo-strip="marquee"
      data-paused={paused ? '' : undefined}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      onTouchCancel={() => setPaused(false)}
    >
      <div className="flex flex-col gap-[2px] overflow-hidden">
        {Array.from({ length: rows }, (_, r) => {
          const items = rowItems(r)
          return (
            // the loop's duration grows with the row's length, so every row moves at the same pixel speed whatever it holds
            <div key={r} className="strip-row" data-dir={r % 2 === 1 ? 'right' : 'left'} style={{ ['--strip-dur' as string]: `${Math.max(10, Math.round((items.length * 222) / pxPerSecond))}s` }}>
              <ul className="strip-track flex w-max gap-[2px]" aria-hidden={r > 0 ? true : undefined}>
                {[...items, ...items].map((ph, i) => (
                  <li key={`${ph.src}-${i}`} className="h-[32vw] w-[32vw] shrink-0 overflow-hidden bg-fam-surface-2 sm:h-[220px] sm:w-[220px]">
                    <img src={ph.src} alt={i < items.length ? ph.alt : ''} loading="lazy" width={220} height={220} style={faceSafeStyle(ph.focus)} className="h-full w-full object-cover" />
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}
