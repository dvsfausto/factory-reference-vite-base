// TrustBar LAYOUT: 'stat-numbers' — the trust points rendered as a row of metric
// figures: a large display number over a compact label. Character-agnostic.
// Real metric display, not decoration — the number leads and the eye reads the
// proof at a glance.
//
// The figure is DATA and OPTIONAL: each item may carry a `stat` (e.g. "500+",
// "15 yrs", "4.9") read via inline cast (the SITE.surface / hero video_url
// precedent). The data/types files stay untouched; when an item has no stat the
// cell GRACEFULLY falls back to its title at display scale (an emphasis figure,
// never a fabricated number).
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) restricted to 50/100/600/700:
// emerald-600 figure. Radius -> rounded-* (DNA). Font -> font-display (DNA). Cool
// light surface component-owned (#F6F7F9 / slate / hairline #E6E8EC). No CTA in
// this block by design. Never bg-brand-* / .btn.
//
// Prop signature identical to TrustBarBlock; returns an Element (no null).
export function TrustBarStatNumbersBlock({
  items = [
    { title: 'Licensed & insured', description: 'Proper credentials and full coverage.' },
    { title: 'Same-day quotes', description: 'A reply within a business day.' },
    { title: 'Local team', description: 'Familiar faces and real accountability.' },
  ],
}: {
  items?: { title: string; description: string }[]
}) {
  return (
    <section className="bg-[#F6F7F9]">
      <div className="container-x py-14 md:py-16">
        <div className="grid grid-cols-1 divide-y divide-[#E6E8EC] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {items.map((item, i) => {
            const stat = (item as { stat?: string }).stat
            return (
              <div key={i} className="flex flex-col items-center px-6 py-6 text-center sm:py-2">
                {stat ? (
                  <>
                    <span className="font-display text-5xl font-semibold tracking-tight text-emerald-600 sm:text-6xl">
                      {stat}
                    </span>
                    <span className="mt-3 font-display text-base font-semibold text-[#0F172A]">{item.title}</span>
                    <span className="mt-1 text-sm text-[#64748B]">{item.description}</span>
                  </>
                ) : (
                  <>
                    <span className="font-display text-2xl font-semibold tracking-tight text-[#0F172A] sm:text-3xl">
                      {item.title}
                    </span>
                    <span className="mt-2 text-sm text-[#64748B]">{item.description}</span>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
