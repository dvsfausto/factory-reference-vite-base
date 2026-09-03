import { createFileRoute, notFound } from '@tanstack/react-router'
import { SectionList } from '~/components/render-section'
import { JsonLd } from '~/components/JsonLd'
import { customPagesData } from '~/data/custom-pages'
import { breadcrumbLd, buildMeta } from '~/lib/seo'
import { SITE } from '~/data/site'

// CLEAN /book route for the booking widget — the URL a barber actually texts a customer
// ("mysite.com/book"), and the canonical for ranking. It renders the SAME 'book' customPage
// (design_dna → customPagesData['book']) the /p/book catch-all serves, so content stays editable +
// rebuild-durable; only the URL is dedicated. The page's booking block carries params.forceEnabled
// so the wizard renders here for any affordance-eligible business, independent of the homepage-section
// heuristic. 404s when the business has no book page (no bookable services / vetoed type). TanStack
// matches this static route before the /p/$slug catch-all, so /p/book still works.
export const Route = createFileRoute('/book')({
  loader: () => {
    const data = customPagesData['book']
    if (!data) throw notFound()
    return { data }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const d = loaderData.data
    return buildMeta({
      title: d.title,
      description: d.description,
      path: '/book', // canonical → the clean URL, not /p/book
    })
  },
  component: BookPage,
})

function BookPage() {
  const { data } = Route.useLoaderData()
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Home', url: '/' },
          { name: data.title, url: '/book' },
        ])}
      />
      <SectionList blocks={data.layout} ctx={{ intro: data.intro, faqs: SITE.homeFaqs }} titleFromFirstBlock />
    </>
  )
}
