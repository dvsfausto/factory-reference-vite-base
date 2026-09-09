import { SITE } from '~/data/site'
import { tr } from '~/lib/i18n'

// Story LAYOUT: 'narrative', a large, centered editorial statement (ported from
// the painter ManifestoBlock, DNA-tokened). Character-agnostic. Uses SITE.about as
// the narrative, with an optional SITE.story { quote, attribution } override via
// cast; renders from SITE.about so it is present on any built site.
//
// TOKEN DISCIPLINE: accent -> fam-accent-* (DNA) 50/100/600/700: fam-accent rule.
// Radius -> rounded-* (DNA). Font -> font-display (DNA). Light surface component-
// owned (white / slate). No CTA by design. Never bg-brand-* / .btn.
export function StoryNarrativeBlock({
  site = SITE,
  label = tr('section.ourStory'),
}: {
  site?: typeof SITE
  label?: string
  heading?: string
  body?: string
}) {
  const story = (site as { story?: { quote?: string; attribution?: string } }).story
  const quote = story?.quote ?? site.about
  const attribution = story?.attribution ?? site.name
  if (!quote) return null
  return (
    <section className="bg-fam-card">
      <div className="container-x py-section">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-fam-accent-text">
            <span className="h-px w-10 bg-fam-accent" />
            {label}
            <span className="h-px w-10 bg-fam-accent" />
          </span>
          <p className="mt-8 font-display text-3xl font-medium leading-snug tracking-tight text-fam-ink sm:text-4xl">
            {quote}
          </p>
          <p className="mt-8 font-display text-sm font-semibold uppercase tracking-[0.18em] text-fam-ink-muted">
            {attribution}
          </p>
        </div>
      </div>
    </section>
  )
}
