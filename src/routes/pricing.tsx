import { createFileRoute } from '@tanstack/react-router'
import { CTASection } from '~/components/CTASection'
import { buildMeta } from '~/lib/seo'
import { SITE } from '~/data/site'

export const Route = createFileRoute('/pricing')({
  head: () =>
    buildMeta({
      title: `Pricing — ${SITE.name}`,
      description: `Transparent pricing from ${SITE.name}.`,
      path: '/pricing',
    }),
  component: PricingPage,
})

function PricingPage() {
  return (
    <>
      <section className="bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            Pricing
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-700">
            {SITE.pricing}
          </p>
        </div>
      </section>
      <CTASection title="Want a quote?" />
    </>
  )
}
