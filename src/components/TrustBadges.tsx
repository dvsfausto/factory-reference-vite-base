interface Props {
  items: string[]
}

export function TrustBadges({ items }: Props) {
  if (items.length === 0) return null
  return (
    <section className="border-y border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-700">
          {items.map((item) => (
            <li key={item} className="inline-flex items-center gap-2">
              <span aria-hidden className="text-emerald-600">
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
