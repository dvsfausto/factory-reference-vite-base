import { ProductGridBlock } from './ProductGridBlock'

// Per-type variant map (additive, like HERO_VARIANTS). One composition today: cards. Listed in the editor's
// manifest so the block is swappable the day a second one exists (niche arc Stage 4).
export const PRODUCT_GRID_VARIANTS: Record<string, typeof ProductGridBlock> = {
  cards: ProductGridBlock,
}
