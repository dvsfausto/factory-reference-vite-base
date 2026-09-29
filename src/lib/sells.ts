import { SITE } from '~/data/site'

/* ★ WHAT THE BUSINESS SELLS (the model decision, 2026-09-29, phase 4 of five things, five models). The scaffolder bakes
   SITE.sells from the business_sells row only when it differs from this default; an absent key reads as a business that
   sells services and nothing else, so every site baked before the key existed is unchanged. Readers: the booking wizard
   (which groups to draw), the header and footer (the Services entry). The sections themselves are placed by the scaffolder
   and the editor from the same row; a block still self-omits without rows. */
export interface SiteSells { services: boolean; products: boolean; packs: boolean; classes: boolean }

export const SELLS: SiteSells = {
  services: true,
  products: false,
  packs: false,
  classes: false,
  ...((SITE as { sells?: Partial<SiteSells> }).sells ?? {}),
}
