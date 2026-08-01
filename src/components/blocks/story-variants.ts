import { StoryNarrativeBlock } from './StoryNarrativeBlock'
import { StorySplitImageBlock } from './StorySplitImageBlock'
import { StoryStatBandBlock } from './StoryStatBandBlock'
import { StoryMilestoneTimelineBlock } from './StoryMilestoneTimelineBlock'
import { StoryEditorialFrameBlock } from './StoryEditorialFrameBlock'
import { StoryManifestoGlowBlock } from './StoryManifestoGlowBlock'

// Per-type variant map for the about/story section (additive, like HERO_VARIANTS),
// narrative as the default fallback. narrative + split-image render from
// SITE.about (present on any build); stat-band + milestone-timeline are
// omit-when-absent (optional SITE.stats / SITE.milestones via cast).
export const STORY_VARIANTS: Record<string, typeof StoryNarrativeBlock> = {
  narrative: StoryNarrativeBlock,
  'split-image': StorySplitImageBlock,
  'stat-band': StoryStatBandBlock,
  'milestone-timeline': StoryMilestoneTimelineBlock,
  // WOW Stage 2 (brand-reactive + motion): editorial framed split, centered manifesto.
  'editorial-frame': StoryEditorialFrameBlock,
  'manifesto-glow': StoryManifestoGlowBlock,
}
