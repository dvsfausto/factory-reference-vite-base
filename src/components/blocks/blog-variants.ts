import { BlogCardGridBlock } from './BlogCardGridBlock'
import { BlogListBlock } from './BlogListBlock'
import { BlogFeaturedListBlock } from './BlogFeaturedListBlock'

// One blog post (index entry — this is a section/index, NOT an article page).
// OPTIONAL data (read from SITE.posts via cast — never on the emitted SITE
// literal), so a site with no posts renders nothing and stays byte-identical.
// title + href required; excerpt, date, image optional with graceful fallbacks.
export interface BlogPost {
  title: string
  excerpt?: string
  date?: string
  image?: string
  href: string
}

// Per-type variant map (additive, like HERO_VARIANTS), card-grid default.
export const BLOG_VARIANTS: Record<string, typeof BlogCardGridBlock> = {
  'card-grid': BlogCardGridBlock,
  list: BlogListBlock,
  'featured+list': BlogFeaturedListBlock,
}
