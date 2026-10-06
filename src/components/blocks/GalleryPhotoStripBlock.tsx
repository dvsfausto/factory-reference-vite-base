import { PROJECTS } from '~/data/projects'
import { SERVICES } from '~/data/services-view'
import { SERVICE_IMAGES, serviceImageFocus, serviceImageUrl } from '~/data/images'
import type { ServicePageData } from '~/lib/types/page-types'
import { imageSrc } from '~/lib/asset-url'
import { faceSafeStyle } from '~/lib/editorial-media'

// Gallery VARIANT: 'photo-strip' (the Editorial look, ZB-147 W1.2). Edge to edge, no container: five square photos in
// a row on desktop with 2px gaps; on a phone the same photos as a horizontal scroll-snap strip, two per screen (48vw),
// working with CSS alone. On a service page (the renderer passes ctx.service) the service's own photo leads and
// PROJECTS fill the rest; on the homepage PROJECTS alone. No photo → nothing.
//
// TOKEN DISCIPLINE: fam-* grounds only; rhythm py-band; photos through imageSrc(), lazy, face-safe crop.
type Photo = { src: string; alt: string; focus: string | null }

export function GalleryPhotoStripBlock({
  projects = PROJECTS,
  service,
}: {
  projects?: typeof PROJECTS
  label?: string
  heading?: string
  body?: string
  /** the service whose page this strip sits on (renderer-supplied); absent on the homepage */
  service?: ServicePageData
}) {
  const photos: Photo[] = []
  if (service && SERVICE_IMAGES[service.slug]) {
    const ref = SERVICES.find((s) => s.slug === service.slug)
    photos.push({ src: serviceImageUrl(service.slug), alt: ref?.name ?? service.hero.h1, focus: serviceImageFocus(service.slug) })
  }
  for (const p of projects) {
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
