import { MapPin } from 'lucide-react'
import { AREAS } from '~/data/areas'

// Markup extracted VERBATIM from routes/index.tsx (the LOCAL BAR section).
// Self-omits when there are no neighborhoods — exactly today's
// `{neighborhoodList && …}`.
export function LocalBarBlock() {
  const neighborhoodList = AREAS.slice(0, 8).map((a) => a.name).join(' · ')
  if (!neighborhoodList) return null
  return (
    <section className="bg-brand-50 border-y border-brand-100">
      <div className="container-x py-3 flex items-center gap-2 text-sm text-ink-700 overflow-x-auto whitespace-nowrap">
        <MapPin className="h-4 w-4 text-brand-600 shrink-0" />
        <span className="font-semibold text-ink-900 shrink-0">Now serving:</span>
        <span className="text-ink-500">{neighborhoodList}</span>
      </div>
    </section>
  )
}
