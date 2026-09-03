import { SITE } from '~/data/site'

// Markup extracted VERBATIM from routes/index.tsx (the TAGLINE BAR section).
// Self-omits when SITE.tagline is empty, exactly today's `{SITE.tagline && …}`.
export function TaglineBarBlock({
  site = SITE,
}: {
  site?: typeof SITE
}) {
  if (!site.tagline) return null
  return (
    <section className="bg-brand-900 text-white">
      <div className="container-x py-5 text-center">
        <p className="font-display text-lg md:text-xl">{site.tagline}</p>
      </div>
    </section>
  )
}
