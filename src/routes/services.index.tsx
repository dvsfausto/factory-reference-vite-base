import { createFileRoute, redirect } from '@tanstack/react-router'
import { buildMeta } from '~/lib/seo'
import { SERVICES } from '~/data/services-view'
import { SITE } from '~/data/site'
import { SERVICES_INDEX_LAYOUT } from '~/data/services-index-layout'
import { SectionList } from '~/components/render-section'

export const Route = createFileRoute('/services/')({
  // No services (e.g. a generic-vertical business whose owner supplied none) →
  // there is nothing to list, so send visitors home rather than render an empty
  // index. RUNTIME GUARD, not route deletion: the route file MUST stay so the
  // TanStack typed-route union keeps "/services" and every <Link to="/services">
  // in Header/Footer/ServicesSection/blocks still typechecks. Deleting the route
  // (the /areas-prune mistake) drops it from the union → tsc fails → Vercel ERROR.
  beforeLoad: () => {
    if (SERVICES.length === 0) throw redirect({ to: '/' })
  },
  head: () =>
    buildMeta({
      title: `Services — ${SITE.name}`,
      description: `Full list of services from ${SITE.name}.`,
      path: '/services',
    }),
  component: ServicesIndex,
})

// The /services index now renders through the SHARED renderer (Arc 3 · Stage B): the
// old bg-slate intro + ServicesSection + CTA JSX is replaced by SERVICES_INDEX_LAYOUT.
// The WOW page-intro copy is passed as ctx.intro (shared IntroBlock), the
// 'servicesIndex' block renders the FULL services list (ALL services, not the
// homepage's 3-item preview), and the cta is the WOW aurora-glow with the original CTA
// copy preserved. Reveal is applied by SectionList.
function ServicesIndex() {
  return (
    <SectionList
      blocks={SERVICES_INDEX_LAYOUT}
      ctx={{
        intro: {
          eyebrow: 'Services',
          heading: 'Our services',
          body: 'A short list of focused services, done well.',
        },
      }}
    />
  )
}
