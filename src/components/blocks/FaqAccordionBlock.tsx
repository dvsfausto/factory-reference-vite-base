import { useState } from 'react'
import { tr } from '~/lib/i18n'
import { Plus } from 'lucide-react'
import { SITE } from '~/data/site'

// FAQ-section LAYOUT: 'accordion' — a DNA-tokened interactive accordion (distinct
// from the legacy ink-tokened FaqBlock/FAQSection). Character-agnostic. Reuses
// SITE.homeFaqs; self-omits when there are none.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700: emerald-600 toggle.
// Radius -> rounded-* (DNA). Font -> font-display (DNA). Light surface component-
// owned (white / slate / hairline #E6E8EC). No CTA by design. Never bg-brand-*.
export function FaqAccordionBlock({
  label = tr('section.faqLabel'),
  heading = tr('section.faq'),
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const faqs = SITE.homeFaqs
  const [open, setOpen] = useState<number | null>(0)
  if (!faqs || faqs.length === 0) return null
  return (
    <section className="bg-white">
      <div className="container-x py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              <span className="h-px w-6 bg-emerald-600" />
              {label}
            </span>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">
              {heading}
            </h2>
            {body && <p className="mt-4 text-lg leading-relaxed text-[#64748B]">{body}</p>}
          </div>

          <div className="mt-10 divide-y divide-[#E6E8EC] border-y border-[#E6E8EC]">
            {faqs.map((faq, i) => {
              const isOpen = open === i
              return (
                <div key={i}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start justify-between gap-4 py-6 text-left"
                  >
                    <span className="font-display text-lg font-semibold text-[#0F172A]">{faq.question}</span>
                    <Plus className={`mt-0.5 h-5 w-5 shrink-0 text-emerald-600 transition-transform ${isOpen ? 'rotate-45' : ''}`} />
                  </button>
                  {isOpen && <div className="pb-6 pr-8 leading-relaxed text-[#475569]">{faq.answer}</div>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
