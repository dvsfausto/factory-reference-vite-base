import { useState } from 'react'
import { tr } from '~/lib/i18n'
import { PROJECTS, type GalleryItem } from '~/data/projects'

// Gallery LAYOUT: 'before-after-slider' — an interactive drag-to-reveal slider per
// project, comparing a before and after photo. Character-agnostic. PIPELINE-
// SEEDED: before/after come from optional PROJECTS data fields; only projects that
// carry a pair are shown. Renders the position at 50% on the server and reveals on
// drag in the browser.
//
// HONESTY: pairs are labeled illustrative. A real before/after is a genuine
// customer transformation (the asset-library wiring) — a stock pair would imply a
// job we didn't do, so the seed pairs are explicitly illustrative.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700: emerald-600 handle.
// Radius -> rounded-* (DNA). Font -> font-display (DNA). Light surface component-
// owned (white / slate / #E6E8EC). No CTA by design. Never bg-brand-* / .btn.
function Slider({ item }: { item: GalleryItem }) {
  const [pos, setPos] = useState(50)
  return (
    <figure className="overflow-hidden rounded-2xl border border-[#E6E8EC] bg-white">
      <div className="relative aspect-[4/3] select-none">
        <img src={item.afterImage} alt={`${item.title} — after`} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <img
          src={item.beforeImage}
          alt={`${item.title} — before`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        />
        <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0F172A] backdrop-blur-sm">Before</span>
        <span className="absolute right-3 top-3 rounded-md bg-emerald-600 px-2 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-white">After</span>
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow" style={{ left: `${pos}%` }} />
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Reveal ${item.title} before and after`}
          className="absolute inset-x-0 bottom-4 mx-4 w-[calc(100%-2rem)] accent-emerald-600"
        />
      </div>
      <figcaption className="flex items-center justify-between gap-3 p-4">
        <span className="font-display text-sm font-semibold text-[#0F172A]">{item.title}</span>
        <span className="text-xs italic text-[#94A3B8]">Illustrative</span>
      </figcaption>
    </figure>
  )
}

export function GalleryBeforeAfterBlock({
  label = tr('section.beforeAfter'),
  heading = tr('section.seeTheDifference'),
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const pairs = PROJECTS.filter((p) => p.beforeImage && p.afterImage)
  if (pairs.length === 0) return null
  return (
    <section className="bg-white">
      <div className="container-x py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            <span className="h-px w-6 bg-emerald-600" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">
            {heading}
          </h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-[#64748B]">{body}</p>}
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
