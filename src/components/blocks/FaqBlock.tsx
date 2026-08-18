import { FAQSection } from '~/components/FAQSection'
import { tr } from '~/lib/i18n'
import type { FAQ } from '~/lib/types/page-types'

// Markup extracted VERBATIM from routes/index.tsx (the FAQ section).
// `faqs` is supplied by the route (HOME_FAQS — the scaffolder-target constant
// kept in index.tsx). `title` defaults to today's literal; the optional param
// is the contract's override channel (unused by the default layout).
export function FaqBlock({
  faqs,
  title = tr('section.faq'),
}: {
  faqs: FAQ[]
  title?: string
}) {
  return <FAQSection faqs={faqs} title={title} />
}
