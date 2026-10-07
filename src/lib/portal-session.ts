/* ★ ZB-180 (2026-10-07): the customer portal's session, kept in BOTH stores. sessionStorage is per tab; a Stripe checkout that
   comes back in a new tab or an in-app browser lost it and the person was asked for a code again. localStorage is per origin and
   survives the hop. One seam for the portal and the class flow. */
export const SESSION_KEY = 'zmode_portal_session'
export const readSession = (): string | null => { try { return window.sessionStorage.getItem(SESSION_KEY) ?? window.localStorage.getItem(SESSION_KEY) } catch { return null } }
export const writeSession = (t: string): void => { try { window.sessionStorage.setItem(SESSION_KEY, t) } catch { /* not kept */ } try { window.localStorage.setItem(SESSION_KEY, t) } catch { /* not kept */ } }
export const clearSession = (): void => { try { window.sessionStorage.removeItem(SESSION_KEY) } catch { /* nothing */ } try { window.localStorage.removeItem(SESSION_KEY) } catch { /* nothing */ } }
