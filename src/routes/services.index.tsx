import { createFileRoute, redirect } from '@tanstack/react-router'
import { ServicesSection } from '~/components/ServicesSection'
import { CTASection } from '~/components/CTASection'
import { buildMeta } from '~/lib/seo'
import { SERVICES } from '~/data/services'
import { SITE } from '~/data/site'

export const Route = createFileRoute('/services/')({
  // No services (e.g. a generic-vertical business whose owner supplied none) →
  // there is nothing to list, so send visitors home rather than render an empty
  // index. RUNTIME GUARD, not route deletion: the route file MUST stay so the
  // TanStack typed-route union keeps "/services" and every <Link to="/services">
  // in Header/Footer/ServicesSection/blocks still typechecks. Deleting the route
  // (the /areas-prune mistake) drops it from the union → tsc fails → Vercel ERROR.
  beforeLoad: () => {
    if (SERVICES.length === 0) throw redirect({ to: '/' })
  },
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
