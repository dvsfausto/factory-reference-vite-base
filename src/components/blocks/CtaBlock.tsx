import { CTASection } from '~/components/CTASection'
import { renderCharacterCta } from '~/components/CharacterHero'

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
  // Character sites get the character CTA (elegant/bold/…); known verticals → null → the default
  // CTASection, byte-identical. Fixes the default-blue CTA leaking onto /about + /pricing (which
  // render CtaBlock directly, outside the homepage's variant-map).
  return renderCharacterCta({ title, subtitle }) ?? <CTASection title={title} subtitle={subtitle} />
}
