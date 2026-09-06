import { createFileRoute } from '@tanstack/react-router'
import { routeDescriptions } from '~/lib/route-descriptions'
import { tr } from '~/lib/i18n'
import { buildMeta, breadcrumbLd } from '~/lib/seo'
import { SITE } from '~/data/site'
import { ABOUT_LAYOUT } from '~/data/about-layout'
import { SectionList } from '~/components/render-section'

export const Route = createFileRoute('/about')({
  head: () =>
    ({ ...buildMeta({
      title: `${tr('route.about')} ${SITE.name}`,
      description: routeDescriptions.about(),
      path: '/about',
    }), scripts: [{ type: 'application/ld+json', children: JSON.stringify(breadcrumbLd([{ name: tr('breadcrumb.home'), url: '/' }, { name: tr('nav.about'), url: '/about' }])) }] }),
  component: AboutPage,
})

// The /about page now renders through the SHARED renderer (Arc 3 · Stage B): the
// page-local renderAboutBlock + AboutIntro are gone. The WOW page-intro copy is
// passed as ctx.intro (rendered by the shared IntroBlock), and ABOUT_LAYOUT selects
// the WOW variants (team → grid, trustBar → glow-cards, cta → aurora-glow). Reveal is
// applied by SectionList. Content preserved: eyebrow 'About', the "About {name}"
// heading, and the tagline + about prose (folded into the intro body so neither line
// is dropped — IntroBlock has a single body field). Each section self-omits on empty.
function AboutPage() {
  return (
    <SectionList
      blocks={ABOUT_LAYOUT}
      ctx={{
        intro: {
          eyebrow: tr('nav.about'),
          heading: `${tr('route.about')} ${SITE.name}`,
          body: [SITE.tagline, SITE.about].filter(Boolean).join(' '),
          script: undefined,
        },
      }}
    />
  )
}
