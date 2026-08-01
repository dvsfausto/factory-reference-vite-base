import { createFileRoute } from '@tanstack/react-router'
import { JsonLd } from '~/components/JsonLd'
import { buildMeta, faqLd } from '~/lib/seo'
import { imageSrc } from '~/lib/asset-url'
import { SITE } from '~/data/site'
import { HOMEPAGE_LAYOUT } from '~/data/layout'
import { SectionList } from '~/components/render-section'

export const Route = createFileRoute('/')({
  // Homepage SEO head goes through the SHARED buildMeta() (same helper sub-pages
  // use) so every page — and every vertical — emits the identical COMPLETE set:
  // title, description, og:title/description/url/type/image(+alt), twitter
  // card/title/description/image, and canonical. Keyword title from the real
  // ${city}-expanded hero headline (NOT the now-empty tagline). description reads
  // SITE.description (real meta copy). canonical + og:url read SITE.domain, so the
  // deployer's pre-push domain rewrite points them at the served host.
  head: () =>
    buildMeta({
      title: `${SITE.name} — ${SITE.hero.headline}`,
      description: SITE.description || SITE.name,
      path: '/',
      ogImage: imageSrc(SITE.hero.image_url),
    }),
  component: HomePage,
})

// The homepage now renders through the SHARED renderer (src/components/render-
// section.tsx) — the SAME switch + variant maps every inner page uses, and the SAME
// Reveal wrapping via SectionList. The block switch + the 7 inline variant maps that
// used to live here were MOVED verbatim into render-section.tsx (Arc 3 · Stage B), so
// this route is now just: SEO head + FAQ JSON-LD + the HOMEPAGE_LAYOUT section list.
// The rendered page is byte-identical to before (same sections, same order, same
// Reveal disabling; the faq case reads SITE.homeFaqs via ctx exactly as HOME_FAQS did).
function HomePage() {
  return (
    <>
      <JsonLd data={faqLd(SITE.homeFaqs)} />
      <SectionList blocks={HOMEPAGE_LAYOUT} ctx={{ faqs: SITE.homeFaqs }} />
    </>
  )
}
