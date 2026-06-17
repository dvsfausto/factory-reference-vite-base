import type { Testimonial } from '~/lib/types/page-types'

interface Props {
  heading: string
  intro?: string
  testimonials: Testimonial[]
}

export function TestimonialsSection({ heading, intro, testimonials }: Props) {
  if (testimonials.length === 0) return null
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {heading}
          </h2>
          {intro && (
            <p className="mt-4 text-lg leading-relaxed text-slate-700">{intro}</p>
          )}
        </div>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <li
              key={i}
              className="flex flex-col rounded-2xl bg-white p-6 shadow-sm"
            >
              {typeof t.rating === 'number' && t.rating > 0 && (
                <div
                  aria-label={`${t.rating} of 5 stars`}
                  className="mb-4 flex gap-0.5 text-amber-500"
                >
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <span key={idx} aria-hidden>
                      {idx < t.rating! ? '★' : '☆'}
                    </span>
                  ))}
                </div>
              )}
              <blockquote className="flex-1 text-base leading-relaxed text-slate-800">
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <footer className="mt-5 border-t border-slate-200 pt-4 text-sm">
                <p className="font-semibold text-slate-900">{t.author}</p>
                {t.location && (
                  <p className="mt-0.5 text-slate-500">{t.location}</p>
                )}
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
