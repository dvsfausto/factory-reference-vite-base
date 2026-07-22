import { Clock, Heart, ShieldCheck } from 'lucide-react'
import { TrustBar } from '~/components/TrustBar'
import { SITE } from '~/data/site'
import { renderCharacterTrustBar } from '~/components/CharacterHero'

// Markup extracted VERBATIM from routes/index.tsx (the TRUST BAR section).
// Always renders (TrustBar emits its own <section>).
// `items` (title/description text) defaults to today's literals and is the
// override channel; the icons stay fixed in the component (visual identity,
// not copy) and are zipped by index. Default layout sets no param → byte-
// identical render.
const DEFAULT_TRUST_ITEMS = [
  {
    title: 'Friendly local team',
    description: 'Real people who take pride in their work and stand behind it.',
  },
  {
    title: 'Same-day quotes',
    description: 'We reply within a business day, often the same day.',
  },
  {
    title: 'Local team',
    description: 'Familiar faces, familiar streets, real accountability.',
  },
]

export function TrustBarBlock({
  items,
}: {
  items?: { title: string; description: string }[]
}) {
  // Prefer an explicit param, else the site's emitted trust copy (generic vertical), else the
  // defaults — identical to before when neither is present (known verticals). Then hand off to the
  // character trust variant on a character site, else the default TrustBar (byte-identical).
  const resolved =
    items ??
    (SITE as { trustItems?: { title: string; description: string }[] }).trustItems ??
    DEFAULT_TRUST_ITEMS
  const character = renderCharacterTrustBar({ items: resolved })
  if (character) return character
  const icons = [
    <ShieldCheck className="h-7 w-7" strokeWidth={1.8} />,
    <Clock className="h-7 w-7" strokeWidth={1.8} />,
    <Heart className="h-7 w-7" strokeWidth={1.8} />,
  ]
  return (
    <TrustBar
      items={resolved.map((it, i) => ({
        icon: icons[i],
        title: it.title,
        description: it.description,
      }))}
    />
  )
}
