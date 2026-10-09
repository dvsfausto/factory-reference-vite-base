import type { ReactNode } from 'react'
import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'

/* ★ SHORT SERVICE COPY (ZB-147 W1.3): the owner's setting site.serviceCopy = 'short' (SITE.serviceCopy) folds the long prose
   on service pages behind "Read more"; the first paragraph and the packages stay open. Nothing is rewritten or regenerated:
   the same words, folded. Unset → every block renders as it always did. A native <details>, so it works before hydration. */
export const SHORT_SERVICE_COPY = (SITE as { serviceCopy?: string }).serviceCopy === 'short'

export function Fold({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <details className={`group ${className}`} data-fold>
      <summary className="inline-flex cursor-pointer list-none items-center gap-2 font-sans text-[13px] font-medium uppercase tracking-[0.18em] text-fam-ink underline decoration-fam-hairline underline-offset-4 marker:hidden [&::-webkit-details-marker]:hidden">
        <span className="group-open:hidden">{tr('service.readMore')}</span>
        <span className="hidden group-open:inline">{tr('service.readLess')}</span>
      </summary>
      <div className="mt-6">{children}</div>
    </details>
  )
}
