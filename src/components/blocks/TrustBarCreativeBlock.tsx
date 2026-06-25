// TrustBar VARIANT: 'creative' — bold, expressive value points. Big magenta
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
      title: 'Brand & identity',
      description: 'Logos, systems, and stories that actually feel like you.',
    },
    {
      title: 'Web & digital',
      description: 'Sites and products designed to be seen and remembered.',
    },
    {
      title: 'Art direction',
      description: 'A point of view, applied across everything you make.',
    },
  ],
}: {
  items?: { title: string; description: string }[]
}) {
  return (
    <section className="bg-[#FBFAFC]">
      <div className="container-x py-16 md:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
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
