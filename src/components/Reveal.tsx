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
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true)
            io.disconnect()
          }
        }),
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
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
