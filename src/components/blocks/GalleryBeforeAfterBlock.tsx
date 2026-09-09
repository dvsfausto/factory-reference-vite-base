import { useState } from 'react'
import { tr } from '~/lib/i18n'
import { PROJECTS, type GalleryItem } from '~/data/projects'

// Gallery LAYOUT: 'before-after-slider', an interactive drag-to-reveal slider per
// project, comparing a before and after photo. Character-agnostic. PIPELINE-
// SEEDED: before/after come from optional PROJECTS data fields; only projects that
// carry a pair are shown. Renders the position at 50% on the server and reveals on
// drag in the browser.
//
// HONESTY: pairs are labeled illustrative. A real before/after is a genuine
// customer transformation (the asset-library wiring), a stock pair would imply a
// job we didn't do, so the seed pairs are explicitly illustrative.
//
// TOKEN DISCIPLINE: accent -> fam-accent-* (DNA) 50/100/600/700: fam-accent handle.
// Radius -> rounded-* (DNA). Font -> font-display (DNA). Light surface component-
// owned (white / slate / #E6E8EC). No CTA by design. Never bg-brand-* / .btn.
function Slider({ item }: { item: GalleryItem }) {
  const [pos, setPos] = useState(50)
  return (
    <figure className="overflow-hidden rounded-2xl border border-fam-hairline bg-fam-card">
      <div className="relative aspect-[4/3] select-none">
        <img src={item.afterImage} alt={`${item.title}, after`} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <img
          src={item.beforeImage}
          alt={`${item.title}, before`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        />
        <span className="absolute left-3 top-3 rounded-md bg-fam-card/90 px-2 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-fam-ink backdrop-blur-sm">{tr('gallery.before')}</span>
        <span className="absolute right-3 top-3 rounded-md bg-fam-accent px-2 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-fam-on-dark">{tr('gallery.after')}</span>
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-fam-card shadow" style={{ left: `${pos}%` }} />
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Reveal ${item.title} before and after`}
          className="absolute inset-x-0 bottom-4 mx-4 w-[calc(100%-2rem)] accent-fam-accent"
        />
      </div>
      <figcaption className="flex items-center justify-between gap-3 p-4">
        <span className="font-display text-sm font-semibold text-fam-ink">{item.title}</span>
        <span className="text-xs italic text-fam-ink-faint">{tr('gallery.illustrative')}</span>
      </figcaption>
    </figure>
  )
}

export function GalleryBeforeAfterBlock({
  projects = PROJECTS,
  label = tr('section.beforeAfter'),
  heading = tr('section.seeTheDifference'),
  body,
}: {
  projects?: typeof PROJECTS
  label?: string
  heading?: string
  body?: string
}) {
  const pairs = projects.filter((p) => p.beforeImage && p.afterImage)
  if (pairs.length === 0) return null
  return (
    <section className="bg-fam-card">
      <div className="container-x py-section">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
            <span className="h-px w-6 bg-fam-accent" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">
            {heading}
          </h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-fam-ink-muted">{body}</p>}
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {pairs.map((p, i) => (
            <Slider key={`${p.title}-${i}`} item={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
