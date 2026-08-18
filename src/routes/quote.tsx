import { createFileRoute, notFound } from '@tanstack/react-router'
import { SectionList } from '~/components/render-section'
import { JsonLd } from '~/components/JsonLd'
import { customPagesData } from '~/data/custom-pages'
import { breadcrumbLd, buildMeta } from '~/lib/seo'
import { SITE } from '~/data/site'

// CLEAN /quote route for the quote-request widget — the URL an owner actually hands out
// ("mysite.com/quote"), and the canonical for ranking. It renders the SAME 'quote' customPage
// (design_dna → customPagesData['quote']) the /p/quote catch-all serves, so content stays editable +
// rebuild-durable; only the URL is dedicated. 404s when the business has no quote page (no quotable
// services). TanStack matches this static route before the /p/$slug catch-all, so /p/quote still works.
export const Route = createFileRoute('/quote')({
  loader: () => {
    const data = customPagesData['quote']
    if (!data) throw notFound()
    return { data }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const d = loaderData.data
    return buildMeta({
      title: d.title,
      description: d.description,
      path: '/quote', // canonical → the clean URL, not /p/quote
    })
  },
  component: QuotePage,
})

function QuotePage() {
  const { data } = Route.useLoaderData()
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Home', url: '/' },
          { name: data.title, url: '/quote' },
        ])}
      />
      <SectionList blocks={data.layout} ctx={{ intro: data.intro, faqs: SITE.homeFaqs }} />
    </>
  )
}
