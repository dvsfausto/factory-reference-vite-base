import type { BlogPost } from './blog-variants'
import { SITE } from '~/data/site'

// Blog LAYOUT: 'featured+list', one large featured post beside a compact list of
// the rest. Character-agnostic, section/index only. OMIT-WHEN-ABSENT: SITE.posts
// via cast; none -> null. Missing image -> text-first featured card.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700. Radius -> rounded-*
// (DNA). Font -> font-display (DNA). Cool surface component-owned (#F8FAFC / white
// / #E6E8EC). Never bg-brand-* / .btn.
export function BlogFeaturedListBlock({
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
  const [lead, ...rest] = posts
  const list = rest.slice(0, 4)
  return (
    <section className="bg-[#F8FAFC]">
      <div className="container-x py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            <span className="h-px w-6 bg-emerald-600" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">{heading}</h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-[#64748B]">{body}</p>}
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <a href={lead.href} className="group flex flex-col overflow-hidden rounded-3xl border border-[#E6E8EC] bg-white">
            {lead.image && (
              <div className="aspect-[16/9] overflow-hidden"><img src={lead.image} alt={lead.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
            )}
            <div className="p-8">
              {lead.date && <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">{lead.date}</span>}
              <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[#0F172A] group-hover:text-emerald-700">{lead.title}</h3>
              {lead.excerpt && <p className="mt-3 leading-relaxed text-[#64748B]">{lead.excerpt}</p>}
            </div>
          </a>
          <div className="flex flex-col divide-y divide-[#E6E8EC]">
            {list.map((p, i) => (
              <a key={`${p.title}-${i}`} href={p.href} className="group flex gap-5 py-5 first:pt-0">
                {p.image && <span className="h-20 w-28 shrink-0 overflow-hidden rounded-xl"><img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover" /></span>}
                <span className="min-w-0">
                  {p.date && <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">{p.date}</span>}
                  <span className="block font-display text-base font-semibold leading-snug tracking-tight text-[#0F172A] group-hover:text-emerald-700">{p.title}</span>
                  {p.excerpt && <span className="mt-1 line-clamp-2 block text-sm text-[#64748B]">{p.excerpt}</span>}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
