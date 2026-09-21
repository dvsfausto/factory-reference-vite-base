/**
 * ★ COPY AN OWNER MAY CLEAR (the owner, 2026-09-21) — true when a value has words a customer can read. The editor
 * stores a cleared field as "" and never writes whitespace or invisible characters any more, but a site built
 * before that can still hold " " (one did: the workaround for "remove the kicker" was a single space). So the
 * test is on the trimmed value, with the zero-width characters taken out, never on the raw string.
 * scripts/check-optional-copy.mjs fails the build on any clearable field drawn without this (or a `&&`) guard.
 */
export function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.replace(/[​-‍⁠﻿­]/g, '').trim() !== ''
}
