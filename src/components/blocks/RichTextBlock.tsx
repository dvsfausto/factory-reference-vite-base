import { motion } from 'framer-motion'
import { parseRichText, type Run } from '~/lib/rich-text'

// Generic PROSE block (Phase 2, custom pages). The one content-bearing primitive whose
// copy rides entirely in block.params (not a global data store), so a customer-created
// page ("Financing", "Our Process", "Careers") can carry arbitrary supplied text and
// always render with real content. Every other block either self-sources from global
// site data or takes copy via params the same way, richText just makes multi-paragraph
// body copy a first-class, per-section channel.
//
// HONESTY: renders ONLY the copy passed in; returns null when there is no heading AND no
// body (no fabricated prose). Paragraphs split on blank lines; single newlines break.
// WOW tokens: brand eyebrow + soft brand-tint surface, consistent with IntroBlock.
/** a picture on the page: the owner's own upload or a stock photo; focus = "x% y%" when the owner moved it */
export interface RichTextImage { url: string; alt?: string; credit?: string; focus?: string }
const Runs = ({ runs }: { runs: Run[] }) => (
  <>
    {runs.map((r, i) => (r.bold ? <strong key={i} className="font-semibold text-ink-900">{r.text}</strong> : r.italic ? <em key={i}>{r.text}</em> : <span key={i}>{r.text}</span>))}
  </>
)
export function RichTextBlock({
  eyebrow,
  heading,
  headingLevel = 2,
  body,
  image,
}: {
  eyebrow?: string
  heading?: string
  /** 1 when this block is the page title (a custom page whose layout has no `intro` block). */
  headingLevel?: 1 | 2
  body?: string
  image?: RichTextImage
}) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2'
  /* ★ designed copy (2026-09-29): the small Markdown the assistant writes becomes headings, lists and emphasis in the site's own
     type; a picture given with the copy sits beside it on a wide screen and above it on a phone, in the site's media tokens. */
  const blocks = parseRichText(body ?? '')
  const pic = image && typeof image.url === 'string' && image.url ? image : null
  if (!heading && blocks.length === 0 && !pic) return null
  return (
    <section className="relative" data-block="richText">
      <div className="container-x py-section">
        <motion.div
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={pic ? 'grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start' : 'max-w-3xl'}
        >
          {pic && (
            <figure className="overflow-hidden rounded-2xl border border-fam-hairline bg-fam-surface lg:order-last lg:sticky lg:top-24" data-page-image="">
              <img
                src={pic.url}
                alt={pic.alt ?? heading ?? ''}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
                style={pic.focus ? { objectPosition: pic.focus } : undefined}
              />
              {pic.credit && <figcaption className="px-4 py-2 text-xs text-ink-500">{pic.credit}</figcaption>}
            </figure>
          )}
          <div className="max-w-3xl">
          {eyebrow && (
            <span className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-700">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundImage: 'var(--wow-grad-brand)' }}
              />
              {eyebrow}
            </span>
          )}
          {heading && (
            <Heading className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-4xl">
              {heading}
            </Heading>
          )}
          {blocks.length > 0 && (
            <div className="mt-6 space-y-5">
              {blocks.map((b, i) =>
                b.kind === 'heading' ? (
                  b.level === 2
                    ? <h3 key={i} className="pt-2 font-display text-2xl font-semibold leading-tight tracking-tight text-ink-900"><Runs runs={b.runs} /></h3>
                    : <h4 key={i} className="pt-1 font-display text-lg font-semibold text-ink-900"><Runs runs={b.runs} /></h4>
                ) : b.kind === 'list' ? (
                  <ul key={i} className="space-y-3">
                    {b.items.map((item, j) => (
                      <li key={j} className="flex gap-3 text-lg leading-relaxed text-ink-700">
                        <span aria-hidden="true" className="mt-[0.7em] h-2 w-2 shrink-0 rounded-full" style={{ backgroundImage: 'var(--wow-grad-brand)' }} />
                        <span><Runs runs={item} /></span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p key={i} className="text-lg leading-relaxed text-ink-700 whitespace-pre-line"><Runs runs={b.runs} /></p>
                ),
              )}
            </div>
          )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
