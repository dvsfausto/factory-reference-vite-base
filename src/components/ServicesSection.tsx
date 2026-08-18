import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { serviceImageUrl } from '~/data/images'
import type { ServiceRef } from '~/lib/types/page-types'

interface Props {
  heading: string
  intro?: string
  services: ServiceRef[]
}

export function ServicesSection({ heading, intro, services }: Props) {
  if (services.length === 0) return null
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {heading}
          </h2>
          {intro && (
            <p className="mt-4 text-lg leading-relaxed text-slate-700">{intro}</p>
          )}
        </div>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            // Three-way separation: a NON-PAGED service (paged:false) stays VISIBLE here but renders
            // as a CARD, not an anchor — no /services/$slug link is created, so nothing can dangle.
            const paged = s.paged !== false
            const media = (
              <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={serviceImageUrl(s.slug)}
                  alt={s.name}
                  width={1200}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            )
            const body = (
              <div className="p-5">
                <p className="text-lg font-semibold text-slate-900 group-hover:text-emerald-700">
                  {s.name}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.short}</p>
                {paged && (
                  <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">{tr('common.learnMore')}<span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </p>
                )}
              </div>
            )
            return (
              <li key={s.slug}>
                {paged ? (
                  <Link
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="group block h-full overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-lg"
                  >
                    {media}
                    {body}
                  </Link>
                ) : (
                  <div className="group block h-full overflow-hidden rounded-2xl bg-white shadow-sm">
                    {media}
                    {body}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
