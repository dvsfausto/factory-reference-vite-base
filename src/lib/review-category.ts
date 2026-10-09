import type { Review } from '~/lib/types/page-types'
import { serviceFor } from '~/lib/editorial-media'

/* ★ A REVIEW'S CATEGORY (ZB-147 W1.3): the service it is about. The review's own `service` field when the owner set one;
   else the business's service whose name shares a word with the review's text ("our wedding pictures" → Wedding,
   "headshots for my team" → Headshots), through the same stemmed word match the portfolio uses (serviceFor). A review that
   names no service has no category: null, never a guess. Deterministic, so a rebuild groups the same way. */
export function reviewCategory(r: Pick<Review, 'service' | 'text'>): string | null {
  if (typeof r.service === 'string' && r.service.trim()) return r.service.trim()
  const hit = serviceFor(r.text)
  return hit ? String(hit.displayName ?? hit.name ?? '').trim() || null : null
}

/** Reviews ordered so the first N cover as many categories as possible (one per category, then the rest in order). */
export function spreadByCategory<T extends Pick<Review, 'service' | 'text'>>(list: T[]): T[] {
  const seen = new Set<string>(); const first: T[] = []; const rest: T[] = []
  for (const r of list) { const c = reviewCategory(r) ?? '__none'; if (seen.has(c)) rest.push(r); else { seen.add(c); first.push(r) } }
  return [...first, ...rest]
}
