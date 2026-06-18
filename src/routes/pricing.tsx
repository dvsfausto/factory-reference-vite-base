import { createFileRoute } from '@tanstack/react-router'
import { buildMeta } from '~/lib/seo'
import { SITE } from '~/data/site'
import { PRICING_LAYOUT, type PricingBlock } from '~/data/pricing-layout'
import { TrustBarBlock } from '~/components/blocks/TrustBarBlock'
import { FaqBlock } from '~/components/blocks/FaqBlock'
import { CtaBlock } from '~/components/blocks/CtaBlock'

export const Route = createFileRoute('/pricing')({
  head: () =>
    buildMeta({
      title: `Pricing — ${SITE.name}`,
      description: `Transparent pricing from ${SITE.name}.`,
      path: '/pricing',
    }),
  component: PricingPage,
})

// The /pricing page identity: heading + pricing prose. The one pricing-specific
// block (the rest of the page reuses the shared section library), DNA-tokened to
// match the composed sections below it. SITE.pricing is guarded so the section
// degrades gracefully to just the heading if the prose is absent.
function PricingIntro() {
  return (
    <section className="bg-white">
      <div className="container-x py-20 md:py-28">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            <span className="h-px w-6 bg-emerald-600" />
            Pricing
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">
            Honest, up-front pricing
          </h1>
          {SITE.pricing && (
            <p className="mt-6 text-lg leading-relaxed text-[#475569]">{SITE.pricing}</p>
          )}
        </div>
      </div>
    </section>
  )
}

// Inner-page block renderer — the pricing analogue of the homepage's renderBlock
// (mirrors about.tsx's renderAboutBlock). Maps a PricingBlock to its section: the
// page-specific 'intro' and reused library sections (trustBar, faq, cta). The faq
// block self-omits when there are no homepage FAQs. An unhandled type renders
// nothing (self-omitting, like the homepage path).
function renderPricingBlock(block: PricingBlock) {
  switch (block.type) {
    case 'intro':
      return <PricingIntro key="intro" />
    case 'trustBar':
      return <TrustBarBlock key="trustBar" />
    case 'faq':
      return SITE.homeFaqs && SITE.homeFaqs.length > 0 ? (
        <FaqBlock key="faq" faqs={SITE.homeFaqs} />
      ) : null
    case 'cta':
      return <CtaBlock key="cta" />
    default:
      return null
  }
}

function PricingPage() {
  return <>{PRICING_LAYOUT.map(renderPricingBlock)}</>
}
