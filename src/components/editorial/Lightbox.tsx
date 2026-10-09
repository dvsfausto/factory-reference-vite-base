import { useEffect, useState } from 'react'

/* ★ A LIGHTBOX (ZB-147): tap a photo, see it large on a dark ground; arrows and swipe move through the set; Escape, the X or a tap
   outside close it. A native <dialog>, so the browser handles focus and the back button; nothing renders until opened. */
export type LightboxPhoto = { src: string; alt: string }

export function useLightbox(photos: LightboxPhoto[]) {
  const [index, setIndex] = useState<number | null>(null)
  const open = (i: number) => setIndex(i)
  const close = () => setIndex(null)
  const step = (d: number) => setIndex((i) => (i === null ? null : (i + d + photos.length) % photos.length))
  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1) }
    window.addEventListener('keydown', onKey); document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [index]) // eslint-disable-line react-hooks/exhaustive-deps
  return { index, open, close, step }
}

export function Lightbox({ photos, index, onClose, onStep, closeLabel, prevLabel, nextLabel }: { photos: LightboxPhoto[]; index: number | null; onClose: () => void; onStep: (d: number) => void; closeLabel: string; prevLabel: string; nextLabel: string }) {
  const [touchX, setTouchX] = useState<number | null>(null)
  if (index === null || !photos[index]) return null
  const ph = photos[index]!
  return (
    <div role="dialog" aria-modal="true" aria-label={ph.alt} data-lightbox className="fixed inset-0 z-[100] flex items-center justify-center bg-fam-statement-2/95 p-4" onClick={onClose}
      onTouchStart={(e) => setTouchX(e.touches[0]?.clientX ?? null)}
      onTouchEnd={(e) => { const x = e.changedTouches[0]?.clientX; if (touchX !== null && x !== undefined && Math.abs(x - touchX) > 40) onStep(x < touchX ? 1 : -1); setTouchX(null) }}>
      <img src={ph.src} alt={ph.alt} className="max-h-[90vh] max-w-[94vw] object-contain" onClick={(e) => e.stopPropagation()} />
      <button type="button" aria-label={closeLabel} onClick={onClose} className="absolute right-4 top-4 h-11 w-11 font-sans text-2xl leading-none text-fam-on-statement">×</button>
      {photos.length > 1 && (
        <>
          <button type="button" aria-label={prevLabel} onClick={(e) => { e.stopPropagation(); onStep(-1) }} className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 font-sans text-3xl text-fam-on-statement sm:block">‹</button>
          <button type="button" aria-label={nextLabel} onClick={(e) => { e.stopPropagation(); onStep(1) }} className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 font-sans text-3xl text-fam-on-statement sm:block">›</button>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 font-sans text-[11px] uppercase tracking-[0.18em] text-fam-on-statement-muted">{index + 1} / {photos.length}</p>
        </>
      )}
    </div>
  )
}
