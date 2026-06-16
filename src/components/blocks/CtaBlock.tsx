import { CTASection } from '~/components/CTASection'

// Markup extracted VERBATIM from routes/index.tsx (the CTA section).
// Always renders (CTASection emits its own <section>).
// `title`/`subtitle` default to today's literals; the optional params are the
// contract's override channel (unused by the default layout, exactly like
// FaqBlock.title) — so the rendered page stays byte-identical until a layout
// supplies an override.
export function CtaBlock({
  title = 'Ready when you are.',
  subtitle = 'Quote in 24 hours. No pressure.',
}: {
  title?: string
  subtitle?: string
}) {
  return <CTASection title={title} subtitle={subtitle} />
}
