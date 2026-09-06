// TrustBar VARIANT: 'creative', bold, expressive value points. Big magenta
// numerals + expressive headings on a light surface, off-balance and confident.
// No round icon-circles, no brand color. Prop signature identical to TrustBarBlock;
// returns an Element (NOT null).
//
// TOKEN DISCIPLINE: emerald-* (DNA → magenta) numerals; expressive light surface
// (off-white #FBFAFC) + ink text component-owned; rounded-* (DNA); font-display.
// No brand-* literals, no .btn.
export function TrustBarCreativeBlock({
  items = [
    {
      title: 'Free estimates',
      description: 'Clear quotes up front, no surprises after the work.',
    },
    {
      title: 'On schedule',
      description: 'We show up when we say we will, and keep you posted.',
    },
    {
      title: 'Local team',
      description: 'Familiar faces and real accountability, close to home.',
    },
  ],
}: {
  items?: { title: string; description: string }[]
}) {
  return (
    <section className="bg-[#FBFAFC]">
      <div className="container-x py-16 md:py-20">
        <div className={`grid grid-cols-1 gap-10 ${items.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          {items.map((item, i) => (
            <div key={i} className="flex flex-col items-start">
              <span className="font-display text-5xl font-extrabold leading-none text-emerald-600">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-[#18181B]">
                {item.title}
              </h3>
              <p className="mt-2 text-[#71717A]">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
