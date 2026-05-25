import type { Review } from '~/lib/types/page-types'

// Customer reviews. Initially empty.
// Customer provides favorites post-launch; team adds them here.

export const reviews: Review[] = []

export function getAggregateRating(): { value: number; count: number } | null {
  if (reviews.length === 0) return null
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
  const value = Math.round((sum / reviews.length) * 10) / 10
  return { value, count: reviews.length }
}

export function getHomepageReviews(count = 3): Review[] {
  return reviews.slice(0, count)
}
