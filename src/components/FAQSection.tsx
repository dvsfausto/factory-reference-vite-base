import { useState } from 'react'
import type { FAQ } from '~/lib/types/page-types'

interface Props {
  faqs: FAQ[]
  title?: string
  intro?: string
}

export function FAQSection({ faqs, title = 'Frequently asked questions', intro }: Props) {
  const [open, setOpen] = useState<number | null>(0)
  if (faqs.length === 0) return null

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </h2>
        {intro && (
          <p className="mt-4 text-lg leading-relaxed text-slate-700">{intro}</p>
        )}
        <ul className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-6 py-5 text-left transition-colors hover:text-emerald-700"
                >
                  <span className="text-lg font-semibold leading-snug text-slate-900">
                    {faq.question}
                  </span>
                  <span
                    aria-hidden
                    className={`mt-1 shrink-0 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    ▾
                  </span>
                </button>
                {isOpen && (
                  <div className="pb-6 pr-10">
                    <p className="text-base leading-relaxed text-slate-700">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
