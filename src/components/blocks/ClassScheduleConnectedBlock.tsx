import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight, Clock, Users } from 'lucide-react'
import { SITE } from '~/data/site'
import { PRICING_LAYOUT } from '~/data/pricing-layout'
import { tr } from '~/lib/i18n'
import { hasText } from '~/lib/has-text'
import { primaryCta } from '~/lib/primaryCta'
import { moneyShort, SITE_CURRENCY } from '~/lib/money'
import { useClassSchedule, type ClassSession } from '~/lib/useClassSchedule'
import { INVERSE_GROUND, INVERSE_MUTED } from '~/lib/inverse-tone'
import { usePacksForSale } from './PacksForSale'
import { PrimaryCta } from './PrimaryCta'

// Class schedule LAYOUT: 'connected' (2026-10-14, the trainer-led homepage). A band in the inverse tone: on the left the label,
// the heading, the body's lines as a short list (one line each, what a customer can really do) and the affordance button; on
// the right a phone frame holding a LIVE mini version of the booking app from the business's own data: the next three classes
// (each Book opens /book on that class), the packs with their price (Buy opens the packs page with that pack's checkout), and a
// My bookings tab (/my). Nothing in the phone is a picture or a sample: every row is read live and every tap is the real page.
// A tab shows only with its data; with no classes and no packs the phone is not drawn. On a phone the frame stacks under the
// words at full width. The full weekly schedule lives on its own page (the 'week' layout); this one is the homepage's view.

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
  const [tab, setTab] = useState<'classes' | 'packs'>('classes')
  // the clock only after hydration: the server and the first client paint agree, then the list moves to "from now"
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => { setNow(new Date()) }, [])
  const next = nextClasses(sessions, 3, now ?? new Date(0))
  const sellable = (packs ?? []).filter((p) => p.price != null)
  const lines = (body ?? '').split('\n').map((l) => l.trim()).filter(Boolean)
  const cta = primaryCta()
  const packsHref = PRICING_LAYOUT.some((b) => b.type === 'packages') ? '/pricing' : '/book'
  const showPhone = next.length > 0 || sellable.length > 0
  const view = tab === 'packs' && sellable.length > 0 ? 'packs' : next.length > 0 ? 'classes' : 'packs'
  const tabClass = (on: boolean) => `flex-1 rounded-full px-2 py-1.5 text-center text-[11px] font-bold ${on ? 'bg-fam-page text-fam-ink' : ''}`
  return (
    <section style={INVERSE_GROUND} data-block="classSchedule" data-variant="connected">
      <div className={`container-x grid gap-12 py-section ${showPhone ? 'lg:grid-cols-[1fr_minmax(0,24rem)] lg:items-center lg:gap-[10%]' : ''}`}>
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
          <div className="mx-auto w-full max-w-[24rem]" data-connected-phone="">
            {/* the frame: a dark bezel in the page's own tone around a screen in the band's tone */}
            <div className="rounded-[2.6rem] bg-fam-page p-2.5 shadow-(--elev-5)">
              <div className="overflow-hidden rounded-[2.1rem] px-5 pb-5 pt-6" style={{ backgroundColor: 'color-mix(in oklab, var(--color-fam-ink) 94%, var(--color-fam-page))', color: 'var(--color-fam-page)' }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em]">{SITE.name}</p>
                <div className="mt-4 flex gap-1 rounded-full p-1" style={{ backgroundColor: 'color-mix(in oklab, var(--color-fam-page) 8%, var(--color-fam-ink))' }} role="tablist">
                  {next.length > 0 && <button type="button" role="tab" aria-selected={view === 'classes'} onClick={() => setTab('classes')} className={tabClass(view === 'classes')}>{tr('connected.classes')}</button>}
                  {sellable.length > 0 && <button type="button" role="tab" aria-selected={view === 'packs'} onClick={() => setTab('packs')} className={tabClass(view === 'packs')}>{tr('connected.packs')}</button>}
                  <Link to="/my" className={tabClass(false)} data-connected-my="">{tr('portal.title')}</Link>
                </div>
                {view === 'classes' ? (
                  <ul className="mt-4 space-y-2.5" data-connected-classes="">
                    {next.map((s, i) => {
                      const when = s.date ? new Date(`${s.date}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : tr(DAY_KEYS[s.day]!)
                      const full = s.isFull || (s.seatsLeft != null && s.seatsLeft <= 0)
                      const href = s.occurrenceId ? `/book?occurrence=${s.occurrenceId}` : '/book'
                      const lead = i === 0
                      return (
                        <li key={s.occurrenceId ?? `${s.day}-${s.start}`} className={`rounded-2xl p-4 ${lead ? 'bg-fam-page text-fam-ink' : ''}`} style={lead ? undefined : { backgroundColor: 'color-mix(in oklab, var(--color-fam-page) 6%, var(--color-fam-ink))' }}>
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[11px] font-bold uppercase tracking-[0.16em]">{when}</p>
                            <p className="flex items-center gap-1.5 text-xs font-semibold"><Clock aria-hidden="true" className="h-3.5 w-3.5" />{fmt(s.start)}</p>
                          </div>
                          <p style={{ color: 'inherit' }} className="mt-2 font-display text-lg font-bold leading-tight">{s.serviceName}</p>
                          <div className="mt-2 flex items-center justify-between gap-3 text-xs">
                            <span className={`flex items-center gap-1.5 ${lead ? 'text-fam-ink-muted' : ''}`}>
                              {s.instructor ? `${tr('schedule.with')} ${s.instructor}` : null}
                              {s.instructor && (s.seatsLeft != null || s.capacity) ? ' · ' : null}
                              {(s.seatsLeft != null || s.capacity) && <><Users aria-hidden="true" className="h-3.5 w-3.5" />{s.seatsLeft ?? s.capacity} {s.seatsLeft != null ? tr('schedule.left') : tr('schedule.spots')}</>}
                            </span>
                            <a href={href} className="shrink-0 rounded-full bg-cta px-4 py-1.5 font-bold text-cta-foreground" data-connected-book="">{full ? tr('schedule.waitlist') : tr('schedule.book')}</a>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <ul className="mt-4 space-y-2.5" data-connected-packs="">
                    {sellable.map((p) => (
                      <li key={p.id} className="rounded-2xl p-4" style={{ backgroundColor: 'color-mix(in oklab, var(--color-fam-page) 6%, var(--color-fam-ink))' }}>
                        <p style={{ color: 'inherit' }} className="font-display text-base font-bold leading-snug">{p.name}</p>
                        <p className="mt-1 text-xs" style={INVERSE_MUTED}>{p.credits} {tr('packs.classes')}{p.validity_days ? ` · ${tr('packs.valid')} ${p.validity_days} ${tr('packs.days')}` : ''}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="font-display text-xl font-bold">{moneyShort(p.price!, p.currency ?? SITE_CURRENCY)}</span>
                          <a href={`${packsHref}?pack=${p.id}`} className="rounded-full bg-cta px-4 py-1.5 text-xs font-bold text-cta-foreground" data-connected-buy="">{tr('packs.buy')}</a>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
