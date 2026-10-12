import type { ProcessStep } from './process-variants'
import { SITE } from '~/data/site'
import { hasText } from '~/lib/has-text'
import { tr } from '~/lib/i18n'

// Process LAYOUT: 'video-library' (2026-10-12): the owner's content series as cards, each with her own picture,
// their words and a Watch button to the video (new tab). Reads SITE.steps (a step's optional `image` and `href`).
// HONESTY: no picture → no picture box; no link → no button; no steps → no section. A site gets it only if its layout chooses it.
export function ProcessVideoLibraryBlock({
  site = SITE,
  label,
  heading,
  body,
}: {
  site?: typeof SITE
  label?: string
  heading?: string
  body?: string
}) {
  const steps = (site as { steps?: (ProcessStep & { image?: string; href?: string })[] }).steps
  if (!steps || steps.length === 0) return null
  return (
    <section className="bg-fam-card" data-video-library="">
      <div className="container-x py-section">
        <div className="max-w-2xl">
          {hasText(label) && (
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
              <span className="h-px w-6 bg-fam-accent" />
              {label}
            </span>
          )}
          {hasText(heading) && <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">{heading}</h2>}
          {hasText(body) && <p className="mt-4 text-lg leading-relaxed text-fam-ink-muted">{body}</p>}
        </div>
        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.slice(0, 6).map((s, i) => (
            <li key={`${s.title}-${i}`} className="flex flex-col overflow-hidden rounded-2xl border border-fam-hairline bg-fam-card">
              {s.image && (
                <div className="aspect-square overflow-hidden bg-fam-surface-2">
                  <img src={s.image} alt={s.title} loading="lazy" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl font-semibold tracking-tight text-fam-ink">{s.title}</h3>
                <p className="mt-2 flex-1 leading-relaxed text-fam-ink-muted">{s.description}</p>
                {s.href && (
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${tr('section.watch')}: ${s.title}`}
                    className="mt-6 inline-flex h-11 w-fit items-center gap-2 rounded-full bg-cta px-5 font-display text-sm font-bold text-cta-foreground transition-transform hover:translate-y-(--hov-lift-sm) focus-ring"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor"><path d="M8 5.5v13l11-6.5-11-6.5Z" /></svg>
                    {tr('section.watch')}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
