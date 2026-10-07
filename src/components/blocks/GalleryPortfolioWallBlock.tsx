import { PROJECTS } from '~/data/projects'
import { tr } from '~/lib/i18n'
import { imageSrc } from '~/lib/asset-url'
import { faceSafeStyle, projectCategory } from '~/lib/editorial-media'
import { SERVICES } from '~/data/services-view'
import { ownerServiceImageUrl, serviceImageFocus } from '~/data/images'
import { ownerPhotos } from '~/lib/owner-photos'
import { EditorialHeading, Kicker } from '~/components/editorial/Primitives'
import { Lightbox, useLightbox } from '~/components/editorial/Lightbox'

// Gallery VARIANT: 'portfolio-wall' (ZB-147, Karli's top priority): a large grid of the business's REAL photos for one kind of
// work, lazy, face-safe, a lightbox on tap. Which photos: the owner's photos tagged with the page's `category` (the owner's
// word for it, matched by stemmed words, so "Weddings" finds "wedding"), plus the owner's own photos of the services named in
// `services` (slugs), plus, with no category and no services, every real photo. Stock never. No photo → nothing.
//
// TOKEN DISCIPLINE: fam-* grounds only; rhythm py-section.
const stem = (w: string) => w.toLowerCase().replace(/(ies|s)$/, (m) => (m === 'ies' ? 'y' : ''))
const words = (s: string) => s.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 2).map(stem)
const sameCategory = (a: string, b: string) => { const wa = words(a), wb = words(b); return wa.some((w) => wb.includes(w)) }

export function GalleryPortfolioWallBlock({
  projects = PROJECTS,
  label,
  heading,
  body,
  category,
  services = [],
}: {
  projects?: typeof PROJECTS
  label?: string
  heading?: string
  body?: string
  /** the kind of work this wall shows (the owner's word, matched by stemmed words against each photo's category) */
  category?: string
  /** service slugs whose own photos belong on this wall too */
  services?: string[]
}) {
  type Photo = { src: string; alt: string; focus: string | null }
  const photos: Photo[] = []
  const push = (ph: Photo) => { if (!photos.some((x) => x.src === ph.src)) photos.push(ph) }
  if (category) {
    for (const p of projects) { const c = projectCategory(p); if (c && sameCategory(c, category)) push({ src: imageSrc(p.image), alt: p.alt ?? p.title, focus: null }) }
    // a photo whose own title names the kind of work counts too ("Wedding photography")
    for (const p of projects) { if (!projectCategory(p) && sameCategory(p.title, category)) push({ src: imageSrc(p.image), alt: p.alt ?? p.title, focus: null }) }
  }
  for (const slug of services) { const own = ownerServiceImageUrl(slug); if (own) push({ src: own, alt: SERVICES.find((x) => x.slug === slug)?.name ?? '', focus: serviceImageFocus(slug) }) }
  if (!category && services.length === 0) for (const ph of ownerPhotos()) push(ph)
  if (photos.length === 0) return null
  const lb = useLightbox(photos)
  return (
    <section className="bg-fam-page" data-portfolio-wall={category ?? 'all'}>
      <div className="container-x py-section">
        {(label || heading) && (
          <div className="max-w-3xl">
            {label && <Kicker>{label}</Kicker>}
            {heading && <EditorialHeading as="h1" text={heading} size="lg" className="mt-5" />}
            {body && <p className="mt-5 max-w-[34rem] font-sans text-[17px] leading-relaxed text-fam-ink-muted">{body}</p>}
          </div>
        )}
        <ul className={`${label || heading ? 'mt-12' : ''} grid grid-cols-2 gap-[2px] md:grid-cols-3 lg:grid-cols-4`}>
          {photos.map((ph, i) => (
            <li key={ph.src} className="aspect-[4/5] overflow-hidden bg-fam-surface-2">
              <button type="button" onClick={() => lb.open(i)} aria-label={`${tr('editorial.openPhoto')}: ${ph.alt}`} className="group block h-full w-full">
                <img src={ph.src} alt={ph.alt} loading="lazy" width={480} height={600} style={faceSafeStyle(ph.focus)} className="h-full w-full object-cover transition-transform duration-(--motion-slow) group-hover:scale-(--hov-zoom)" />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <Lightbox photos={photos} index={lb.index} onClose={lb.close} onStep={lb.step} closeLabel={tr('editorial.close')} prevLabel={tr('editorial.previous')} nextLabel={tr('editorial.next')} />
    </section>
  )
}
