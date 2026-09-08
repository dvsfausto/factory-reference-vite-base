import { MenuListBlock } from './MenuListBlock'

// Per-type variant map (additive, like HERO_VARIANTS). One composition today: the leader list.
// Listed in the editor's manifest so the block is swappable the day a second one exists (niche arc Stage 4).
export const MENU_VARIANTS: Record<string, typeof MenuListBlock> = {
  list: MenuListBlock,
}
