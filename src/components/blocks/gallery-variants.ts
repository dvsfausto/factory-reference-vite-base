import { GalleryMasonryBlock } from './GalleryMasonryBlock'
import { GalleryGridBlock } from './GalleryGridBlock'
import { GalleryBeforeAfterBlock } from './GalleryBeforeAfterBlock'
import { GalleryCarouselBlock } from './GalleryCarouselBlock'
import { GalleryFeaturedThumbsBlock } from './GalleryFeaturedThumbsBlock'
import { GalleryJustifiedBlock } from './GalleryJustifiedBlock'
import { GalleryCinematicMasonryBlock } from './GalleryCinematicMasonryBlock'
import { GalleryFeaturedFilmBlock } from './GalleryFeaturedFilmBlock'
import { GalleryEdgeGridBlock } from './GalleryEdgeGridBlock'

// Per-type variant map for the gallery/portfolio section (additive, like
// HERO_VARIANTS). PIPELINE-SEEDED data model: every variant reads the PROJECTS
// data field (src/data/projects.ts), seeded now and customer-replaced later, so
// the gallery renders populated rather than omitting when empty.
export const GALLERY_VARIANTS: Record<string, typeof GalleryMasonryBlock> = {
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
}
