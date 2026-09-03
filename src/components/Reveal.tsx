import { useEffect, useRef, useState } from 'react'

/**
 * WOW motion layer — the single SSR-safe scroll-reveal wrapper at the `renderBlock` chokepoint
 * (see routes/index.tsx). Wrapping the render output means EVERY homepage section gains a gentle
 * in-view reveal at once, without touching any block's props or content contract (additive, editor-safe).
 *
 * Progressive enhancement (SEO/no-JS safe): the content renders VISIBLE on the server and with JS
 * disabled. The hidden start-state is applied ONLY when the client has set `.js-reveal` on <html>
 * (a blocking inline script in __root.tsx sets it before first paint → no flash). This component just
 * flips `.reveal-in` when the element enters the viewport. `prefers-reduced-motion` is honoured in app.css.
 * `disabled` skips the effect for above-the-fold blocks (e.g. the hero, which has its own entrance).
 */
export function Reveal({
  children,
  disabled = false,
}: {
  children: React.ReactNode
  disabled?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (disabled) return
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    // ★★★ TALL-ELEMENT GUARD (2026-09-03). intersectionRatio = visible / element, so an element
    // taller than (0.92 × viewport) / 0.12 — ≈5,090px on an iPhone (innerHeight 664) — can NEVER
    // reach 0.12 and stays at opacity 0 forever. That blanked the lower half of every service page
    // on 19 businesses. The designed fix is one Reveal per rendered section (SELF_REVEALING_BLOCKS
    // in render-section.tsx); this guard keeps the primitive safe for any block that is still
    // wrapped whole: the 0.12 entrance stays for every normal section, and only an element that
    // cannot reach it is revealed once about half a viewport of it is on screen. Never threshold 0.
    const rootH = window.innerHeight * 0.92
    const cap = (rootH * 0.5) / Math.max(el.offsetHeight, 1)
    const threshold = Math.min(0.12, cap)
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true)
            io.disconnect()
          }
        }),
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [disabled])

  return (
    <div ref={ref} data-reveal className={disabled || inView ? 'reveal-in' : undefined}>
      {children}
    </div>
  )
}
