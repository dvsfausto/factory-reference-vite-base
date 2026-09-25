import { MapEmbedStylePanelBlock } from './MapEmbedStylePanelBlock'
import { MapSplitWithAreasBlock } from './MapSplitWithAreasBlock'
import { MapFullWidthBandBlock } from './MapFullWidthBandBlock'
import { MapRealEmbedBlock } from './MapRealEmbedBlock'

// Per-type variant map for the Map section (additive, like HERO_VARIANTS),
// embed-style-panel default. Reads the existing AREAS data (src/data/areas.ts).
//
// HONESTY (same discipline as the serviceAreas 'map-style' variant): this is a
// STYLIZED coverage panel — a decorative map field with the real area names as
// labels and a tier-driven emphasis (home-base highlighted). It fabricates NO
// geography: pin positions are a deterministic decorative scatter, never claimed
// real coordinates. A real embedded map (Google/Mapbox) is a later integration.
export const MAP_VARIANTS: Record<string, typeof MapEmbedStylePanelBlock> = {
  'embed-style-panel': MapEmbedStylePanelBlock,
  'split-with-areas': MapSplitWithAreasBlock,
  'full-width-band': MapFullWidthBandBlock,
  // ★ the one real map (2026-09-25): the business's own coordinates on Google's map; renders nothing without them
  'real-embed': MapRealEmbedBlock as unknown as typeof MapEmbedStylePanelBlock,
}
