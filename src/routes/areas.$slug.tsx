import { createFileRoute, notFound } from '@tanstack/react-router'
import { SectionList } from '~/components/render-section'
import { AREA_DETAIL_LAYOUT } from '~/data/area-detail-layout'
import { JsonLd } from '~/components/JsonLd'
import { breadcrumbLd, buildMeta, faqLd } from '~/lib/seo'
import { ogImageForArea } from '~/data/images'

export const Route = createFileRoute('/areas/$slug')({
  loader: async ({ params }) => {
    // Stage C: the per-page copy is its own module (scripts/prune-variants.mjs split-page-data), fetched only when
    // this route runs — the homepage no longer ships every inner page's prose. Same object, same served HTML.
    const { serviceAreasData } = await import('virtual:zmode-page-data/serviceAreasData')
    const data = serviceAreasData[params.slug]
    if (!data) throw notFound()
    return { data }
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return {}
    const d = loaderData.data
    return buildMeta({
      title: d.title,
      description: d.description,
      path: `/areas/${params.slug}`,
      ogImage: ogImageForArea(params.slug),
      ogAlt: d.hero.h1,
    })
  },
  component: AreaPage,
})

function AreaPage() {
  const { data } = Route.useLoaderData()
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Home', url: '/' },
          { name: 'Areas', url: '/areas' },
          { name: data.name, url: `/areas/${data.slug}` },
        ])}
      />
      {data.faqs.length > 0 && <JsonLd data={faqLd(data.faqs)} />}
      <SectionList blocks={AREA_DETAIL_LAYOUT} ctx={{ area: data, faqs: data.faqs }} />
    </>
  )
}
