import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { SITE } from '~/data/site'
import { tr } from '~/lib/i18n'
import { hasText } from '~/lib/has-text'
import { primaryCta } from '~/lib/primaryCta'
import { moneyShort, SITE_CURRENCY } from '~/lib/money'
import { useClassSchedule, type ClassSession } from '~/lib/useClassSchedule'
import { INVERSE_GROUND, INVERSE_MUTED } from '~/lib/inverse-tone'
import { usePacksForSale } from './PacksForSale'
import { PrimaryCta } from './PrimaryCta'

// Class schedule LAYOUT: 'connected' (2026-10-14, the trainer-led homepage). A band in the inverse tone: on the left the label,
// the heading, the body's lines as a short list (what a customer can really do) and the affordance button; on the right a phone.
// ★ THE PHONE IS THE REFERENCE'S, VALUE FOR VALUE (Fausto 10-14, LEGADO_Source.html `.phone`): 335px max, 8px bezel, 42px corners,
// padding 26/19/18, rotate(3deg), shadow 18px 28px 55px at 15%; status row 10px bold with 27px under it; brand line 11px/700/2.4px
// tracked; title 28px, -1px tracking, 12px over and 5px under; sub line 11px; day strip 10px with 25px over and under, each day on
// a 2.5 line height with a 30px pill; the dark card 23/18 padding, 14px corners, 20px over and under, its label 9px, its title
// 25px with 18px over and under, its bar 12/16 padding, 6px corners, 20px over, 13px/700, 28px gap; rows 15px padding, 12px, a 1px
// rule; the tab bar 24px over, 10px, the first bold. On a phone: no tilt, 280px wide. Only the CONTENT (live, the business's own
// data, nothing invented) and the COLOURS (the site's own pair and button colour) differ. The screen is display only; the whole
// phone is ONE link to /book, with a focus ring on the frame for keyboard users.
const DAY_KEYS = ['day.sun', 'day.mon', 'day.tue', 'day.wed', 'day.thu', 'day.fri', 'day.sat'] as const
function fmt(t: string): string {
  const [h, m] = t.split(':').map(Number)
  return `${((h! + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h! < 12 ? 'am' : 'pm'}`
}

/** the next `n` classes from now: dated classes by their start; a weekly rule (no dates) by the next weekday it falls on */
function nextClasses(sessions: ClassSession[], n: number, now = new Date()): ClassSession[] {
  const dated = sessions.filter((s) => s.startAt)
  if (dated.length > 0) return dated.filter((s) => Date.parse(s.startAt!) > now.getTime()).sort((a, b) => a.startAt!.localeCompare(b.startAt!)).slice(0, n)
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const ahead = (s: ClassSession) => {
    const [h, m] = s.start.split(':').map(Number)
    let d = (s.day - now.getDay() + 7) % 7
    if (d === 0 && h! * 60 + m! <= nowMin) d = 7
    return d * 1440 + h! * 60 + m!
  }
  return [...sessions].sort((a, b) => ahead(a) - ahead(b)).slice(0, n)
}

export function ClassScheduleConnectedBlock({ label, heading, body }: { label?: string; heading?: string; body?: string; packs?: boolean }) {
  const sessions = useClassSchedule()
  const packs = usePacksForSale()
  // the clock only after hydration: the server and the first client paint agree, then the screen moves to "from now"
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => { setNow(new Date()) }, [])
  const next = nextClasses(sessions, 1, now ?? new Date(0))
  const prices = (packs ?? []).map((p) => p.price).filter((n): n is number => typeof n === 'number')
  const low = prices.length ? Math.min(...prices) : null
  const from = low != null ? moneyShort(low, (packs ?? []).find((p) => p.price === low)?.currency ?? SITE_CURRENCY) : null
  const lines = (body ?? '').split('\n').map((l) => l.trim()).filter(Boolean)
  const cta = primaryCta()
  const showPhone = sessions.length > 0 || from !== null
  // the next seven days from today; a day with a class keeps the normal style, a day without one is faded
  const days = now ? Array.from({ length: 7 }, (_, i) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)) : []
  const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  const dated = sessions.some((s) => s.date)
  const hasClass = (d: Date) => sessions.some((s) => (dated ? s.date === iso(d) : s.day === d.getDay()))
  // the sub line from the schedule itself: the classes (two at most), the one instructor when there is one, the days they run
  const kinds = [...new Set(sessions.map((s) => s.serviceName).filter(hasText))].slice(0, 2)
  const who = [...new Set(sessions.map((s) => s.instructor).filter(hasText))]
  const order = [1, 2, 3, 4, 5, 6, 0]
  const wd = [...new Set(sessions.map((s) => s.day))].sort((a, b) => order.indexOf(a) - order.indexOf(b))
  const run = wd.length > 2 && wd.every((d, i) => i === 0 || order.indexOf(d) === order.indexOf(wd[i - 1]!) + 1)
  const dayLine = run ? tr('programs.dayRange').replace('{from}', tr(DAY_KEYS[wd[0]!]!)).replace('{to}', tr(DAY_KEYS[wd[wd.length - 1]!]!)) : wd.map((d) => tr(DAY_KEYS[d]!)).join(', ')
  // two phrases that each stay whole: a narrow phone breaks the line at the comma, never inside "Monday to Saturday"
  const subWho = kinds.length ? `${kinds.join(' & ')}${who.length === 1 ? ` ${tr('schedule.with')} ${who[0]}` : ''}` : ''
  const sub = subWho ? (dayLine ? [`${subWho},`, `${dayLine}.`] : [`${subWho}.`]) : []
  const first = next[0]
  const spots = first ? (first.seatsLeft ?? first.capacity ?? null) : null
  // the reference's one small line, as two so it never breaks mid-phrase in a narrower face: when, then who and how many spots
  const whenLine = first ? [first.date ? new Date(`${first.date}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : tr(DAY_KEYS[first.day]!), fmt(first.start)].join(' · ') : ''
  const whoLine = first ? [first.instructor ? `${tr('schedule.with')} ${first.instructor}` : '', spots != null ? `${spots} ${first.seatsLeft != null ? tr('schedule.left') : tr('schedule.spots')}` : ''].filter(Boolean).join(' · ') : ''
  // the reference's colours, by role, in the site's own pair: ink = the page ground, bone = the text colour
  const C = {
    bezel: 'color-mix(in oklab, var(--color-fam-page) 90%, var(--color-fam-ink))',
    screen: 'color-mix(in oklab, var(--color-fam-ink) 55%, white)',
    ink: 'var(--color-fam-page)',
    small: 'color-mix(in oklab, var(--color-fam-page) 66%, var(--color-fam-ink))',
    pill: 'color-mix(in oklab, var(--color-fam-ink) 90%, var(--color-fam-page))',
    pillFaint: 'color-mix(in oklab, var(--color-fam-ink) 96%, var(--color-fam-page))',
    rule: 'color-mix(in oklab, var(--color-fam-ink) 82%, var(--color-fam-page))',
    cardSmall: 'color-mix(in oklab, var(--color-fam-ink) 76%, var(--color-fam-page))',
    shadow: 'color-mix(in oklab, var(--color-fam-page) 15%, transparent)',
  }
  const row = 'flex justify-between border-b py-[15px] text-[12px] leading-[1.15]'
  return (
    <section style={INVERSE_GROUND} data-block="classSchedule" data-variant="connected">
      <div className={`container-x grid gap-[45px] py-section ${showPhone ? 'lg:grid-cols-2 lg:items-center lg:gap-[12%]' : ''}`}>
        <div>
          {hasText(label) && <p className="text-[11px] font-bold uppercase tracking-[0.2em]">{label}</p>}
          {hasText(heading) && (
            <h2 style={{ color: 'inherit' }} className="mt-4 max-w-[34rem] font-display text-[clamp(2.4rem,4.6vw,4.1rem)] font-bold leading-[1.06] tracking-[-0.01em]">{heading}</h2>
          )}
          {lines.length > 0 && (
            <ul className="mt-7 space-y-4 text-[15px]">
              {lines.map((l, i) => (
                <li key={i} className="flex items-start gap-4">
                  <ArrowUpRight aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                  <span style={INVERSE_MUTED}>{l}</span>
                </li>
              ))}
            </ul>
          )}
          <PrimaryCta className="mt-9 inline-flex items-center gap-7 bg-cta px-6 py-4 text-sm font-bold text-cta-foreground transition-[filter] hover:brightness-(--hov-shade)">
            {cta.label}
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </PrimaryCta>
        </div>
        {showPhone && (
          <a
            href="/book"
            aria-label={cta.label}
            data-connected-phone=""
            className="mx-auto block w-full max-w-[280px] cursor-pointer rounded-[42px] outline-none focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-cta focus-visible:outline-solid lg:max-w-[335px] lg:rotate-3"
            style={{ backgroundColor: C.screen, border: `8px solid ${C.bezel}`, padding: '26px 19px 18px', boxShadow: `18px 28px 55px ${C.shadow}`, color: C.ink }}
          >
            <div aria-hidden="true" className="font-sans">
              <div className="mb-[27px] flex justify-between text-[10px] font-bold leading-[1.15]"><span>9:41</span><span>● ● ▰</span></div>
              <p className="text-[11px] font-bold uppercase leading-[1.15] tracking-[2.4px]">{SITE.name}</p>
              <p className="mb-[5px] mt-[12px] font-display text-[28px] font-bold leading-[1.15] tracking-[-1px]">{tr('connected.yourWeek')}</p>
              {sub.length > 0 && <p className="text-[11px] leading-[1.15]" style={{ color: C.small }}>{sub.map((t, i) => <span key={i} className="whitespace-nowrap">{i > 0 ? ' ' : ''}{t}</span>)}</p>}
              {days.length > 0 && (
                <div className="my-[25px] flex justify-between text-[10px]">
                  {days.map((d, i) => {
                    const on = hasClass(d)
                    return (
                      <div key={i} className="text-center leading-[2.5]" style={on || i === 0 ? undefined : { color: C.small }}>
                        {d.toLocaleDateString(undefined, { weekday: 'narrow' })}
                        <strong className={`block w-[30px] rounded-[50%] ${i === 0 ? 'bg-cta text-cta-foreground' : ''}`} style={i === 0 ? undefined : { backgroundColor: on ? C.pill : C.pillFaint }}>{d.getDate()}</strong>
                      </div>
                    )
                  })}
                </div>
              )}
              {first && (
                <div className="my-[20px] rounded-[14px] px-[18px] py-[23px]" style={{ backgroundColor: C.ink, color: 'var(--color-fam-ink)' }}>
                  <p className="text-[9px] font-bold uppercase leading-[1.15] tracking-[2.4px] text-fam-accent-text">{tr('connected.nextClass')}</p>
                  <p className="my-[18px] font-display text-[25px] font-bold leading-[1.15]">{first.serviceName}</p>
                  <p className="text-[11px] leading-[1.45]" style={{ color: C.cardSmall }}>{whenLine}{whoLine && <><br />{whoLine}</>}</p>
                  <span className="mt-[20px] flex w-full items-center justify-between gap-[28px] rounded-[6px] bg-cta px-[16px] py-[12px] text-[13px] font-bold leading-[1.15] text-cta-foreground">
                    {tr('connected.bookSpot')}<span>↗</span>
                  </span>
                </div>
              )}
              {from && <div className={row} style={{ borderColor: C.rule }}><span>{tr('connected.packsFrom').replace('{price}', from)}</span><span>↗</span></div>}
              <div className={row} style={{ borderColor: C.rule }}><span>{tr('portal.title')}</span><span>↗</span></div>
              <div className="flex justify-between pt-[24px] text-[10px] leading-[1.15]">
                <span className="font-bold">{tr('connected.classes')}</span>
                <span>{tr('connected.packs')}</span>
                <span>{tr('portal.title')}</span>
              </div>
            </div>
          </a>
        )}
      </div>
    </section>
  )
}
