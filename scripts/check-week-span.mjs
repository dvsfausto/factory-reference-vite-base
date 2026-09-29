#!/usr/bin/env node
// check-week-span — the week timetable shows ONE seven-day span starting at the first upcoming dated class (2026-09-29).
// Fitcycling's section fell from a full week to one day when the block read "the next seven days" while their classes
// began the following Monday. The span must start at the first class, hold seven days, drop nothing inside them, and
// leave undated (weekly-rule) sessions alone. weekSpan is pure; this lifts it out of the hook file and runs it.
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
const src = readFileSync('src/lib/useClassSchedule.ts', 'utf8')
const start = src.indexOf('export function weekSpan')
const fn = src.slice(start, src.indexOf('\n}\n', start) + 3)
const js = fn
  .replace(': { sessions: ClassSession[]; from: string | null }', '')
  .replace('(sessions: ClassSession[], days = WEEK_BLOCK_DAYS)', '(sessions, days = WEEK_BLOCK_DAYS)')
  .replace(/s\.date!/g, 's.date').replace('[0]!', '[0]').replace('y!, m! - 1, d! + days', 'y, m - 1, d + days')
const file = join(mkdtempSync(join(tmpdir(), 'weekspan-')), 'w.mjs')
writeFileSync(file, `const WEEK_BLOCK_DAYS = 7\n${js}`)
const { weekSpan } = await import(file)
const mk = (date, start = '09:30') => ({ serviceName: 'Ride', day: 1, start, date })
const dates = []
for (let i = 0; i < 30; i++) dates.push(new Date(Date.UTC(2026, 9, 5 + i)).toISOString().slice(0, 10))
const r = weekSpan(dates.flatMap((d) => [mk(d, '09:30'), mk(d, '18:00')]))
const got = new Set(r.sessions.map((s) => s.date))
const fails = []
if (r.from !== '2026-10-05') fails.push('span must start at the first class: ' + r.from)
if (got.size !== 7) fails.push('seven days expected, got ' + got.size)
if (r.sessions.length !== 14) fails.push('every class inside the span stays: ' + r.sessions.length)
if (got.has('2026-10-12')) fails.push('the eighth day must fall out')
const rules = [{ serviceName: 'Ride', day: 1, start: '09:30' }, { serviceName: 'Ride', day: 6, start: '09:30' }]
if (weekSpan(rules).sessions.length !== 2 || weekSpan(rules).from !== null) fails.push('undated sessions pass through')
if (weekSpan([]).sessions.length !== 0) fails.push('empty stays empty')
if (weekSpan([mk('2026-10-05'), mk('2026-10-13')]).sessions.length !== 1) fails.push('a class eight days after the first is not this week')
console.log(JSON.stringify({ from: r.from, days: [...got], kept: r.sessions.length }))
if (fails.length) { console.error('check-week-span:\n  ' + fails.join('\n  ')); process.exit(1) }
console.log('check-week-span: ok')
