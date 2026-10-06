import { GalleryMasonryBlock } from './GalleryMasonryBlock'
import { GalleryGridBlock } from './GalleryGridBlock'
import { GalleryBeforeAfterBlock } from './GalleryBeforeAfterBlock'
import { GalleryCarouselBlock } from './GalleryCarouselBlock'
import { GalleryFeaturedThumbsBlock } from './GalleryFeaturedThumbsBlock'
import { GalleryJustifiedBlock } from './GalleryJustifiedBlock'
import { GalleryCinematicMasonryBlock } from './GalleryCinematicMasonryBlock'
import { GalleryFeaturedFilmBlock } from './GalleryFeaturedFilmBlock'
import { GalleryEdgeGridBlock } from './GalleryEdgeGridBlock'
import { GalleryPortfolioGridBlock } from './GalleryPortfolioGridBlock'
import { GalleryPhotoStripBlock } from './GalleryPhotoStripBlock'
import type { ComponentProps, ComponentType } from 'react'
import type { ServicePageData } from '~/lib/types/page-types'

// Per-type variant map for the gallery/portfolio section (additive, like
// HERO_VARIANTS). PIPELINE-SEEDED data model: every variant reads the PROJECTS
// data field (src/data/projects.ts), seeded now and customer-replaced later, so
// the gallery renders populated rather than omitting when empty.
// The renderer also hands every variant the page's service (ctx.service) when there is one; a variant that reads
// it (the Editorial photo strip) leads with that service's photo, the others ignore the prop.
export const GALLERY_VARIANTS: Record<string, ComponentType<ComponentProps<typeof GalleryMasonryBlock> & { service?: ServicePageData }>> = {
  masonry: GalleryMasonryBlock,
  grid: GalleryGridBlock,
  'before-after-slider': GalleryBeforeAfterBlock,
  carousel: GalleryCarouselBlock,
  'featured-thumbs': GalleryFeaturedThumbsBlock,
  justified: GalleryJustifiedBlock,
  // WOW Stage 2 (brand-reactive + motion): cinematic masonry, featured filmstrip, edge-to-edge grid.
  'cinematic-masonry': GalleryCinematicMasonryBlock,
  'featured-film': GalleryFeaturedFilmBlock,
  'edge-grid': GalleryEdgeGridBlock,
  // The Editorial look (ZB-147 W1.2): three tall portfolio cards; an edge-to-edge five-photo strip.
  'portfolio-grid': GalleryPortfolioGridBlock,
  'photo-strip': GalleryPhotoStripBlock,
}
