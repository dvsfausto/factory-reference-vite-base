import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import type { AreaRef } from '~/lib/types/page-types'

interface Props {
  heading: string
  intro?: string
  areas: AreaRef[]
  mapEmbedUrl?: string
}

export function AreasSection({ heading, intro, areas, mapEmbedUrl }: Props) {
  if (areas.length === 0) return null
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {heading}
          </h2>
          {intro && (
            <p className="mt-4 text-lg leading-relaxed text-slate-700">{intro}</p>
          )}
        </div>
        {mapEmbedUrl && (
          <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <iframe
              src={mapEmbedUrl}
              title={tr('section.serviceAreaMap')}
              loading="lazy"
              className="h-[360px] w-full border-0"
            />
          </div>
        )}
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {areas.map((a) => (
            <li key={a.slug}>
              <Link
                to="/areas/$slug"
                params={{ slug: a.slug }}
                className="group block rounded-lg bg-slate-50 px-4 py-4 transition-colors hover:bg-emerald-50"
              >
                <p className="font-semibold text-slate-900 group-hover:text-emerald-700">
                  {a.name}
                  {a.tier === 'home-base' && (
                    <span className="ml-2 inline-flex items-center rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      Base
                    </span>
                  )}
                </p>
                {a.zipCodes && a.zipCodes.length > 0 && (
                  <p className="mt-1 text-xs text-slate-500">
                    {a.zipCodes.slice(0, 3).join(', ')}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
