import { Link } from '@tanstack/react-router'
import { FAQSection } from './FAQSection'
import { CTASection } from './CTASection'
import { serviceImageUrl } from '~/data/images'
import { SITE } from '~/data/site'
import type { ServicePageData } from '~/lib/types/page-types'

interface Props {
  data: ServicePageData
}

export function ServicePageTemplate({ data }: Props) {
  return (
    <>
      {/* Hero — split image right */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <nav className="text-sm text-slate-500">
            <Link to="/" className="hover:text-emerald-700">
              Home
            </Link>{' '}
            ·{' '}
            <Link to="/services" className="hover:text-emerald-700">
              Services
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
              {data.hero.trustLine && (
                <p className="mt-5 text-sm text-slate-600">
                  {data.hero.trustLine}
                </p>
              )}
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
                  src={serviceImageUrl(data.slug)}
                  alt={data.hero.h1}
                  width={1200}
                  height={900}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What we cover */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {data.whatWeBuy.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-700">
            {data.whatWeBuy.body}
          </p>
          <ul className="mt-8 space-y-3">
            {data.whatWeBuy.items.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-800">
                <span aria-hidden className="mt-1 shrink-0 text-emerald-600">
                  ✓
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How pricing works */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {data.howPrice.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-700">
              {data.howPrice.body}
            </p>
          </div>
          <ul className="mt-10 space-y-6">
            {data.howPrice.factors.map((f, i) => (
              <li key={i} className="flex gap-4">
                <span className="shrink-0 text-2xl font-bold text-emerald-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {f.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {f.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Scenarios */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {data.scenarios.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-700">
              {data.scenarios.intro}
            </p>
          </div>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2">
            {data.scenarios.cards.map((c, i) => (
              <li key={i} className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {c.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {data.pricing.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-700">
            {data.pricing.body}
          </p>
          {data.pricing.ranges && data.pricing.ranges.length > 0 && (
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.pricing.ranges.map((r) => (
                <li
                  key={r.label}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-4"
                >
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    {r.label}
                  </p>
                  <p className="mt-1 text-xl font-bold text-emerald-700">
                    {r.range}
                  </p>
                </li>
              ))}
            </ul>
          )}
          {data.pricing.notes.length > 0 && (
            <ul className="mt-8 space-y-2 border-t border-slate-200 pt-6">
              {data.pricing.notes.map((n, i) => (
                <li key={i} className="text-base leading-relaxed text-slate-700">
                  <span aria-hidden className="mr-3 text-emerald-600">
                    —
                  </span>
                  {n}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Coverage */}
      {data.coverage.areas.length > 0 && (
        <section className="bg-slate-50">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {data.coverage.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-700">
                {data.coverage.intro}
              </p>
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {data.coverage.areas.map((a) => (
                <li key={a.href}>
                  <Link
                    to={a.href}
                    className="block rounded-lg bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:text-emerald-700"
                  >
                    {a.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <FAQSection faqs={data.faqs} title="Questions we hear often" />

      <CTASection
        title="Ready when you are."
        subtitle="Get a free quote and we'll be in touch within a business day."
      />
    </>
  )
}
