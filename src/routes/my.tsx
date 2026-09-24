import { createFileRoute } from '@tanstack/react-router'
import { CustomerPortal } from '~/components/portal/CustomerPortal'
import { buildMeta } from '~/lib/seo'
import { SITE } from '~/data/site'
import { tr } from '~/lib/i18n'

// ★ /my: the customer portal on every site (2026-09-24). The page exists on every site; the business decides whether the
// portal is on (the page says plainly when it is not). Not indexed: a person's own bookings are not a page to rank.
export const Route = createFileRoute('/my')({
  head: () => {
    const m = buildMeta({ title: `${tr('portal.title')} | ${SITE.name}`, description: tr('portal.phoneIntro'), path: '/my' })
    return { ...m, meta: [...m.meta, { name: 'robots', content: 'noindex' }] }
  },
  component: MyPage,
})

function MyPage() {
  return (
    <section className="relative" style={{ backgroundImage: 'var(--wow-grad-surface)' }}>
      <div className="container-x py-section">
        <div className="mx-auto max-w-xl">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">{tr('portal.title')}</h1>
          <div className="mt-6"><CustomerPortal /></div>
        </div>
      </div>
    </section>
  )
}
