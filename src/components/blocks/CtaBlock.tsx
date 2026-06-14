import { CTASection } from '~/components/CTASection'

// Markup extracted VERBATIM from routes/index.tsx (the CTA section).
// Always renders (CTASection emits its own <section>).
export function CtaBlock() {
  return (
    <CTASection
      title="Ready when you are."
      subtitle="Quote in 24 hours. No pressure."
    />
  )
}
