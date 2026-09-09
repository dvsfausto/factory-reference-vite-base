import { SITE } from '~/data/site'
import { tr } from '~/lib/i18n'

// FAQ-section LAYOUT: 'list', a single-column, type-forward open list of
// questions and answers with generous spacing and numbered prompts. Character-
// agnostic. Editorial restraint, all answers visible. Reuses SITE.homeFaqs;
// self-omits when none.
//
// TOKEN DISCIPLINE: accent -> fam-accent-* (DNA) 50/100/600/700: fam-accent ordinal.
// Radius -> rounded-* (DNA). Font -> font-display (DNA). Light surface component-
// owned (white / slate / hairline #E6E8EC). No CTA by design. Never bg-brand-*.
export function FaqListBlock({
  site = SITE,
  label = tr('section.faqLabel'),
  heading = tr('section.faq'),
  body,
}: {
  site?: typeof SITE
  label?: string
  heading?: string
  body?: string
}) {
  const faqs = site.homeFaqs
  if (!faqs || faqs.length === 0) return null
  return (
    <section className="bg-fam-card">
      <div className="container-x py-section">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
            <span className="h-px w-6 bg-fam-accent" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">
            {heading}
          </h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-fam-ink-muted">{body}</p>}
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          {faqs.map((faq, i) => (
            <div key={i} className="grid grid-cols-1 gap-2 border-t border-fam-hairline py-8 md:grid-cols-12 md:gap-8">
              <div className="flex items-baseline gap-3 md:col-span-5">
                <span className="font-display text-sm font-semibold text-fam-accent-text">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-display text-xl font-semibold leading-snug tracking-tight text-fam-ink">{faq.question}</h3>
              </div>
              <p className="leading-relaxed text-fam-ink-muted md:col-span-7">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
