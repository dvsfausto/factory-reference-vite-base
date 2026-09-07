import { ArrowUpRight } from 'lucide-react'
import type { BlogPost } from './blog-variants'
import { SITE } from '~/data/site'

// Blog LAYOUT: 'list', a clean hairline-separated list of posts (date + title +
// excerpt + arrow). Character-agnostic, no imagery needed, section/index only.
// OMIT-WHEN-ABSENT: SITE.posts via cast; none -> null.
//
// TOKEN DISCIPLINE: accent -> fam-accent-* (DNA) 50/100/600/700. Radius -> rounded-*
// (DNA). Font -> font-display (DNA). Light surface component-owned (white / slate /
// hairline #E6E8EC). Never bg-brand-* / .btn.
export function BlogListBlock({
  site = SITE,
  label = 'Blog',
  heading = 'Latest articles',
  body,
}: {
  site?: typeof SITE
  label?: string
  heading?: string
  body?: string
}) {
  const posts = (site as { posts?: BlogPost[] }).posts
  if (!posts || posts.length === 0) return null
  return (
    <section className="bg-white">
      <div className="container-x py-section">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
            <span className="h-px w-6 bg-fam-accent" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">{heading}</h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-fam-ink-muted">{body}</p>}
        </div>
        <div className="mx-auto mt-12 max-w-3xl border-t border-fam-hairline">
          {posts.slice(0, 8).map((p, i) => (
            <a key={`${p.title}-${i}`} href={p.href} className="group grid grid-cols-1 gap-2 border-b border-fam-hairline py-8 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-3">
                {p.date && <span className="font-display text-sm font-semibold text-fam-accent-text">{p.date}</span>}
              </div>
              <div className="md:col-span-9">
                <h3 className="flex items-start gap-2 font-display text-xl font-semibold tracking-tight text-fam-ink transition-colors group-hover:text-fam-accent-text-strong">
                  {p.title} <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-fam-accent-text" />
                </h3>
                {p.excerpt && <p className="mt-2 leading-relaxed text-fam-ink-muted">{p.excerpt}</p>}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
