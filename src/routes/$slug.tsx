import { createFileRoute, notFound } from '@tanstack/react-router'
import { SectionList } from '~/components/render-section'
import { JsonLd } from '~/components/JsonLd'
import { customPagesData } from '~/data/custom-pages'
import { breadcrumbLd, buildMeta } from '~/lib/seo'
import { SITE } from '~/data/site'
import { tr } from '~/lib/i18n'

// ★ CLEAN ADDRESSES FOR CUSTOMER-CREATED PAGES (2026-09-24). A page an owner adds lives at /<slug>
// ("mysite.com/packs"), not under a system prefix. ONE root catch-all serves every custom page from
// customPagesData (emitted from design_dna.customPages) through the same SectionList as everywhere.
// It cannot collide with the built-in pages: TanStack matches a static route (/about, /services,
// /areas/…, /info/…) before a dynamic one, and the editor refuses those words as slugs. /p/<slug>
// stays alive as a 301 to here (routes/p.$slug.tsx), so every address anyone shared keeps working
// and search moves to the clean one. An unknown slug is an honest 404.
export const Route = createFileRoute('/$slug')({
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
      path: `/${params.slug}`,
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
          { name: tr('breadcrumb.home'), url: '/' },
          { name: data.title, url: `/${data.slug}` },
        ])}
      />
      <SectionList blocks={data.layout} ctx={{ intro: data.intro, faqs: SITE.homeFaqs }} titleFromFirstBlock />
    </>
  )
}
