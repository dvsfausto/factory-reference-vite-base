import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { ServicePageTemplate } from '~/components/ServicePageTemplate'
import { JsonLd } from '~/components/JsonLd'
import { servicesData } from '~/data/services'
import { SERVICES } from '~/data/services-view'
import { serviceLd, breadcrumbLd, faqLd, buildMeta } from '~/lib/seo'
import { ogImageForService } from '~/data/images'
import { SITE } from '~/data/site'

export const Route = createFileRoute('/services/$slug')({
  loader: ({ params }) => {
    const data = servicesData[params.slug]
    if (!data) throw notFound()
    // UNPUBLISHED (published:false → filtered out of the visible list): send a REAL HTTP 301 to the
    // parent index so search equity transfers and the URL is dropped cleanly. Data stays put; restore
    // (published:true) makes the slug visible again and this stops firing — no persistent rule to undo.
    if (!SERVICES.some((s) => s.slug === params.slug)) {
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
      <ServicePageTemplate data={data} />
    </>
  )
}

// Silence unused import warnings (SITE used inside template via context, not here)
void SITE
