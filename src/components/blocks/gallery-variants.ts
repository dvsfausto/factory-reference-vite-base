import { GalleryMasonryBlock } from './GalleryMasonryBlock'
import { GalleryGridBlock } from './GalleryGridBlock'
import { GalleryBeforeAfterBlock } from './GalleryBeforeAfterBlock'
import { GalleryCarouselBlock } from './GalleryCarouselBlock'
import { GalleryFeaturedThumbsBlock } from './GalleryFeaturedThumbsBlock'
import { GalleryJustifiedBlock } from './GalleryJustifiedBlock'

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
}
