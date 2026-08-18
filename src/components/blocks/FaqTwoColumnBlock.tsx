import { SITE } from '~/data/site'
import { tr } from '~/lib/i18n'

// FAQ-section LAYOUT: 'two-column' — every question and answer shown at once in a
// two-column grid (no accordion). Character-agnostic. The scannable, all-open
// option for shorter answer sets. Reuses SITE.homeFaqs; self-omits when none.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700: emerald-600 rule.
// Radius -> rounded-* (DNA). Font -> font-display (DNA). Cool surface component-
// owned (#F8FAFC / slate / #E6E8EC). No CTA by design. Never bg-brand-* / .btn.
export function FaqTwoColumnBlock({
  label = tr('section.faqLabel'),
  heading = tr('section.questionsAnswered'),
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const faqs = SITE.homeFaqs
  if (!faqs || faqs.length === 0) return null
  return (
    <section className="bg-[#F8FAFC]">
      <div className="container-x py-20 md:py-28">
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

        <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border-t border-[#E6E8EC] pt-6">
              <h3 className="flex items-start gap-2.5 font-display text-lg font-semibold text-[#0F172A]">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                {faq.question}
              </h3>
              <p className="mt-2 pl-4 leading-relaxed text-[#475569]">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
