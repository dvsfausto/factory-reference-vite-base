import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'

// ★★★ A REAL MAP (the local SEO arc, A2, 2026-09-25). The business's own coordinates, from its Google listing or its geocoded
// address, on an embedded Google map, with a link that opens the listing in Google Maps. OMIT-WHEN-ABSENT: a site with no
// coordinates renders nothing here (the decorative coverage panels stay what they were). Keyless embed: no API key, no quota.
// The iframe loads lazily and after the page is readable; the link works before any script runs.
export function MapRealEmbedBlock({
  label = tr('section.coverage'),
  heading = tr('map.findUs'),
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const geo = (SITE as { geo?: { lat: number; lng: number } }).geo
  if (!geo || !Number.isFinite(geo.lat) || !Number.isFinite(geo.lng)) return null
  const placeId = (SITE as { googlePlaceId?: string }).googlePlaceId
  const q = `${geo.lat},${geo.lng}`
  const embed = `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=15&hl=${encodeURIComponent(tr('map.lang'))}&output=embed`
  const open = placeId
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}&query_place_id=${encodeURIComponent(placeId)}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
  const address = (SITE as { fullAddress?: string }).fullAddress
  return (
    <section className="bg-fam-card" data-block="map-real">
      <div className="container-x py-section">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
            <span className="h-px w-6 bg-fam-accent" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">{heading}</h2>
          {(body || address) && <p className="mt-4 text-lg leading-relaxed text-fam-ink-muted">{body ?? address}</p>}
        </div>
        <div className="mt-10 overflow-hidden rounded-3xl border border-fam-hairline">
          <iframe
            title={`${SITE.name} · ${tr('map.findUs')}`}
            src={embed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="block h-[360px] w-full sm:h-[440px]"
          />
        </div>
        <a href={open} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center text-sm font-semibold text-fam-accent-text-strong underline-offset-4 hover:underline">
          {tr('map.openInGoogleMaps')}
        </a>
      </div>
    </section>
  )
}
