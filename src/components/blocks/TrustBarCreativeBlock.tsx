// TrustBar VARIANT: 'creative', bold, expressive value points. Big magenta
// numerals + expressive headings on a light surface, off-balance and confident.
// No round icon-circles, no brand color. Prop signature identical to TrustBarBlock;
// returns an Element (NOT null).
//
// TOKEN DISCIPLINE: emerald-* (DNA → magenta) numerals; expressive light surface
// (off-white #FBFAFC) + ink text component-owned; rounded-* (DNA); font-display.
// No brand-* literals, no .btn.
export function TrustBarCreativeBlock({
  items = [],
}: {
  items?: { title: string; description: string }[]
}) {
  if (!items.length) return null // no trust facts → no section; never an invented one (niche arc 2b)
  return (
    <section className="bg-fam-surface-2">
      <div className="container-x py-section">
        <div className={`grid grid-cols-1 gap-10 ${items.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          {items.map((item, i) => (
            <div key={i} className="flex flex-col items-start">
              <span className="font-display text-5xl font-extrabold leading-none text-fam-accent-text">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-fam-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-fam-ink-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
