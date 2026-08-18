import { CTASection } from '~/components/CTASection'
import { renderCharacterCta } from '~/components/CharacterHero'
import { SITE } from '~/data/site'

// Markup extracted VERBATIM from routes/index.tsx (the CTA section).
// Always renders (CTASection emits its own <section>).
// Copy precedence (matches every character CTA variant): a layout param override > SITE.homeCta
// (the generated homepage-copy wave's CTA prose, or the vertical's identity copy) > today's literals.
// Absent SITE.homeCta → byte-identical to before.
export function CtaBlock({
  title: titleProp,
  subtitle: subtitleProp,
}: {
  title?: string
  subtitle?: string
}) {
  const homeCta = (SITE as { homeCta?: { title?: string; subtitle?: string } }).homeCta
  const title = titleProp ?? homeCta?.title ?? 'Ready when you are.'
  const subtitle = subtitleProp ?? homeCta?.subtitle ?? 'Quote in 24 hours. No pressure.'
  // Character sites get the character CTA (elegant/bold/…); known verticals → null → the default
  // CTASection, byte-identical. Fixes the default-blue CTA leaking onto /about + /pricing (which
  // render CtaBlock directly, outside the homepage's variant-map).
  return renderCharacterCta({ title, subtitle }) ?? <CTASection title={title} subtitle={subtitle} />
}
