import { createFileRoute } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { buildMeta } from '~/lib/seo'
import { SITE } from '~/data/site'
import { CONTACT_LAYOUT } from '~/data/contact-layout'
import { SectionList } from '~/components/render-section'

export const Route = createFileRoute('/contact')({
  head: () =>
    buildMeta({
      title: `${tr('contact.title')} ${SITE.name}`,
      description: (SITE as { ctaLabel?: string }).ctaLabel
        ? `Contact ${SITE.name} — we'll reply within a business day.`
        : `Get a free quote from ${SITE.name}.`,
      path: '/contact',
    }),
  component: ContactPage,
})

// The /contact page now renders through the SHARED renderer (Arc 3 · Stage B): the
// old bg-slate section is replaced by CONTACT_LAYOUT. The WOW page-intro copy is
// passed as ctx.intro (shared IntroBlock), and the 'contactForm' block renders the
// EXACT LeadForm (untouched fields + frozen Supabase envelope) beside a brand-surfaced
// info card of the REAL contact details (each row omits when empty). Reveal is applied
// by SectionList. Intro body preserves the original reply-time copy.
function ContactPage() {
  return (
    <SectionList
      blocks={CONTACT_LAYOUT}
      ctx={{
        intro: {
          eyebrow: 'Contact',
          heading: 'Get in touch',
          body: (SITE as { ctaLabel?: string }).ctaLabel
            ? 'We reply within a business day to every message.'
            : 'We reply within a business day to every quote request.',
        },
      }}
    />
  )
}
