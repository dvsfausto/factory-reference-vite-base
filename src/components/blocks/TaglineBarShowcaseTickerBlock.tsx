import { SERVICES } from '~/data/services-view'
import { Diamond, CAPS } from '~/components/showcase/Primitives'

// taglineBar VARIANT: 'showcase-ticker' (the Showcase theme, 2026-10-29). A slow marquee band between two hairlines: the items
// in spaced capitals, a small gold diamond between them. Items: params.body split on '·'; none given, the service names. The
// sequence runs twice for a seamless loop (the copy is hidden from screen readers); a device asking for reduced motion gets
// it still (the shared .strip-track rule). Nothing to show: nothing.
export function TaglineBarShowcaseTickerBlock({ body }: { body?: string }) {
  const fromBody = (body ?? '').split('·').map((s) => s.trim()).filter(Boolean)
  const items = fromBody.length > 0 ? fromBody : SERVICES.map((s) => s.displayName).filter(Boolean)
  if (items.length === 0) return null
  // at least ~10 entries per loop so the band is always full on a wide screen
  const loop: string[] = []
  while (loop.length < 10) loop.push(...items)
  const dur = `${Math.max(30, loop.length * 4)}s`
  return (
    <section className="overflow-hidden border-y border-fam-hairline bg-fam-page py-6" data-showcase="ticker">
      <div className="strip-row" style={{ ['--strip-dur' as string]: dur }}>
        <ul className="strip-track m-0 flex w-max list-none items-center p-0">
          {[...loop, ...loop].map((t, i) => (
            <li key={i} aria-hidden={i >= items.length ? true : undefined} className="flex items-center">
              <span className={`${CAPS} whitespace-nowrap px-8 text-[12px] text-fam-ink`}>{t}</span>
              <Diamond />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
