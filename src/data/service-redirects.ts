// Service pages that moved or are gone (an owner renamed or removed a service). Each old /services/<slug> answers a real 301 to
// the path here: the same service's new page after a rename, else the services index (2026-10-29, Adrian Hoda: a renamed service's
// old address answered 404). Written by the factory scaffolder on a rebuild; empty on a site where nothing moved.

export const SERVICE_REDIRECTS: Record<string, string> = {}
