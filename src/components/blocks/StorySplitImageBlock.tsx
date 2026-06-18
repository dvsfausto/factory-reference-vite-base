import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'

// Story LAYOUT: 'split-image' — the story prose beside a framed photo.
// Character-agnostic. Uses SITE.about for the narrative and the existing
// SITE.hero.image_url for the image (no new field), so it renders on any built
// site. An optional SITE.story.image overrides the photo via cast.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700: emerald-600 eyebrow.
// Radius -> rounded-* (DNA). Font -> font-display (DNA). Light surface component-
// owned (#F8FAFC / slate / #E6E8EC). No CTA by design. Never bg-brand-* / .btn.
export function StorySplitImageBlock({
  label = 'Our story',
  heading,
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const storyImage = (SITE as { story?: { image?: string } }).story?.image
  const prose = body ?? SITE.about
  if (!prose) return null
  return (
    <section className="bg-[#F8FAFC]">
      <div className="container-x py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              <span className="h-px w-6 bg-emerald-600" />
              {label}
            </span>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">
              {heading ?? `About ${SITE.name}`}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-[#475569]">{prose}</p>
          </div>
          <div className="overflow-hidden rounded-3xl border border-[#E6E8EC] shadow-sm">
            <img
              src={imageSrc(storyImage ?? SITE.hero.image_url)}
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
