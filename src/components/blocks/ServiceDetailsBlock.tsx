import type { ReactNode } from 'react'
import { tr } from '~/lib/i18n'
import { Link } from '@tanstack/react-router'
import { MapPin, Quote, Star } from 'lucide-react'
import type { ServicePageData } from '~/lib/types/page-types'

// SERVICE-DETAIL VARIANT (Arc 3 · Stage C): the rich, consolidated MIDDLE content of
// a service page, driven per-item by `service` (ctx.service). It renders, in order -
// howPrice, scenarios, pricing, coverage, localContext, and testimonial, EACH omitting
// when its own data is empty. Consolidating them into one block keeps the
// SERVICE_DETAIL_LAYOUT lean while preserving every field ServicePageTemplate rendered.
//
// WOW tokens consumed (all brand-derived via color-mix, see styles/app.css):
//   · --wow-grad-surface → the tinted sub-section surfaces (alternated with white
//     for vertical rhythm).
//   · --wow-grad-brand   → factor numerals, range accents, the quote mark.
//   · --wow-hairline     → card / table hairline borders.
//   · --wow-shadow-soft / --wow-shadow-glow → card lift + testimonial glow.
// BRAND identity stays on the ramp (brand-* accents) + --wow-*; no fabricated data.
//
// HONESTY (mirrors ServicePageTemplate's per-section guards, per THIS service):
//   · howPrice   → shown only when factors.length > 0
//   · scenarios  → shown only when cards.length > 0
//   · pricing    → shown only when ranges?.length or notes.length > 0 (ranges render
//                  as a clean table WHEN present, else body + notes only, numbers are
//                  NEVER invented; a barbershop service with empty ranges shows none)
//   · coverage   → shown only when areas.length > 0
//   · localContext → shown only when present
//   · testimonial  → shown only when present (real rating/text/author)
// If every sub-section is empty the whole block returns null.

function SubSection({
  surface,
  children,
}: {
  surface: 'tint' | 'white'
  children: ReactNode
}) {
  return (
    <section
      className="relative overflow-hidden"
      style={surface === 'tint' ? { backgroundColor: 'var(--fam-surface, transparent)', backgroundImage: 'var(--fam-grad-surface, var(--wow-grad-surface))' } : { backgroundColor: 'var(--fam-surface-2, #fff)' }}
    >
      <div className="container-x py-16 md:py-24">{children}</div>
    </section>
  )
}

export function ServiceDetailsBlock({
  service,
}: {
  service: ServicePageData
  variant?: string
}) {
  const { howPrice, scenarios, pricing, coverage, localContext, testimonial } = service

  const showHowPrice = howPrice.factors.length > 0
  const showScenarios = scenarios.cards.length > 0
  const showRanges = (pricing.ranges?.length ?? 0) > 0
  const showPricing = showRanges || pricing.notes.length > 0
  const showCoverage = coverage.areas.length > 0
  const showLocal = Boolean(localContext)
  const showTestimonial = Boolean(testimonial)

  const blocks: ReactNode[] = []

  if (showHowPrice) {
    blocks.push(
      <div key="howPrice">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-700">{tr('tmpl.pricingFactors')}</p>
          <h2 className="mt-3 font-display text-3xl leading-tight text-[var(--fam-ink,var(--color-ink-900))] sm:text-4xl">
            {howPrice.title}
          </h2>
          {howPrice.body && (
            <p className="mt-4 text-lg leading-relaxed text-[var(--fam-ink,var(--color-ink-700))]">{howPrice.body}</p>
          )}
        </div>
        <ul className="mt-10 space-y-6">
          {howPrice.factors.map((f, i) => (
            <li key={i} className="flex gap-5">
              <span
                aria-hidden
                className="w-12 shrink-0 font-display text-3xl"
                style={{
                  color: 'transparent',
                  backgroundImage: 'var(--wow-grad-brand)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-[var(--fam-ink,var(--color-ink-900))]">{f.title}</h3>
                <p className="mt-1 leading-relaxed text-[var(--fam-ink,var(--color-ink-700))]">{f.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>,
    )
  }

  if (showScenarios) {
    blocks.push(
      <div key="scenarios">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl leading-tight text-[var(--fam-ink,var(--color-ink-900))] sm:text-4xl">
            {scenarios.title}
          </h2>
          {scenarios.intro && (
            <p className="mt-4 text-lg leading-relaxed text-[var(--fam-ink,var(--color-ink-700))]">{scenarios.intro}</p>
          )}
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {scenarios.cards.map((c, i) => (
            <div
              key={i}
              className="rounded-2xl border bg-white/80 p-6 backdrop-blur-md"
              style={{
                borderColor: 'var(--fam-hairline, var(--wow-hairline))',
                boxShadow: 'var(--wow-shadow-soft)',
              }}
            >
              <h3 className="font-display text-lg leading-snug text-[var(--fam-ink,var(--color-ink-900))]">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--fam-ink-muted,var(--color-ink-500))]">{c.text}</p>
            </div>
          ))}
        </div>
      </div>,
    )
  }

  if (showPricing) {
    blocks.push(
      <div key="pricing">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl leading-tight text-[var(--fam-ink,var(--color-ink-900))] sm:text-4xl">
            {pricing.title}
          </h2>
          {pricing.body && (
            <p className="mt-4 text-lg leading-relaxed text-[var(--fam-ink,var(--color-ink-700))]">{pricing.body}</p>
          )}
        </div>
        {showRanges && pricing.ranges && (
          <div
            className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl border bg-white/85 backdrop-blur-md"
            style={{
              borderColor: 'var(--fam-hairline, var(--wow-hairline))',
              boxShadow: 'var(--wow-shadow-soft)',
            }}
          >
            <table className="w-full border-collapse text-left">
              <tbody>
                {pricing.ranges.map((r, i) => (
                  <tr
                    key={r.label}
                    style={i > 0 ? { borderTop: '1px solid var(--wow-hairline)' } : undefined}
                  >
                    <th
                      scope="row"
                      className="px-5 py-4 text-sm font-medium uppercase tracking-wider text-[var(--fam-ink-muted,var(--color-ink-500))]"
                    >
                      {r.label}
                    </th>
                    <td
                      className="px-5 py-4 text-right font-display text-xl text-brand-700"
                    >
                      {r.range}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {pricing.notes.length > 0 && (
          <ul
            className="mx-auto mt-10 max-w-2xl space-y-2 border-t pt-6"
            style={{ borderColor: 'var(--fam-hairline, var(--wow-hairline))' }}
          >
            {pricing.notes.map((n, i) => (
              <li key={i} className="flex items-start gap-3 leading-relaxed text-[var(--fam-ink,var(--color-ink-700))]">
                <span aria-hidden className="shrink-0 text-brand-600">
                  -
                </span>
                <span>{n}</span>
              </li>
            ))}
          </ul>
        )}
      </div>,
    )
  }

  if (showCoverage) {
    blocks.push(
      <div key="coverage">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl leading-tight text-[var(--fam-ink,var(--color-ink-900))] sm:text-4xl">
            {coverage.title}
          </h2>
          {coverage.intro && (
            <p className="mt-4 text-lg leading-relaxed text-[var(--fam-ink,var(--color-ink-700))]">{coverage.intro}</p>
          )}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {coverage.areas.map((a) => (
            <Link
              key={a.href}
              to={a.href}
              className="inline-flex items-center gap-1.5 rounded-full border bg-white/85 px-4 py-2 text-sm text-[var(--fam-ink,var(--color-ink-700))] backdrop-blur-md transition-colors hover:text-brand-700"
              style={{ borderColor: 'var(--fam-hairline, var(--wow-hairline))' }}
            >
              <MapPin className="h-3.5 w-3.5" /> {a.label}
            </Link>
          ))}
        </div>
      </div>,
    )
  }

  if (showLocal && localContext) {
    blocks.push(
      <div key="localContext" className="mx-auto max-w-3xl">
        <div
          className="rounded-3xl border bg-white/85 p-8 backdrop-blur-md md:p-10"
          style={{
            borderColor: 'var(--fam-hairline, var(--wow-hairline))',
            boxShadow: 'var(--wow-shadow-soft)',
          }}
        >
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white"
            style={{ backgroundImage: 'var(--wow-grad-brand)' }}
          >{tr('tmpl.localInsight')}</span>
          <h2 className="mt-4 font-display text-2xl leading-tight text-[var(--fam-ink,var(--color-ink-900))] sm:text-3xl">
            {localContext.title ?? 'Built for your neighborhood'}
          </h2>
          <div className="mt-5 space-y-4">
            {localContext.body.map((p, i) => (
              <p key={i} className="text-lg leading-relaxed text-[var(--fam-ink,var(--color-ink-700))]">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>,
    )
  }

  if (showTestimonial && testimonial) {
    blocks.push(
      <figure key="testimonial" className="mx-auto max-w-3xl text-center">
        <Quote
          aria-hidden
          className="mx-auto h-10 w-10"
          strokeWidth={1.25}
          style={{
            color: 'transparent',
            backgroundImage: 'var(--wow-grad-brand)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
          }}
          fill="currentColor"
        />
        <div className="mt-4 flex justify-center gap-0.5">
          {Array.from({ length: testimonial.rating ?? 5 }).map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <blockquote className="mt-4 font-display text-2xl leading-snug text-[var(--fam-ink,var(--color-ink-900))] md:text-3xl">
          “{testimonial.text}”
        </blockquote>
        <figcaption className="mt-6 text-[var(--fam-ink,var(--color-ink-700))]">
          <span className="font-semibold">{testimonial.author}</span>
          {testimonial.location && (
            <span className="text-ink-500"> · {testimonial.location}</span>
          )}
        </figcaption>
      </figure>,
    )
  }

  if (blocks.length === 0) return null

  return (
    <>
      {blocks.map((node, i) => (
        <SubSection key={i} surface={i % 2 === 0 ? 'tint' : 'white'}>
          {node}
        </SubSection>
      ))}
    </>
  )
}
