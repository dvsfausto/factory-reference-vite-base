import { Clock, Heart, ShieldCheck } from 'lucide-react'
import { TrustBar } from '~/components/TrustBar'

// Markup extracted VERBATIM from routes/index.tsx (the TRUST BAR section).
// Always renders (TrustBar emits its own <section>).
export function TrustBarBlock() {
  return (
    <TrustBar
      items={[
        {
          icon: <ShieldCheck className="h-7 w-7" strokeWidth={1.8} />,
          title: 'Licensed & insured',
          description: 'Professional team with proper credentials and coverage.',
        },
        {
          icon: <Clock className="h-7 w-7" strokeWidth={1.8} />,
          title: 'Same-day quotes',
          description: "We reply within a business day, often the same day.",
        },
        {
          icon: <Heart className="h-7 w-7" strokeWidth={1.8} />,
          title: 'Local team',
          description: 'Familiar faces, familiar streets, real accountability.',
        },
      ]}
    />
  )
}
