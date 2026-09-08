import { EmergencyBarBlock } from './EmergencyBarBlock'

// Per-type variant map (additive, like HERO_VARIANTS). One composition today: the strip. Listed in the
// editor's manifest so the block is swappable the day a second one exists (niche arc Stage 4).
export const EMERGENCY_BAR_VARIANTS: Record<string, typeof EmergencyBarBlock> = {
  strip: EmergencyBarBlock,
}
