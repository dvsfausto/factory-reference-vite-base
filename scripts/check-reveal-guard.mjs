#!/usr/bin/env node
// check-reveal-guard — a section that GROWS after mount still reveals on a phone (2026-09-29).
//
// Reveal.tsx hides every homepage section until it enters the viewport. Its 2026-09-03 guard measured the element once,
// when the observer was made, so a live-read block that grew afterwards (the class timetable: 51 dated classes,
// 6,733px on a phone) could never reach its threshold and stayed at opacity 0 — a blank page from "About" to the FAQs
// on a real site. The rule now: the decision reads the element's size at EVERY callback (e.boundingClientRect,
// e.intersectionRect), never a height captured at mount, and the observer fires at fine steps so a tall element is
// checked in time. This check keeps the primitive that shape. The first violation fails the build.
import { readFileSync } from 'node:fs'
const src = readFileSync('src/components/Reveal.tsx', 'utf8')
const problems = []
if (/el\.offsetHeight|el\.getBoundingClientRect\(\)\.height|el\.clientHeight/.test(src))
  problems.push('Reveal.tsx reads the element height at mount; a block that grows after its live read outgrows that number — decide per callback on e.boundingClientRect.height')
if (!/e\.boundingClientRect\.height/.test(src) || !/e\.intersectionRect\.height/.test(src))
  problems.push('Reveal.tsx must decide on the entry\'s own rects (boundingClientRect, intersectionRect) at every callback')
if (!/threshold: steps/.test(src) || !/\(i \+ 1\) \/ 100/.test(src))
  problems.push('Reveal.tsx must observe at 0.01 steps (never 0) so a tall element is checked before it can pass by')
if (/threshold: 0\b|threshold: \[0\]|threshold: \[0,/.test(src)) problems.push('Reveal.tsx: threshold 0 removes the entrance; never')
if (problems.length) { console.error('check-reveal-guard:\n  ' + problems.join('\n  ')); process.exit(1) }
console.log('check-reveal-guard: ok')
