import { createFileRoute, notFound } from '@tanstack/react-router'
import { SectionList } from '~/components/render-section'
import { JsonLd } from '~/components/JsonLd'
import { customPagesData } from '~/data/custom-pages'
import { breadcrumbLd, buildMeta } from '~/lib/seo'
import { SITE } from '~/data/site'

// Generic CATCH-ALL route for customer-created pages (Phase 2 — add/remove whole pages).
// ONE route serves every custom page: it looks the slug up in customPagesData (emitted from
// design_dna.customPages) and renders that page's own `layout` through the SAME SectionList
// used everywhere. No per-page route file, no codegen — a new page is pure data. An unknown
// slug 404s (notFound), so removing a page from design_dna makes /p/$slug 404 on rebuild.
export const Route = createFileRoute('/p/$slug')({
  loader: ({ params }) => {
    const data = customPagesData[params.slug]
    if (!data) throw notFound()
    return { data }
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return {}
    const d = loaderData.data
    return buildMeta({
      title: d.title,
      description: d.description,
      path: `/p/${params.slug}`,
    })
  },
  component: CustomPage,
})

function CustomPage() {
  const { data } = Route.useLoaderData()
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Home', url: '/' },
          { name: data.title, url: `/p/${data.slug}` },
        ])}
      />
      <SectionList blocks={data.layout} ctx={{ intro: data.intro, faqs: SITE.homeFaqs }} />
    </>
  )
}
