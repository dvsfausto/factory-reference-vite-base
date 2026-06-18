import { CaseStudiesFeaturedBlock } from './CaseStudiesFeaturedBlock'
import { CaseStudiesGridBlock } from './CaseStudiesGridBlock'
import { CaseStudiesAlternatingRowsBlock } from './CaseStudiesAlternatingRowsBlock'
import { CaseStudiesCarouselBlock } from './CaseStudiesCarouselBlock'
import { CaseStudiesListBlock } from './CaseStudiesListBlock'

// One case study — a narrative outcome. OPTIONAL data (read from SITE.caseStudies
// via cast — never on the emitted SITE literal), so a site with no case studies
// renders nothing and stays byte-identical. Distinct from the gallery (photos):
// this is title + summary + a real outcome. title/summary required; image, result
// (a real measured outcome — NEVER invented), and client are optional with
// graceful fallbacks.
export interface CaseStudy {
  title: string
  summary: string
  image?: string
  result?: string
  client?: string
}

// Per-type variant map (additive, like HERO_VARIANTS), featured default.
export const CASE_STUDIES_VARIANTS: Record<string, typeof CaseStudiesFeaturedBlock> = {
  featured: CaseStudiesFeaturedBlock,
  grid: CaseStudiesGridBlock,
  'alternating-rows': CaseStudiesAlternatingRowsBlock,
  carousel: CaseStudiesCarouselBlock,
  list: CaseStudiesListBlock,
}
