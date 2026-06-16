import { Clock, Heart, ShieldCheck } from 'lucide-react'
import { TrustBar } from '~/components/TrustBar'

// Markup extracted VERBATIM from routes/index.tsx (the TRUST BAR section).
// Always renders (TrustBar emits its own <section>).
// `items` (title/description text) defaults to today's literals and is the
// override channel; the icons stay fixed in the component (visual identity,
// not copy) and are zipped by index. Default layout sets no param → byte-
// identical render.
export function TrustBarBlock({
  items = [
    {
      title: 'Licensed & insured',
      description: 'Professional team with proper credentials and coverage.',
    },
    {
      title: 'Same-day quotes',
      description: 'We reply within a business day, often the same day.',
    },
    {
      title: 'Local team',
      description: 'Familiar faces, familiar streets, real accountability.',
    },
  ],
}: {
  items?: { title: string; description: string }[]
}) {
  const icons = [
    <ShieldCheck className="h-7 w-7" strokeWidth={1.8} />,
    <Clock className="h-7 w-7" strokeWidth={1.8} />,
    <Heart className="h-7 w-7" strokeWidth={1.8} />,
  ]
  return (
    <TrustBar
      items={items.map((it, i) => ({
        icon: icons[i],
        title: it.title,
        description: it.description,
      }))}
    />
  )
}
