import { SITE } from '~/data/site'
import { INFO_PAGES } from '~/data/info-pages'
import { tr } from '~/lib/i18n'
import type { ProcessStep } from '~/components/blocks/process-variants'

/* ★ SERVICE PAGES BUILT AROUND PHOTOS (ZB-147 Stage B, Fausto 2026-10-07). SITE.servicePages = 'visual' | 'full' (the
   factory decides from site.servicePages, else the trade). On a visual page the long prose lives on one post per service
   (/info/<service>-guide, emitted by the factory); the page shows one paragraph, the gallery, how to book, two reviews. */
export const VISUAL_SERVICE_PAGES = (SITE as { servicePages?: string }).servicePages === 'visual'

/** The service's guide post, when the build emitted one. */
export function guideHrefFor(serviceSlug: string): string | null {
  const slug = `${serviceSlug}-guide`
  return INFO_PAGES.some((p) => p.slug === slug) ? `/info/${slug}` : null
}

/** "How to book" in three steps when the business set no steps of its own: by booking mode, in the site's language. */
export function defaultBookingSteps(): ProcessStep[] {
  const request = (SITE as { bookingMode?: string }).bookingMode === 'request'
  const keys = request
    ? ([['process.request1.title', 'process.request1.body'], ['process.request2.title', 'process.request2.body'], ['process.request3.title', 'process.request3.body']] as const)
    : ([['process.book1.title', 'process.book1.body'], ['process.book2.title', 'process.book2.body'], ['process.book3.title', 'process.book3.body']] as const)
  return keys.map(([t, b]) => ({ title: tr(t), description: tr(b) }))
}
