import { createFileRoute } from '@tanstack/react-router'
import { ReviewsSection } from '~/components/ReviewsSection'
import { CTASection } from '~/components/CTASection'
import { renderCharacterCta } from '~/components/CharacterHero'
import { buildMeta } from '~/lib/seo'
import { SITE } from '~/data/site'

export const Route = createFileRoute('/reviews')({
  head: () =>
    buildMeta({
      title: `Reviews — ${SITE.name}`,
      description: `What customers say about ${SITE.name}.`,
      path: '/reviews',
    }),
  component: ReviewsPage,
})

function ReviewsPage() {
  return (
    <>
      <section className="bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            Reviews
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-700">
            Verified customer reviews across the work we&apos;ve done.
          </p>
        </div>
      </section>
      <ReviewsSection heading="All reviews" count={50} />
      {renderCharacterCta({ title: 'Want to work together?' }) ?? <CTASection title="Want to work together?" />}
    </>
  )
}
