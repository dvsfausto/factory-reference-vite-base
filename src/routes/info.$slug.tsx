import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { SectionList } from '~/components/render-section'
import { INFO_DETAIL_LAYOUT } from '~/data/info-detail-layout'
import { JsonLd } from '~/components/JsonLd'
import { articleLd, breadcrumbLd, buildMeta, faqLd } from '~/lib/seo'
import { SITE } from '~/data/site'
import { INFO_REDIRECTS } from '~/data/info-redirects'

export const Route = createFileRoute('/info/$slug')({
  loader: async ({ params }) => {
    // OWNER-REMOVED info page: a REAL 301 (search equity moves, old links land somewhere). Checked before
    // the data lookup because a removed page's copy is gone from infoPagesData.
    const moved = INFO_REDIRECTS[params.slug]
    if (moved) throw redirect({ href: moved, statusCode: 301 })
    // Stage C: the per-page copy is its own module (scripts/prune-variants.mjs split-page-data), fetched only when
    // this route runs — the homepage no longer ships every inner page's prose. Same object, same served HTML.
    const { infoPagesData } = await import('virtual:zmode-page-data/infoPagesData')
    const data = infoPagesData[params.slug]
    if (!data) throw notFound()
    return { data }
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return {}
    const d = loaderData.data
    return buildMeta({
      title: d.title,
      description: d.description,
      path: `/info/${params.slug}`,
    })
  },
  component: InfoPage,
})

function InfoPage() {
  const { data } = Route.useLoaderData()
  return (
    <>
      <JsonLd
        data={articleLd({
          headline: data.hero.h1,
          description: data.description,
          url: `${SITE.domain}/info/${data.slug}`,
        })}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: 'Home', url: '/' },
          { name: data.hero.h1, url: `/info/${data.slug}` },
        ])}
      />
      {data.faqs.length > 0 && <JsonLd data={faqLd(data.faqs)} />}
      <SectionList blocks={INFO_DETAIL_LAYOUT} ctx={{ info: data, faqs: data.faqs }} />
    </>
  )
}
