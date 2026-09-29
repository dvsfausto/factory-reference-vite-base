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
    // ★★★ TALL-ELEMENT GUARD (2026-09-03, re-done 2026-09-29). intersectionRatio = visible / element, so an
    // element taller than (0.92 × viewport) / 0.12 — ≈5,090px on an iPhone — can NEVER reach 0.12 and stays
    // at opacity 0 forever. The 09-03 guard measured the element ONCE, when the observer was made; a block
    // that GROWS after mount (the class timetable's live read landed 51 dated classes = 6,733px on a phone)
    // outgrew its own guard and blanked the page from "About" to the FAQs (Fitcycling, 2026-09-29). So the
    // decision is now made on EVERY callback against the element's size AT THAT MOMENT: a normal section
    // still enters at 0.12 of itself; any section that cannot reach 0.12 enters once about half a viewport
    // of it is on screen (intersectionRect, in pixels). The observer fires at each 0.01 step up to 0.12 so
    // the pixel rule is checked often enough on a tall element. Never threshold 0.
    const rootH = window.innerHeight * 0.92
    const steps = Array.from({ length: 12 }, (_, i) => (i + 1) / 100)
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const shown = e.intersectionRect.height
          const cap = Math.min(0.12, (rootH * 0.5) / Math.max(e.boundingClientRect.height, 1))
          if (e.intersectionRatio >= cap || shown >= rootH * 0.5) {
            setInView(true)
            io.disconnect()
          }
        }),
      { threshold: steps, rootMargin: '0px 0px -8% 0px' },
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
