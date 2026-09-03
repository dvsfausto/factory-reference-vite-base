import type { TeamMember } from './team-variants'
import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'

// Team LAYOUT: 'spotlight', one member carries real editorial weight (a large
// portrait and bio in a prominent panel), with the rest of the team listed beside
// as compact rows. Character-agnostic. Good for an owner/founder-led story.
//
// DATA-DRIVEN + OPTIONAL: members read from optional SITE.team via inline cast
// (the SITE.surface / video_url precedent); the data/type files stay untouched.
// Absent or empty SITE.team -> the section OMITS itself (returns null), NEVER
// fabricates people. Missing photo -> tasteful initials avatar. With a single
// member the supporting column simply omits.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) restricted to 50/100/600/700:
// emerald-50 portrait wash + avatar chips, emerald-600 role. Radius -> rounded-*
// (DNA). Font -> font-display (DNA). Light surface component-owned (white / slate
// / #E6E8EC). No CTA by design. Never bg-brand-* / .btn.
function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function TeamSpotlightBlock({
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
  const [lead, ...rest] = team
  const supporting = rest.slice(0, 5)
  return (
    <section className="bg-white">
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

        <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:gap-12">
          <figure className="lg:col-span-2">
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="aspect-[4/5] overflow-hidden rounded-3xl border border-[#E6E8EC] bg-[#F8FAFC]">
                {lead.photo ? (
                  <img
                    src={lead.photo}
                    alt={lead.name}
                    loading="lazy"
                    width={720}
                    height={900}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-emerald-50">
                    <span className="font-display text-6xl font-semibold text-emerald-600">{initials(lead.name)}</span>
                  </div>
                )}
              </div>
              <figcaption className="flex flex-col justify-center">
                <h3 className="font-display text-3xl font-semibold tracking-tight text-[#0F172A]">{lead.name}</h3>
                {lead.role && <p className="mt-2 font-display text-base font-semibold text-emerald-600">{lead.role}</p>}
                {lead.bio && <p className="mt-5 text-lg leading-relaxed text-[#64748B]">{lead.bio}</p>}
              </figcaption>
            </div>
          </figure>

          {supporting.length > 0 && (
            <div className="flex flex-col divide-y divide-[#E6E8EC] border-t border-[#E6E8EC] lg:border-t-0">
              {supporting.map((m, i) => (
                <div key={`${m.name}-${i}`} className="flex items-center gap-4 py-5 first:pt-0 lg:first:pt-5">
                  <span className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-emerald-50">
                    {m.photo ? (
                      <img src={m.photo} alt={m.name} loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <span className="grid h-full w-full place-items-center font-display text-base font-semibold text-emerald-600">
                        {initials(m.name)}
                      </span>
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display font-semibold text-[#0F172A]">{m.name}</span>
                    {m.role && <span className="block text-sm text-emerald-600">{m.role}</span>}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
