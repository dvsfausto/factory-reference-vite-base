import { SITE } from '~/data/site'
import { tr } from '~/lib/i18n'
import { HERO_ALT } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'
import { heroFocusStyle } from '~/lib/hero-focus'
import { paragraphs } from '~/lib/paragraphs'
import { Kicker, EditorialHeading } from '~/components/editorial/Primitives'
import { EditorialLink } from '~/components/editorial/EditorialCta'

// Story VARIANT: 'image-text-split' (the Editorial theme, ZB-147 W1.2). On the beige band: a tall 4:5 photo on the
// left (55% of the row), and on the right the kicker, the split serif heading, the owner's about text in up to five
// paragraphs, and a text link to the About page. On a phone the photo comes first, then the words. The photo is the
// owner's story portrait when one is set, else the hero photo (no new field). Props match StoryNarrativeBlock.
export function StoryImageTextSplitBlock({
  site = SITE,
  label = tr('editorial.storyKicker'),
  heading = tr('editorial.storyHeading'),
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
  const paras = paragraphs(prose).slice(0, 5)
  return (
    <section className="bg-fam-surface-2 text-fam-ink">
      <div className="container-x py-section">
        <div className="grid items-center gap-10 lg:grid-cols-[55fr_45fr] lg:gap-16">
          <div className="overflow-hidden">
            <img
              src={imageSrc(storyImage ?? site.hero.image_url)}
              alt={HERO_ALT}
              loading="lazy"
              width={880}
              height={1100}
              className="aspect-[4/5] w-full object-cover"
              data-hero-photo=""
              style={storyImage ? undefined : heroFocusStyle(site)}
            />
          </div>
          <div>
            <Kicker>{label}</Kicker>
            <EditorialHeading size="md" text={heading} className="mt-5" />
            <div className="mt-7 space-y-5">
              {paras.map((p, i) => (
                <p key={i} className="font-sans text-[17px] leading-relaxed text-fam-ink-muted">{p}</p>
              ))}
            </div>
            <EditorialLink to="/about" tone="link" className="mt-9 text-fam-ink">{tr('editorial.storyLink')}</EditorialLink>
          </div>
        </div>
      </div>
    </section>
  )
}
