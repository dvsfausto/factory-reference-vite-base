import type { BlogPost } from './blog-variants'
import { SITE } from '~/data/site'

// Blog LAYOUT: 'card-grid' — a grid of post cards (image when present, title,
// excerpt, date). Character-agnostic, section/index only. OMIT-WHEN-ABSENT:
// SITE.posts via cast; none -> null. Missing image -> a clean text-first card.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700: emerald-600 hover.
// Radius -> rounded-* (DNA). Font -> font-display (DNA). Light surface component-
// owned (white / slate / #E6E8EC). Never bg-brand-* / .btn.
export function BlogCardGridBlock({
  label = 'Blog',
  heading = 'From the blog',
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const posts = (SITE as { posts?: BlogPost[] }).posts
  if (!posts || posts.length === 0) return null
  return (
    <section className="bg-white">
      <div className="container-x py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            <span className="h-px w-6 bg-emerald-600" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">{heading}</h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-[#64748B]">{body}</p>}
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 6).map((p, i) => (
            <a key={`${p.title}-${i}`} href={p.href} className="group flex flex-col overflow-hidden rounded-2xl border border-[#E6E8EC] bg-white transition-all hover:border-emerald-600 hover:shadow-md">
              {p.image && (
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                {p.date && <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">{p.date}</span>}
                <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-[#0F172A] group-hover:text-emerald-700">{p.title}</h3>
                {p.excerpt && <p className="mt-2 flex-1 text-sm leading-relaxed text-[#64748B]">{p.excerpt}</p>}
                <span className="mt-4 font-display text-sm font-semibold text-emerald-600">Read more →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
