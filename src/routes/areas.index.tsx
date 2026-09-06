import { createFileRoute, redirect } from '@tanstack/react-router'
import { routeDescriptions } from '~/lib/route-descriptions'
import { tr, LANG } from '~/lib/i18n'
import { buildMeta, breadcrumbLd } from '~/lib/seo'
import { AREAS } from '~/data/areas'
import { SITE } from '~/data/site'
import { AREAS_INDEX_LAYOUT } from '~/data/areas-index-layout'
import { SectionList } from '~/components/render-section'

export const Route = createFileRoute('/areas/')({
  // No service areas (e.g. a single-area business) → there is no "where we work"
  // to show, so send visitors home rather than render an empty index. The
  // scaffolder also prunes this route file entirely when there are 0 areas (→
  // a real 404); this guard covers the window before that ships and any path
  // that keeps the route.
  beforeLoad: () => {
    if (AREAS.length === 0) throw redirect({ to: '/' })
  },
  head: () =>
    ({ ...buildMeta({
      title: `${tr('section.serviceAreas')} | ${SITE.name}`,
      description: routeDescriptions.areas(),
      path: '/areas',
    }), scripts: [{ type: 'application/ld+json', children: JSON.stringify(breadcrumbLd([{ name: tr('breadcrumb.home'), url: '/' }, { name: tr('section.serviceAreas'), url: '/areas' }])) }] }),
  component: AreasIndex,
})

// The /areas index now renders through the SHARED renderer (Arc 3 · Stage B): the old
// bg-slate intro + AreasSection + CTA JSX is replaced by AREAS_INDEX_LAYOUT. The WOW
// page-intro copy is passed as ctx.intro (shared IntroBlock), the 'areasIndex' block
// renders the FULL service-areas list (ALL areas), and the cta is the WOW aurora-glow
// with the original CTA copy preserved. Reveal is applied by SectionList.
function AreasIndex() {
  return (
    <SectionList
      blocks={AREAS_INDEX_LAYOUT}
      ctx={{
        intro: {
          eyebrow: tr('section.serviceAreas'),
          heading: tr('section.whereWeWork'),
          body: tr('section.localCrews'),
        },
      }}
    />
  )
}
