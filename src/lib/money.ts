import { SITE } from '~/data/site'
import { LANG } from '~/lib/i18n'

/**
 * ★★★ ONE MONEY FORMATTER for the site (LATAM arc part 2, 2026-09-24): prices in the business's own currency.
 * The scaffolder bakes SITE.currency only for a business outside the USD world; a site without it (every site before the
 * arc) formats exactly as it did: "$45" on cards, "$45.00" in the wizard. No conversion, ever.
 */
export const SITE_CURRENCY: string = ((SITE as { currency?: string }).currency ?? 'USD').toUpperCase()
const LOCALES: Record<string, string> = { USD: 'en-US', PEN: 'es-PE', COP: 'es-CO', ARS: 'es-AR', CLP: 'es-CL', MXN: 'es-MX', BRL: 'pt-BR', CAD: 'en-CA', DOP: 'es-DO', VES: 'es-VE', EUR: 'es-ES', GBP: 'en-GB' }
const ZERO_DECIMALS = new Set(['COP', 'CLP'])
const SYMBOLS: Record<string, string> = { USD: '$', PEN: 'S/', COP: '$', ARS: '$', CLP: '$', MXN: '$', BRL: 'R$', CAD: '$', DOP: 'RD$', VES: 'Bs.', EUR: '€', GBP: '£' }
const decimals = (c: string) => (ZERO_DECIMALS.has(c) ? 0 : 2)

/** "$45" / "$45.50" — the card style (a "$" literal before the arc, kept byte for byte for USD) */
export function moneyShort(v: number | string | null | undefined, currency: string = SITE_CURRENCY): string {
  if (v === null || v === undefined || v === '') return ''
  const n = typeof v === 'number' ? v : Number(v)
  if (!Number.isFinite(n)) return ''
  const c = currency.toUpperCase()
  if (c === 'USD') return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`
  try {
    return new Intl.NumberFormat(LOCALES[c] ?? (LANG === 'es' ? 'es' : 'en-US'), { style: 'currency', currency: c, minimumFractionDigits: Number.isInteger(n) ? 0 : decimals(c), maximumFractionDigits: decimals(c) }).format(n)
  } catch { return `${SYMBOLS[c] ?? c + ' '}${n}` }
}
/** "$45.00" / "S/ 45,00" — the wizard and the checkout style */
export function money(v: number | string | null | undefined, currency: string = SITE_CURRENCY, opts: { trimWhole?: boolean } = {}): string {
  if (v === null || v === undefined || v === '') return ''
  const n = typeof v === 'number' ? v : Number(v)
  if (!Number.isFinite(n)) return ''
  const c = currency.toUpperCase()
  const min = opts.trimWhole && Number.isInteger(n) ? 0 : decimals(c)
  try {
    return new Intl.NumberFormat(c === 'USD' ? 'en-US' : (LOCALES[c] ?? 'en-US'), { style: 'currency', currency: c, minimumFractionDigits: min, maximumFractionDigits: Math.max(min, decimals(c)) }).format(n)
  } catch { return `${SYMBOLS[c] ?? c + ' '}${n.toFixed(decimals(c))}` }
}
