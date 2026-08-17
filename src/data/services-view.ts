// Published-services view — the SINGLE place UI consumers read the service list from.
//
// src/data/services.ts is scaffolder-generated (overwritten per build) and exports the FULL authored
// SERVICES list. Nav, footer, homepage service grids, and area-page featured refs import SERVICES
// from HERE instead of ./services, so publish-filtering happens ONCE: an unpublished service
// (published:false, set by the editor) disappears from every consumer at once, and restore brings it
// back. Absent published === published, so this is identical to the raw list when nothing is
// unpublished (backward-compatible — no behaviour change for existing sites).
//
// A future consumer that imports SERVICES from ./services instead of here would show an unpublished
// service — a VISIBLE, greppable, non-destructive miss (grep every UI import of SERVICES → this file),
// which is why this indirection is preferred over renaming the generated export.
import { SERVICES as SERVICES_ALL } from './services';
import type { ServiceRef } from '~/lib/types/page-types';

export const SERVICES: ServiceRef[] = SERVICES_ALL.filter((s) => s.published !== false);

/**
 * PAGED view — the subset of visible services that have a DEDICATED PAGE (three-way separation:
 * visible ≠ paged). Nav (Header/Footer), the sitemap, and the /services/$slug loader read from HERE
 * so a non-paged service (paged:false — set by the scaffolder beyond the top-8, or by a customer
 * override) is dropped from nav + sitemap + gets a 301, while it STAYS in `SERVICES` (list/grid/
 * pricing) and keeps its editable servicesData entry. Absent paged === paged, so when nothing is
 * capped this equals the visible list → byte-identical render (backward-compatible).
 */
export const PAGED_SERVICES: ServiceRef[] = SERVICES.filter((s) => s.paged !== false);

/**
 * QUOTABLE view — visible services the customer REQUESTS A QUOTE for. That's the two quotable
 * affordances: `collect` (quotable, no price — the owner builds the estimate; Melvin's case) and
 * `quote` (quotable with a fixed estimate). The quote-request widget offers exactly these. The pattern
 * generalises: a booking widget reads `action === 'book'`, a cart reads `'buy'`. Absent `action`
 * (older builds that never forwarded the affordance) → empty, and the widget falls back to offering
 * all of SERVICES so it is never a dead form.
 */
const QUOTABLE_ACTIONS: ServiceRef['action'][] = ['collect', 'quote'];
export const QUOTABLE_SERVICES: ServiceRef[] = SERVICES.filter((s) => QUOTABLE_ACTIONS.includes(s.action));

/** The services a catalog widget should offer for a set of affordances, with the never-empty
 *  fallback: the filtered set when known, else all visible services. */
export function servicesForActions(actions: ServiceRef['action'][]): ServiceRef[] {
  const filtered = SERVICES.filter((s) => actions.includes(s.action));
  return filtered.length > 0 ? filtered : SERVICES;
}

/** True iff this slug has a dedicated page (visible AND paged). Used by the list renderer to choose
 *  a card vs an anchor, and by the loader/sitemap to gate the page. */
export function isServicePaged(slug: string): boolean {
  return PAGED_SERVICES.some((s) => s.slug === slug);
}

/**
 * Related-links render-filter: keep any non-`/services/…` link as-is; drop a `/services/<slug>` link
 * whose service is unpublished. Lets service/info pages self-heal their `relatedServices` cross-links
 * with NO cross-page data mutation — and it auto-reverses on restore. When nothing is unpublished
 * every link matches a visible service → identical render (backward-compatible).
 */
export function isRelatedServiceVisible(href: string): boolean {
  const m = href.match(/^\/services\/([a-z0-9-]+)\/?$/);
  if (!m) return true;
  return SERVICES.some((s) => s.slug === m[1]);
}
