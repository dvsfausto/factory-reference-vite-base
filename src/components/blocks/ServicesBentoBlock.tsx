import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { ArrowUpRight } from 'lucide-react'
import { SITE } from '~/data/site'
import { SERVICES } from '~/data/services-view'
import { serviceImageUrl } from '~/data/images'

// ServicesPreview LAYOUT: 'bento', an asymmetric, mixed-size tile grid (the
// modern top-of-class look): a large feature tile anchors the composition while
// wide and standard tiles fill around it, each a photo under a legibility scrim
// with the service name set on top. Character-agnostic.
//
// Genuinely asymmetric (not a grid with random gaps): tile spans follow a
// deterministic col/row pattern by position, and an OPTIONAL per-item size hint
// can override it, read via inline cast (s as { size? }), the SITE.surface /
// video_url precedent, so the data file stays untouched and a missing hint simply
// falls back to the positional pattern. Images via serviceImageUrl (slug-resolved,
// hero fallback) so a photo-less business still renders.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary / text-primary-foreground (BRAND-
// owned). Accent -> emerald-* (DNA) restricted to 50/100/600/700. Radius ->
// rounded-* (DNA). Font -> font-display (DNA). Dark scrim (slate-950) component-
// owned for legibility over any photo. Never bg-brand-* / .btn.
//
// Identity copy read from SITE.homeServices via inline cast. Prop signature
// identical to ServicesPreviewBlock; returns Element | null.
export function ServicesBentoBlock({
  label,
  heading,
  body,
  moreLink = tr('common.allServices'),
}: {
  label?: string
  heading?: string
  scriptAccent?: string
  body?: string
  exploreLabel?: string
  moreLink?: string
}) {
  const hs = (SITE as { homeServices?: { label?: string; heading?: string; body?: string } }).homeServices
  const tiles = SERVICES.slice(0, 5)
  if (tiles.length === 0) return null

  // Deterministic span pattern (col/row) keyed by position, the first tile is the
  // large feature; the rest alternate wide and standard for a balanced asymmetry.
  const pattern = [
    'sm:col-span-2 sm:row-span-2',
    'sm:col-span-2 sm:row-span-1',
    'sm:col-span-1 sm:row-span-1',
    'sm:col-span-1 sm:row-span-1',
    'sm:col-span-2 sm:row-span-1',
    'sm:col-span-2 sm:row-span-1',
  ]
  const hintToSpan: Record<string, string> = {
    lg: 'sm:col-span-2 sm:row-span-2',
    wide: 'sm:col-span-2 sm:row-span-1',
    tall: 'sm:col-span-1 sm:row-span-2',
    sm: 'sm:col-span-1 sm:row-span-1',
  }

  return (
    <section className="bg-white">
      <div className="container-x py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            <span className="h-px w-6 bg-emerald-600" />
            {label ?? hs?.label ?? 'Our services'}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">
            {heading ?? hs?.heading ?? 'What we do'}
          </h2>
          {(body ?? hs?.body) && (
            <p className="mt-4 text-lg leading-relaxed text-[#64748B]">{body ?? hs?.body}</p>
          )}
        </div>

        <div className="mt-12 grid auto-rows-[200px] grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:auto-rows-[230px]">
          {tiles.map((s, i) => {
            const hint = (s as { size?: string }).size
            const span = (hint && hintToSpan[hint]) ?? pattern[i] ?? 'sm:col-span-1 sm:row-span-1'
            return (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className={`group relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-slate-950 ${span}`}
              >
                <img
                  src={serviceImageUrl(s.slug)}
                  alt={s.name}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                <div className="flex items-end justify-between gap-3 p-6">
                  <h3 className={`font-display font-semibold tracking-tight text-white drop-shadow-sm ${i === 0 ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
                    {s.displayName}
                  </h3>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors group-hover:bg-emerald-600">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {SERVICES.length > tiles.length && (
          <div className="mt-12">
            <Link
              to="/services"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-7 font-display text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {moreLink} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
