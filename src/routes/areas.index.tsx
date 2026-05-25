import { createFileRoute } from '@tanstack/react-router'
import { AreasSection } from '~/components/AreasSection'
import { CTASection } from '~/components/CTASection'
import { buildMeta } from '~/lib/seo'
import { AREAS } from '~/data/areas'
import { SITE } from '~/data/site'

export const Route = createFileRoute('/areas/')({
  head: () =>
    buildMeta({
      title: `Service areas — ${SITE.name}`,
      description: `Where ${SITE.name} works.`,
      path: '/areas',
    }),
  component: AreasIndex,
})

function AreasIndex() {
  return (
    <>
      <section className="bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            Where we work
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-700">
            Local crews, familiar streets.
          </p>
        </div>
      </section>
      <AreasSection heading="Service areas" areas={AREAS} />
      <CTASection
        heading="Don't see your area?"
        body="Call us — we often travel for the right project."
        ctaPrimary={{
          label: `Call ${SITE.phoneDisplay}`,
          href: `tel:${SITE.phone}`,
        }}
        ctaSecondary={{ label: 'Get a quote', href: '/contact' }}
      />
    </>
  )
}
