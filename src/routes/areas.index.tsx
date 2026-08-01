import { createFileRoute, redirect } from '@tanstack/react-router'
import { buildMeta } from '~/lib/seo'
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
    buildMeta({
      title: `Service areas — ${SITE.name}`,
      description: `Where ${SITE.name} works.`,
      path: '/areas',
    }),
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
          eyebrow: 'Service areas',
          heading: 'Where we work',
          body: 'Local crews, familiar streets.',
        },
      }}
    />
  )
}
