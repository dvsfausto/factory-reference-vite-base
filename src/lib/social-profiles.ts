import { SITE } from '~/data/site'

// SOCIAL PROFILES (2026-10-12): the platforms a business links to, read from SITE.social (the owner's
// confirmed profile links) and SITE.stats (the owner's follower counts, a stat row labelled with the platform's name).
// HONESTY: a platform shows only with a confirmed https link; a count shows only beside the date it was true (the caller
// passes that note), never alone; nothing here invents a link, a count or a date. No link anywhere = an empty list.
export type SocialPlatform = 'instagram' | 'tiktok' | 'facebook'
export interface SocialProfile { key: SocialPlatform; name: string; href: string; count?: string }
const PLATFORMS: { key: SocialPlatform; name: string }[] = [
  { key: 'instagram', name: 'Instagram' },
  { key: 'tiktok', name: 'TikTok' },
  { key: 'facebook', name: 'Facebook' },
]
export function socialProfiles(site: typeof SITE = SITE): SocialProfile[] {
  const social = ((site as { social?: Record<string, unknown> }).social ?? {}) as Record<string, unknown>
  const stats = (site as { stats?: { value: string; label: string }[] }).stats ?? []
  return PLATFORMS.flatMap((p) => {
    const href = social[p.key]
    if (typeof href !== 'string' || !/^https:\/\/[^\s]+$/.test(href)) return []
    const count = stats.find((s) => s.label?.trim().toLowerCase() === p.name.toLowerCase())?.value?.trim()
    return [{ ...p, href, ...(count ? { count } : {}) }]
  })
}
