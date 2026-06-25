import { VideoTestimonialsGridBlock } from './VideoTestimonialsGridBlock'
import { VideoTestimonialsFeaturedThumbsBlock } from './VideoTestimonialsFeaturedThumbsBlock'
import { VideoTestimonialsCarouselBlock } from './VideoTestimonialsCarouselBlock'
import { VideoTestimonialsSpotlightBlock } from './VideoTestimonialsSpotlightBlock'

// One video testimonial. OPTIONAL data (read from SITE.videoTestimonials via cast
// — never on the emitted SITE literal), so a site with none renders nothing and
// stays byte-identical. videoUrl + author required; poster is optional with a
// graceful fallback (a neutral panel when absent — mirrors the hero video_url
// poster pattern); quote optional.
export interface VideoTestimonial {
  videoUrl: string
  poster?: string
  author: string
  quote?: string
}

// Per-type variant map (additive, like HERO_VARIANTS), grid default.
export const VIDEO_TESTIMONIALS_VARIANTS: Record<string, typeof VideoTestimonialsGridBlock> = {
  grid: VideoTestimonialsGridBlock,
  'featured-thumbs': VideoTestimonialsFeaturedThumbsBlock,
  carousel: VideoTestimonialsCarouselBlock,
  spotlight: VideoTestimonialsSpotlightBlock,
}
