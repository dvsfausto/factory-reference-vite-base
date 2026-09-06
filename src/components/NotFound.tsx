import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'

/**
 * ★ AN HONEST 404 (2026-09-06): a heading that says so, a title that says so, and `noindex` — a missing
 * page is not a page to rank. No canonical on purpose: a canonical names the page a URL should stand
 * for, and a 404 stands for nothing.
 */
export function NotFound({ children }: { children?: any }) {
  return (
    <div className="mx-auto max-w-2xl space-y-3 px-6 py-16">
      <title>{`${tr('error.notFoundTitle')} · ${SITE.name}`}</title>
      <meta name="robots" content="noindex" />
      <h1 className="text-2xl font-semibold text-ink-900">{tr('error.notFoundTitle')}</h1>
      <div className="text-gray-600 dark:text-gray-400">
        {children || <p>{tr('error.notFoundBody')}</p>}
      </div>
      <p className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => window.history.back()}
          className="bg-emerald-500 text-white px-2 py-1 rounded-sm uppercase font-black text-sm"
        >{tr('error.goBack')}</button>
        <Link
          to="/"
          className="bg-cyan-600 text-white px-2 py-1 rounded-sm uppercase font-black text-sm"
        >{tr('error.startOver')}</Link>
      </p>
    </div>
  )
}
