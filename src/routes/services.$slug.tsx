import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { SectionList } from '~/components/render-section'
import { SERVICE_DETAIL_LAYOUT } from '~/data/service-detail-layout'
import { JsonLd } from '~/components/JsonLd'
import { servicesData } from '~/data/services'
import { PAGED_SERVICES } from '~/data/services-view'
import { serviceLd, breadcrumbLd, faqLd, buildMeta } from '~/lib/seo'
import { ogImageForService } from '~/data/images'
import { SITE } from '~/data/site'

export const Route = createFileRoute('/services/$slug')({
  loader: ({ params }) => {
    const data = servicesData[params.slug]
    if (!data) throw notFound()
    // NOT PAGED — either UNPUBLISHED (published:false) or NON-PAGED (paged:false, beyond the top-8 or
    // a customer override): send a REAL HTTP 301 to the parent index so search equity transfers and no
    // thin/duplicate page is served. servicesData stays put (still editable); restoring published/paged
    // makes the slug serve again and this stops firing — no persistent rule to undo. This is what makes
    // a non-paged link non-dangling BY CONSTRUCTION.
    if (!PAGED_SERVICES.some((s) => s.slug === params.slug)) {
      throw redirect({ to: '/services', statusCode: 301 })
    }
    return { data }
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return {}
    const d = loaderData.data
    return buildMeta({
      title: d.title,
      description: d.description,
      path: `/services/${params.slug}`,
      ogImage: ogImageForService(params.slug),
      ogAlt: d.hero.h1,
    })
  },
  component: ServicePage,
})

function ServicePage() {
  const { data } = Route.useLoaderData()
  return (
    <>
      <JsonLd
        data={serviceLd(data.title, data.description, ogImageForService(data.slug))}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: data.hero.h1, url: `/services/${data.slug}` },
        ])}
      />
      {data.faqs.length > 0 && <JsonLd data={faqLd(data.faqs)} />}
      {/* Arc 3 · Stage C: the fixed ServicePageTemplate is replaced by the shared
          renderer driven by SERVICE_DETAIL_LAYOUT. ctx.service carries THIS service's
          per-item content (hero + whatWeBuy/howPrice/scenarios/pricing/coverage/
          localContext/testimonial/relatedServices); ctx.faqs feeds the faq block.
          ServicePageTemplate.tsx stays in the repo (unused) for backward-reference. */}
      <SectionList
        blocks={SERVICE_DETAIL_LAYOUT}
        ctx={{ service: data, faqs: data.faqs }}
      />
    </>
  )
}

// Silence unused import warnings (SITE used inside template via context, not here)
void SITE
