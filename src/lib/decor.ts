// A decoration comes from the family or the vertical, or it does not exist (2026-09-09).
// The ONLY importer of ~/assets/decorative/*: shared components ask siteDecor() and render nothing when it is
// undefined. The scaffolder emits SITE.decorAsset from the VERTICAL that owns the motif (cleaning → its leaves);
// a wave-built dentist, accountant or SaaS site has none. lint:decor keeps every other import out.
import { SITE } from '~/data/site'
import cleaningLeaves from '~/assets/decorative/cleaning-leaves.png'

const DECOR: Record<string, string> = {
  'cleaning-leaves': cleaningLeaves,
}

/** The site's decorative asset URL, or undefined when its vertical/family supplies none. */
export function siteDecor(): string | undefined {
  const key = (SITE as { decorAsset?: string }).decorAsset
  return key ? DECOR[key] : undefined
}
