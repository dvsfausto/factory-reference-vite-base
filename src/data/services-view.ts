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
