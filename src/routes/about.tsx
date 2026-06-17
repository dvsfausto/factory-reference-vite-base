import { createFileRoute } from '@tanstack/react-router'
import { CTASection } from '~/components/CTASection'
import { buildMeta } from '~/lib/seo'
import { SITE } from '~/data/site'

export const Route = createFileRoute('/about')({
  head: () =>
    buildMeta({
      title: `About ${SITE.name}`,
      description: `Local team. Honest work. ${SITE.tagline}`,
      path: '/about',
    }),
  component: AboutPage,
})

function AboutPage() {
  return (
    <>
      <section className="bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            About {SITE.name}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-700">
            {SITE.tagline}
          </p>
        </div>
      </section>
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <p className="text-base leading-relaxed text-slate-700">
            {SITE.about}
          </p>
        </div>
      </section>
      <CTASection title="Want to work together?" />
    </>
  )
}
