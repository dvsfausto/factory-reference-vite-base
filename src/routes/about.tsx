import { createFileRoute } from '@tanstack/react-router'
import { buildMeta } from '~/lib/seo'
import { SITE } from '~/data/site'
import { resolveCharacterTokens } from '~/lib/character-tokens'
import { ABOUT_LAYOUT, type AboutBlock } from '~/data/about-layout'
import { TEAM_VARIANTS } from '~/components/blocks/team-variants'
import { TeamGridBlock } from '~/components/blocks/TeamGridBlock'
import { TrustBarBlock } from '~/components/blocks/TrustBarBlock'
import { CtaBlock } from '~/components/blocks/CtaBlock'

export const Route = createFileRoute('/about')({
  head: () =>
    buildMeta({
      title: `About ${SITE.name}`,
      description: `Local team. Honest work. ${SITE.tagline}`,
      path: '/about',
    }),
  component: AboutPage,
})

// The /about page identity: name + tagline + about prose. The one about-specific
// block (the rest of the page reuses the shared section library), DNA-tokened to
// match the composed sections below it.
function AboutIntro() {
  const T = resolveCharacterTokens()
  return (
    <section className={T?.section ?? "bg-white"}>
      <div className="container-x py-20 md:py-28">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            <span className="h-px w-6 bg-emerald-600" />
            About
          </span>
          <h1 className={`mt-5 font-display text-4xl font-semibold leading-tight tracking-tight ${T?.text ?? "text-[#0F172A]"} sm:text-5xl`}>
            About {SITE.name}
          </h1>
          <p className={`mt-5 text-xl leading-relaxed ${T?.muted ?? "text-[#64748B]"}`}>{SITE.tagline}</p>
          {SITE.about && (
            <p className={`mt-6 text-lg leading-relaxed ${T?.muted ?? "text-[#475569]"}`}>{SITE.about}</p>
          )}
        </div>
      </div>
    </section>
  )
}

// Inner-page block renderer — the about analogue of the homepage's renderBlock.
// Maps an AboutBlock to its section: the page-specific 'intro', the new team
// section (via TEAM_VARIANTS), and reused library sections (trustBar, cta). An
// unhandled type renders nothing (self-omitting, like the homepage path).
function renderAboutBlock(block: AboutBlock) {
  switch (block.type) {
    case 'intro':
      return <AboutIntro key="intro" />
    case 'team': {
      const TeamComponent = TEAM_VARIANTS[block.variant ?? ''] ?? TeamGridBlock
      return (
        <TeamComponent
          key="team"
          label={block.params?.label as string | undefined}
          heading={block.params?.heading as string | undefined}
          body={block.params?.body as string | undefined}
        />
      )
    }
    case 'trustBar':
      return <TrustBarBlock key="trustBar" />
    case 'cta':
      return <CtaBlock key="cta" />
    default:
      return null
  }
}

function AboutPage() {
  return <>{ABOUT_LAYOUT.map(renderAboutBlock)}</>
}
