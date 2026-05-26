import { createFileRoute } from '@tanstack/react-router'
import { ServicesSection } from '~/components/ServicesSection'
import { CTASection } from '~/components/CTASection'
import { buildMeta } from '~/lib/seo'
import { SERVICES } from '~/data/services'
import { SITE } from '~/data/site'

export const Route = createFileRoute('/services/')({
  head: () =>
    buildMeta({
      title: `Services — ${SITE.name}`,
      description: `Full list of services from ${SITE.name}.`,
      path: '/services',
    }),
  component: ServicesIndex,
})

function ServicesIndex() {
  return (
    <>
      <section className="bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            What we do
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-700">
            A short list of focused services, done well.
          </p>
        </div>
      </section>
      <ServicesSection heading="Services" services={SERVICES} />
      <CTASection title="Need a quote?" />
    </>
  )
}
