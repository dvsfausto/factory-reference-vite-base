import { createFileRoute, notFound } from '@tanstack/react-router'
import { ServicePageTemplate } from '~/components/ServicePageTemplate'
import { JsonLd } from '~/components/JsonLd'
import { servicesData } from '~/data/services'
import { serviceLd, breadcrumbLd, faqLd, buildMeta } from '~/lib/seo'
import { ogImageForService } from '~/data/images'
import { SITE } from '~/data/site'

export const Route = createFileRoute('/services/$slug')({
  loader: ({ params }) => {
    const data = servicesData[params.slug]
    if (!data) throw notFound()
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
