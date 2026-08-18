// Canonical kebab slug — byte-identical to the factory scaffolder/orchestrator `kebab`, so a slug the
// client derives from a service name (live read) matches the baked ServiceRef.slug and the page slug.
export function kebab(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
