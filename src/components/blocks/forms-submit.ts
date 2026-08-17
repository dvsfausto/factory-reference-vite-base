import { BUSINESS_ID, SUPABASE_ENDPOINT } from '~/data/site'

// Shared lead submission — ported VERBATIM from the painter LeadForm's wired
// submit (the confirmed handle-website-lead contract). Every Forms variant posts
// this EXACT LeadEnvelope; the only thing that varies per variant is source_page
// (free-form intent) and how it composes `message`. No new top-level keys are
// invented (that could corrupt the CRM ingest), so richer variants fold extra
// fields into `message` rather than adding payload keys.
export type LeadStatus = 'idle' | 'submitting' | 'success' | 'error'

export interface LeadInput {
  first_name: string
  last_name: string
  phone: string
  email?: string
  message: string
}

export async function submitLead(input: LeadInput, sourcePage: string): Promise<void> {
  const payload = {
    business_id: BUSINESS_ID,
    form_type: 'lead_form' as const,
    first_name: input.first_name.trim(),
    last_name: input.last_name.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || undefined,
    message: input.message.trim(),
    source_url: typeof window !== 'undefined' ? window.location.href : '',
    source_page: sourcePage,
    language: 'en' as const,
    opt_in_sms: false,
  }
  const res = await fetch(SUPABASE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
}

// ── Catalog QUOTE-REQUEST submit — the structured sibling of submitLead. Where submitLead files a
//    generic contact (handle-website-lead), this files a STRUCTURED quote_request (request-quote):
//    a specific quotable service + project details/measurements → the owner's Requests tab, not the
//    CRM inbox. This is the pattern the other catalog widgets (booking/cart) copy: same shape, a
//    different endpoint + field set. request-quote lives on the SAME functions base as the lead
//    endpoint, so we derive it rather than emit a second constant. ──
const REQUEST_QUOTE_ENDPOINT = SUPABASE_ENDPOINT.replace(/handle-website-lead\/?$/, 'request-quote')

export interface QuoteInput {
  first_name: string
  last_name: string
  phone: string
  email?: string
  serviceName?: string // the chosen quotable service's display name — the server's resolver key
                       // (services has no slug column) and the owner's one-line summary
  details: string      // the project details / measurements the customer typed
  hp?: string          // honeypot — bots fill it; server silently drops
}

export async function submitQuoteRequest(input: QuoteInput): Promise<void> {
  const name = [input.first_name, input.last_name].map((s) => s.trim()).filter(Boolean).join(' ')
  const payload = {
    businessId: BUSINESS_ID,
    serviceName: input.serviceName?.trim() || null,
    name,
    email: input.email?.trim() || undefined,
    phone: input.phone.trim(),
    summary: input.serviceName ? `Quote request — ${input.serviceName}` : 'Quote request',
    details: { projectDetails: input.details.trim(), service: input.serviceName ?? null },
    source: 'website',
    hp: input.hp ?? '',
  }
  const res = await fetch(REQUEST_QUOTE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
}
