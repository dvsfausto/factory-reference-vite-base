// Type surface of the per-page copy modules served by scripts/prune-variants.mjs (split-page-data). Each is the
// heavy `export const …Data` declaration of the emitted data file, moved to its own module at serve/build time.
declare module 'virtual:zmode-page-data/servicesData' {
  import type { ServicePageData } from '~/lib/types/page-types'
  export const servicesData: Record<string, ServicePageData>
}
declare module 'virtual:zmode-page-data/infoPagesData' {
  import type { InfoPageData } from '~/lib/types/page-types'
  export const infoPagesData: Record<string, InfoPageData>
}
declare module 'virtual:zmode-page-data/serviceAreasData' {
  import type { ServiceAreaPageData } from '~/lib/types/page-types'
  export const serviceAreasData: Record<string, ServiceAreaPageData>
}
