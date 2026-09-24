import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { customPagesData } from '~/data/custom-pages'

// /p/<slug> was the address of every customer-created page until 2026-09-24; the page now lives at
// /<slug> (routes/$slug.tsx). This route stays so nothing anyone shared breaks: a page that exists
// answers with a REAL 301 to its clean address (search equity moves, old links land), an unknown
// slug is an honest 404. /p/book and /p/quote land on their dedicated routes the same way.
export const Route = createFileRoute('/p/$slug')({
  loader: ({ params }) => {
    if (!customPagesData[params.slug]) throw notFound()
    throw redirect({ to: '/$slug', params: { slug: params.slug }, statusCode: 301 })
  },
})
