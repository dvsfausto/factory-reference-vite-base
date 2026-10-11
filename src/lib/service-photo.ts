import { serviceImageUrl } from '~/data/images'

// ★ A SERVICE WITH NO PHOTO HAS A DESIGNED LAYOUT, NOT A BROKEN FRAME (ZB-241, 2026-10-11). The owner can take a service's
// photo off ("" in SERVICE_IMAGES, the factory's emitted helper then answers "" for its URL). Nathalie's site surfaced the
// gap: the alternating rows, the index and the banner hero handled it, nine other service layouts and four service-page
// heroes drew <img src=""> (a broken picture, or the alt text sitting in a frame). Every layout asks this one question and
// lets the words take the row: no frame, no gap. The helper lives here, not in src/data/images.ts, because that file is
// replaced by the factory on every build.
export function hasServicePhoto(slug: string): boolean {
  return serviceImageUrl(slug) !== ''
}
