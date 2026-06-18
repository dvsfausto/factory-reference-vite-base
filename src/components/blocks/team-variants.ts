import { TeamGridBlock } from './TeamGridBlock'
import { TeamSpotlightBlock } from './TeamSpotlightBlock'

// The shape of one team member. OPTIONAL data: read from SITE.team via cast in the
// team blocks (never declared on the emitted SITE literal), so existing sites with
// no team render nothing and stay byte-identical. name is the only required field;
// role / photo / bio are optional with graceful fallbacks in the components.
export interface TeamMember {
  name: string
  role?: string
  photo?: string
  bio?: string
}

// Per-type variant map for the team section (same additive pattern as
// HERO_VARIANTS / SERVICES_VARIANTS etc.): block.variant -> component, with the
// grid layout as the default fallback. Shared by the homepage renderBlock and the
// about-page composition so neither route imports from the other.
export const TEAM_VARIANTS: Record<string, typeof TeamGridBlock> = {
  grid: TeamGridBlock,
  spotlight: TeamSpotlightBlock,
}
