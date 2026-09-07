import { SITE } from '~/data/site'
import { tr } from '~/lib/i18n'
import { HERO_ALT } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'

// Story LAYOUT: 'split-image', the story prose beside a framed photo.
// Character-agnostic. Uses SITE.about for the narrative and the existing
// SITE.hero.image_url for the image (no new field), so it renders on any built
// site. An optional SITE.story.image overrides the photo via cast.
//
// TOKEN DISCIPLINE: accent -> fam-accent-* (DNA) 50/100/600/700: fam-accent eyebrow.
// Radius -> rounded-* (DNA). Font -> font-display (DNA). Light surface component-
// owned (#F8FAFC / slate / #E6E8EC). No CTA by design. Never bg-brand-* / .btn.
export function StorySplitImageBlock({
  site = SITE,
  label = tr('section.ourStory'),
  heading,
  body,
}: {
  site?: typeof SITE
  label?: string
  heading?: string
  body?: string
}) {
  const storyImage = (site as { story?: { image?: string } }).story?.image
  const prose = body ?? site.about
  if (!prose) return null
  return (
    <section className="bg-fam-surface-2">
      <div className="container-x py-section">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
              <span className="h-px w-6 bg-fam-accent" />
              {label}
            </span>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">
              {heading ?? `About ${site.name}`}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-fam-ink-muted">{prose}</p>
          </div>
          <div className="overflow-hidden rounded-3xl border border-fam-hairline shadow-sm">
            <img
              src={imageSrc(storyImage ?? site.hero.image_url)}
              alt={HERO_ALT}
              loading="lazy"
              width={900}
              height={700}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
