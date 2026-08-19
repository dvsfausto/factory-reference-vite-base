import { SITE } from '~/data/site'
import { tr } from '~/lib/i18n'

// Story LAYOUT: 'narrative', a large, centered editorial statement (ported from
// the painter ManifestoBlock, DNA-tokened). Character-agnostic. Uses SITE.about as
// the narrative, with an optional SITE.story { quote, attribution } override via
// cast; renders from SITE.about so it is present on any built site.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700: emerald-600 rule.
// Radius -> rounded-* (DNA). Font -> font-display (DNA). Light surface component-
// owned (white / slate). No CTA by design. Never bg-brand-* / .btn.
export function StoryNarrativeBlock({
  label = tr('section.ourStory'),
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const story = (SITE as { story?: { quote?: string; attribution?: string } }).story
  const quote = story?.quote ?? SITE.about
  const attribution = story?.attribution ?? SITE.name
  if (!quote) return null
  return (
    <section className="bg-white">
      <div className="container-x py-24 md:py-36">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
            <span className="h-px w-10 bg-emerald-600" />
            {label}
            <span className="h-px w-10 bg-emerald-600" />
          </span>
          <p className="mt-8 font-display text-3xl font-medium leading-snug tracking-tight text-[#0F172A] sm:text-4xl">
            {quote}
          </p>
          <p className="mt-8 font-display text-sm font-semibold uppercase tracking-[0.18em] text-[#64748B]">
            {attribution}
          </p>
        </div>
      </div>
    </section>
  )
}
