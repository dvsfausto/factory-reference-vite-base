import { Link } from '@tanstack/react-router'
import { FAQSection } from './FAQSection'
import { CTASection } from './CTASection'
import { SITE } from '~/data/site'
import type { InfoPageData } from '~/lib/types/page-types'

interface Props {
  data: InfoPageData
}

export function InfoPageTemplate({ data }: Props) {
  return (
    <>
      <section className="bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <nav className="text-sm text-slate-500">
            <Link to="/" className="hover:text-emerald-700">
              Home
            </Link>
          </nav>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            {data.hero.h1}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-700">
            {data.hero.subhead}
          </p>
        </div>
      </section>

      <article className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <div className="space-y-4">
            {data.intro.map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-slate-700">
                {p}
              </p>
            ))}
          </div>
          <div className="mt-12 space-y-12">
            {data.sections.map((s, i) => (
              <section key={i}>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {s.heading}
                </h2>
                <div className="mt-4 space-y-4">
                  {s.body.map((p, bi) => (
                    <p
                      key={bi}
                      className="text-base leading-relaxed text-slate-700"
                    >
                      {p}
                    </p>
                  ))}
                </div>
                {s.list && s.list.length > 0 && (
                  <ul className="mt-6 space-y-2">
                    {s.list.map((l, li) => (
                      <li
                        key={li}
                        className="flex items-start gap-3 text-base leading-relaxed text-slate-700"
                      >
                        <span aria-hidden className="mt-1 text-emerald-600">
                          •
                        </span>
                        {l}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      </article>

      <FAQSection faqs={data.faqs} title="More questions" />

      {(data.relatedServices.length > 0 || data.relatedInfo.length > 0) && (
        <section className="bg-slate-50">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2">
            {data.relatedServices.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Related services
                </p>
                <ul className="mt-4 space-y-2">
                  {data.relatedServices.map((r) => (
                    <li key={r.href}>
                      <Link
                        to={r.href}
                        className="text-base font-semibold text-slate-900 hover:text-emerald-700"
                      >
                        {r.label} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {data.relatedInfo.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Read more
                </p>
                <ul className="mt-4 space-y-2">
                  {data.relatedInfo.map((r) => (
                    <li key={r.href}>
                      <Link
                        to={r.href}
                        className="text-base font-semibold text-slate-900 hover:text-emerald-700"
                      >
                        {r.label} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      <CTASection
        heading="Ready when you are."
        ctaPrimary={{ label: 'Get a quote', href: '/contact' }}
        ctaSecondary={{
          label: `Call ${SITE.phoneDisplay}`,
          href: `tel:${SITE.phone}`,
        }}
      />
    </>
  )
}
