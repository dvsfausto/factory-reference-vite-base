import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { SITE } from '~/data/site'
import { SERVICES } from '~/data/services-view'
import { tr } from '~/lib/i18n'
import { hasText } from '~/lib/has-text'
import { readBakedSchedule } from '~/lib/useClassSchedule'
import { INVERSE_CARD, INVERSE_GROUND, INVERSE_LINE, INVERSE_MUTED } from '~/lib/inverse-tone'

// Services LAYOUT: 'program-cards' (2026-10-14). A band in the inverse tone: label and heading on the left, the body
// beside them, then up to four tall cards in a row (two on a tablet, one under the other on a phone), the first
// card in the page's own tone so it leads. A card is a published service (its short line, opening its page) or, when
// the site sells classes, a class from the owner's weekly schedule (the days it runs and its spots, opening /book).
// card<N>Service names which service or class (its slug, or the class name) sits in place N and card<N>Title
// retitles it; unset, services come first in their order, then the classes. Nothing is invented: no item, no card.
/** slug set → the service's page; unset → /book (a class) */
type Card = { key: string; title: string; body: string; slug?: string; cta: string }

const slugOf = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function classCards(): Card[] {
  if ((SITE as { sells?: { classes?: boolean } }).sells?.classes === false) return []
  const sessions = readBakedSchedule()
  const names = [...new Set(sessions.map((s) => s.serviceName).filter(hasText))]
  const dayKey = ['day.sun', 'day.mon', 'day.tue', 'day.wed', 'day.thu', 'day.fri', 'day.sat'] as const
  const order = [1, 2, 3, 4, 5, 6, 0]
  return names.map((name) => {
    const mine = sessions.filter((s) => s.serviceName === name)
    const days = [...new Set(mine.map((s) => s.day))].sort((a, b) => order.indexOf(a) - order.indexOf(b))
    // consecutive days read as a range ("Monday to Saturday"), otherwise listed
    const run = days.every((d, i) => i === 0 || order.indexOf(d) === order.indexOf(days[i - 1]!) + 1)
    const dayLine = days.length > 2 && run
      ? tr('programs.dayRange').replace('{from}', tr(dayKey[days[0]!])).replace('{to}', tr(dayKey[days[days.length - 1]!]))
      : days.map((d) => tr(dayKey[d])).join(', ')
    const caps = [...new Set(mine.map((s) => s.capacity).filter((c): c is number => typeof c === 'number'))]
    const capLine = caps.length === 1 ? tr('programs.perClass').replace('{n}', String(caps[0])) : ''
    return { key: slugOf(name), title: name, body: [dayLine, capLine].filter(Boolean).join(' · '), cta: tr('programs.seeSchedule') }
  })
}

export function ServicesProgramCardsBlock({
  services = SERVICES,
  label,
  heading,
  body,
  exploreLabel = tr('common.explore'),
  cards: picks,
}: {
  services?: typeof SERVICES
  label?: string
  heading?: string
  scriptAccent?: string
  body?: string
  exploreLabel?: string
  moreLink?: string
  /** card<N>Service / card<N>Title, N = 1..3 (the block text params) */
  cards?: { service?: string; title?: string }[]
}) {
  const pool: Card[] = [
    ...services.map((s) => ({ key: s.slug, title: s.displayName, body: s.short, slug: s.slug, cta: exploreLabel })),
    ...classCards(),
  ]
  const ordered: Card[] = []
  for (const p of picks ?? []) {
    const want = hasText(p.service) ? slugOf(p.service) : ''
    const hit = want ? pool.find((c) => c.key === want && !ordered.includes(c)) : undefined
    if (hit) ordered.push(hit)
  }
  for (const c of pool) if (!ordered.includes(c)) ordered.push(c)
  // the owner's title for place N wins over the item's own name
  const shown = ordered.slice(0, 4).map((c, i) => ({ ...c, title: picks?.[i]?.title?.trim() || c.title }))
  if (shown.length === 0) return null
  const cols = shown.length >= 4 ? 'lg:grid-cols-4' : shown.length === 3 ? 'lg:grid-cols-3' : shown.length === 2 ? 'lg:grid-cols-2' : ''
  return (
    <section style={INVERSE_GROUND} data-block="servicesPreview" data-variant="program-cards">
      <div className="container-x py-section">
        {(hasText(label) || hasText(heading) || hasText(body)) && (
          <div className="mb-9 flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-8">
            <div>
              {hasText(label) && <p className="text-[11px] font-bold uppercase tracking-[0.2em]">{label}</p>}
              {hasText(heading) && (
                <h2 style={{ color: 'inherit' }} className="mt-4 max-w-[40rem] font-display text-[clamp(2.4rem,4.6vw,4.1rem)] font-bold leading-[1.06] tracking-[-0.01em]">{heading}</h2>
              )}
            </div>
            {hasText(body) && <p style={INVERSE_MUTED} className="max-w-[17rem] text-sm leading-[1.7]">{body}</p>}
          </div>
        )}
        <div className={`grid gap-3.5 sm:grid-cols-2 ${cols}`}>
          {shown.map((c, i) => {
            const lead = i === 0
            return (
              <article
                key={c.key}
                className={`group flex min-h-[240px] flex-col px-6 py-7 sm:min-h-[300px] transition-transform duration-(--motion-fast) hover:translate-y-(--hov-lift-sm) ${lead ? 'bg-fam-page text-fam-ink' : ''}`}
                style={lead ? undefined : INVERSE_CARD}
              >
                <p className={`text-[11px] tracking-[0.2em] ${lead ? 'text-fam-ink-muted' : ''}`} style={lead ? undefined : INVERSE_MUTED}>
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 style={{ color: 'inherit' }} className="mt-8 font-display text-[1.75rem] sm:mt-10 font-bold leading-[1.05]">{c.title}</h3>
                {hasText(c.body) && (
                  <p className={`mt-4 text-[13px] leading-[1.7] ${lead ? 'text-fam-ink-muted' : ''}`} style={lead ? undefined : INVERSE_MUTED}>{c.body}</p>
                )}
                {(() => {
                  const cls = `mt-auto flex items-center justify-between gap-3 border-t pt-4 text-xs font-bold ${lead ? 'border-fam-hairline text-fam-accent-text' : ''}`
                  const st = lead ? undefined : { borderColor: INVERSE_LINE }
                  const inner = (
                    <>
                      <span>{c.cta}<span className="sr-only">: {c.title}</span></span>
                      <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" />
                    </>
                  )
                  return c.slug
                    ? <Link to="/services/$slug" params={{ slug: c.slug }} className={cls} style={st}>{inner}</Link>
                    : <Link to="/book" className={cls} style={st}>{inner}</Link>
                })()}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
