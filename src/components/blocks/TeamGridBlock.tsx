import type { TeamMember } from './team-variants'
import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'
import { resolveCharacterTokens } from '~/lib/character-tokens'

// Team LAYOUT: 'grid', an even grid of team member cards (photo, name, role,
// optional bio). Character-agnostic, the default team composition.
//
// DATA-DRIVEN + OPTIONAL: members are read from an optional SITE.team via inline
// cast (the SITE.surface / hero video_url / homeServices precedent). The data and
// type files stay untouched. When SITE.team is absent or empty the section OMITS
// ITSELF (returns null), it NEVER fabricates people. Per-member photo is optional
// too: a missing photo falls back to a tasteful initials avatar, not a broken img.
// Real team data later: the scaffolder emits SITE.team from intake, exactly as it
// emits homeServices / about.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) restricted to 50/100/600/700:
// emerald-50 avatar chip, emerald-600 role. Radius -> rounded-* (DNA). Font ->
// font-display (DNA). Light surface component-owned (white / slate / #E6E8EC). No
// CTA in this section by design. Never bg-brand-* / .btn.
function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function TeamGridBlock({
  site = SITE,
  label = tr('section.ourTeam'),
  heading = tr('section.meetTheTeam'),
  body,
}: {
  site?: typeof SITE
  label?: string
  heading?: string
  scriptAccent?: string
  body?: string
}) {
  const team = (site as { team?: TeamMember[] }).team
  if (!team || team.length === 0) return null
  const members = team.slice(0, 8)
  // Character surface tokens (null for known verticals → the literals below, byte-identical).
  const T = resolveCharacterTokens()
  return (
    <section className={T?.section ?? "bg-white"}>
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

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m, i) => (
            <div key={`${m.name}-${i}`} className="flex flex-col">
              <div className={T ? `aspect-[4/5] overflow-hidden ${T.cardRadius} border ${T.border} ${T.card}` : "aspect-[4/5] overflow-hidden rounded-2xl border border-[#E6E8EC] bg-[#F8FAFC]"}>
                {m.photo ? (
                  <img
                    src={m.photo}
                    alt={m.name}
                    loading="lazy"
                    width={640}
                    height={800}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-emerald-50">
                    <span className="font-display text-4xl font-semibold text-emerald-600">{initials(m.name)}</span>
                  </div>
                )}
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-[#0F172A]">{m.name}</h3>
              {m.role && <p className="mt-1 font-display text-sm font-semibold text-emerald-600">{m.role}</p>}
              {m.bio && <p className="mt-3 text-sm leading-relaxed text-[#64748B]">{m.bio}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
