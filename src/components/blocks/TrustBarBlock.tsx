import { factIcon } from '~/lib/fact-icons'
import { TrustBar } from '~/components/TrustBar'
import { SITE } from '~/data/site'
import { renderCharacterTrustBar } from '~/components/CharacterHero'

// Markup extracted VERBATIM from routes/index.tsx (the TRUST BAR section).
// Always renders (TrustBar emits its own <section>).
// `items` (title/description text) defaults to today's literals and is the
// override channel; the icons stay fixed in the component (visual identity,
// not copy) and are zipped by index. Default layout sets no param → byte-
// identical render.
const DEFAULT_TRUST_ITEMS: { title: string; description: string; kind?: string | null }[] = []

export function TrustBarBlock({
  site = SITE,
  items,
}: {
  site?: typeof SITE
  items?: { title: string; description: string; kind?: string | null }[]
}) {
  // Prefer an explicit param, else the site's emitted trust copy (generic vertical), else the
  // defaults, identical to before when neither is present (known verticals). Then hand off to the
  // character trust variant on a character site, else the default TrustBar (byte-identical).
  const resolved = (
    items ??
    (site as { trustItems?: { title: string; description: string; kind?: string | null }[] }).trustItems ??
    DEFAULT_TRUST_ITEMS
  ).slice(0, 3) // cap at 3 — a 4th card wraps to a second line and reads as broken (generic vertical ships 4)
  if (resolved.length === 0) return null // no trust facts → no section; never an invented one (niche arc 2b)
  const character = renderCharacterTrustBar({ items: resolved })
  if (character) return character
  return (
    <TrustBar
      items={resolved.map((it) => ({
        icon: (() => { const Icon = factIcon(it); return Icon ? <Icon className="h-7 w-7" strokeWidth={1.8} /> : null })(),
        title: it.title,
        description: it.description,
      }))}
    />
  )
}
