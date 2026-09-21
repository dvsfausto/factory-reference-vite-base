// Info pages the OWNER removed (editor remove-info-page, persisted to design_dna.infoPages.removed).
// Each old /info/<slug> answers a real 301 to the path here, so a removed guide's links and search
// equity land somewhere instead of a 404. Written by the editor on removal and by the factory
// scaffolder on a rebuild; empty on a site where nothing was removed.

export const INFO_REDIRECTS: Record<string, string> = {}
