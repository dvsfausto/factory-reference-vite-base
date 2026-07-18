import { createFileRoute, redirect } from '@tanstack/react-router'
import { AreasSection } from '~/components/AreasSection'
import { CTASection } from '~/components/CTASection'
import { buildMeta } from '~/lib/seo'
import { AREAS } from '~/data/areas'
import { SITE } from '~/data/site'

export const Route = createFileRoute('/areas/')({
  // No service areas (e.g. a single-area business) → there is no "where we work"
  // to show, so send visitors home rather than render an empty index. The
  // scaffolder also prunes this route file entirely when there are 0 areas (→
  // a real 404); this guard covers the window before that ships and any path
  // that keeps the route.
  beforeLoad: () => {
    if (AREAS.length === 0) throw redirect({ to: '/' })
  },
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
        title="Don't see your area?"
        subtitle="Call us — we often travel for the right project."
      />
    </>
  )
}
