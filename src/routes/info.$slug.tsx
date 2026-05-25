import { createFileRoute, notFound } from '@tanstack/react-router'
import { InfoPageTemplate } from '~/components/InfoPageTemplate'
import { JsonLd } from '~/components/JsonLd'
import { infoPagesData } from '~/data/info-pages'
import { articleLd, breadcrumbLd, buildMeta, faqLd } from '~/lib/seo'
import { SITE } from '~/data/site'

export const Route = createFileRoute('/info/$slug')({
  loader: ({ params }) => {
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
      <InfoPageTemplate data={data} />
    </>
  )
}
