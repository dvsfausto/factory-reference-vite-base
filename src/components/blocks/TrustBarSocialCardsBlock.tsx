import { SITE } from '~/data/site'
import { socialProfiles } from '~/lib/social-profiles'
import { hasText } from '~/lib/has-text'
import { tr } from '~/lib/i18n'
import { SocialIcon } from './SocialIcon'

// TrustBar LAYOUT: 'social-cards' (2026-10-12): a card per platform the owner links to, with the platform's
// mark, her follower count and a Follow button to her profile (new tab). Reads SITE.social (confirmed links) and SITE.stats
// (counts labelled with the platform's name). HONESTY: no confirmed link → no card; a count shows only with its date (`body`,
// e.g. "As of September 30, 2026."); no card at all → no section. A site gets it only if its layout chooses it.
//
// TOKEN DISCIPLINE: the section's ground and ink come from the family tokens or the owner's section style; the marks and the
// Follow button use the accent fill with the page ground as their ink (fam-accent / fam-on-accent).
export function TrustBarSocialCardsBlock({
  site = SITE,
  label,
  heading,
  body,
}: {
  site?: typeof SITE
  items?: { title: string; description: string; kind?: string | null }[]
  label?: string
  heading?: string
  body?: string
}) {
  const profiles = socialProfiles(site)
  if (profiles.length === 0) return null
  const dated = hasText(body)
  return (
    <section className="bg-fam-surface-2" data-social-cards="">
      <div className="container-x py-section">
        {(hasText(label) || hasText(heading)) && (
          <div className="max-w-2xl">
            {hasText(label) && (
              <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
                <span className="h-px w-6 bg-fam-accent" />
                {label}
              </span>
            )}
            {hasText(heading) && (
              <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">{heading}</h2>
            )}
          </div>
        )}
        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {profiles.map((p) => (
            <li key={p.key} className="flex flex-col rounded-3xl border border-white/15 bg-white/10 p-7 elev-2">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-fam-accent text-fam-on-accent">
                <SocialIcon platform={p.key} className="h-7 w-7" />
              </span>
              <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-fam-ink">{p.name}</h3>
              {dated && p.count && (
                <p className="mt-2">
                  <span className="font-display text-4xl font-semibold leading-none text-fam-ink">{p.count}</span>
                  <span className="ml-2 text-sm text-fam-ink-muted">{tr('section.followers')}</span>
                </p>
              )}
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${tr('section.followOn')} ${p.name}`}
                className="mt-7 inline-flex h-12 w-fit items-center rounded-full bg-fam-accent px-6 font-display text-sm font-bold text-fam-on-accent transition-transform hover:translate-y-(--hov-lift-sm) focus-ring"
              >
                {tr('section.follow')}
              </a>
            </li>
          ))}
        </ul>
        {dated && profiles.some((p) => p.count) && <p className="mt-6 text-sm text-fam-ink-muted">{body}</p>}
      </div>
    </section>
  )
}
