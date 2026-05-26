import { Link } from '@tanstack/react-router'
import { FAQSection } from './FAQSection'
import { CTASection } from './CTASection'
import { areaImageUrl, areaAlt } from '~/data/images'
import { SERVICES } from '~/data/services'
import { SITE } from '~/data/site'
import type { ServiceAreaPageData } from '~/lib/types/page-types'

interface Props {
  data: ServiceAreaPageData
}

export function ServiceAreaPageTemplate({ data }: Props) {
  const servicesMap = new Map(SERVICES.map((s) => [s.slug, s]))
  const featured = data.servicesHere.featured
    .map((slug) => servicesMap.get(slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))

  return (
    <>
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <nav className="text-sm text-slate-500">
            <Link to="/" className="hover:text-emerald-700">
              Home
            </Link>{' '}
            ·{' '}
            <Link to="/areas" className="hover:text-emerald-700">
              Areas
            </Link>
          </nav>
          <div className="mt-6 grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
                {data.hero.h1}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-700">
                {data.hero.subhead}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-emerald-700"
                >
                  Get a quote
                </Link>
                <a
                  href={`tel:${SITE.phone}`}
                  className="text-base font-semibold text-slate-900 hover:text-emerald-700"
                >
                  Or call: {SITE.phoneDisplay}
                </a>
              </div>
            </div>
            <div className="order-first lg:order-last">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
                <img
                  src={areaImageUrl(data.slug)}
                  alt={areaAlt(data.slug)}
                  width={1200}
                  height={900}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
              {data.zipCodes && data.zipCodes.length > 0 && (
                <p className="mt-3 text-xs text-slate-500">
                  ZIP codes: {data.zipCodes.join(' · ')}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {data.about.title}
          </h2>
          <div className="mt-6 space-y-4">
            {data.about.body.map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-slate-700">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="bg-slate-50">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {data.servicesHere.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-700">
                {data.servicesHere.intro}
              </p>
            </div>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((s) => (
                <li key={s.slug}>
                  <Link
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="block h-full rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-lg"
                  >
                    <p className="text-lg font-semibold text-slate-900">
                      {s.name}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {s.short}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {data.landmarks.items.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-3xl px-4 py-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {data.landmarks.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-700">
              {data.landmarks.intro}
            </p>
            <ul className="mt-8 grid gap-2 sm:grid-cols-2">
              {data.landmarks.items.map((l, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-base text-slate-700"
                >
                  <span aria-hidden className="mt-1 text-emerald-600">
                    •
                  </span>
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <FAQSection faqs={data.faqs} title={`Questions about ${data.name}`} />

      <CTASection
        title={`Working in ${data.name}?`}
        subtitle="We'll respond within a business day with a free quote."
      />
    </>
  )
}
