import { createFileRoute } from '@tanstack/react-router'
import { LeadForm } from '~/components/LeadForm'
import { buildMeta } from '~/lib/seo'
import { SITE } from '~/data/site'

export const Route = createFileRoute('/contact')({
  head: () =>
    buildMeta({
      title: `Contact ${SITE.name}`,
      description: `Get a free quote from ${SITE.name}.`,
      path: '/contact',
    }),
  component: ContactPage,
})

function ContactPage() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            Get in touch
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-700">
            We reply within a business day to every quote request.
          </p>
          <div className="mt-8">
            <LeadForm />
          </div>
        </div>
        <aside className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Other ways to reach us
            </p>
            <div className="mt-4 space-y-3 text-sm">
              <a
                href={`tel:${SITE.phone}`}
                className="block font-semibold text-slate-900 hover:text-emerald-700"
              >
                {SITE.phoneDisplay}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="block text-slate-700 hover:text-emerald-700"
              >
                {SITE.email}
              </a>
              {SITE.address.city && (
                <p className="text-slate-700">
                  {[SITE.address.city, SITE.address.state, SITE.address.zip]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              )}
              {SITE.hours && <p className="text-slate-700">{SITE.hours}</p>}
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
