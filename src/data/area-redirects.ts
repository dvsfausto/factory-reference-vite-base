// Area pages that are gone (an owner removed the area, or the build no longer has it: a state typed as an area, a
// name that became another). Each old /areas/<slug> answers a real 301 to the path here, so a removed page's links and
// search equity land somewhere instead of a 404 (ZB-147 W1.1). Written by the factory scaffolder on a rebuild; empty on
// a site where nothing moved.

export const AREA_REDIRECTS: Record<string, string> = {}
