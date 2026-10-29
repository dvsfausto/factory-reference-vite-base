import type { CSSProperties } from 'react'
import { tr } from '~/lib/i18n'
import { imageSrc } from '~/lib/asset-url'
import { hasText } from '~/lib/has-text'
import { piecesIn, pieceText, httpsOr } from '~/lib/showcase'
import { GoldHeading } from '~/components/showcase/Primitives'
import { ShowcaseCta } from '~/components/showcase/ShowcaseCta'

// richText VARIANT: 'showcase-collage' (the Showcase theme, 2026-10-29). Piece cutouts scattered on the white page around a
// centred headline (params.heading, the gold-word rule), one short line (params.body) and one button (params.buttonLabel,
// default "Explore"; params.buttonHref when it is an https link, else the pieces grid at /#pieces). The cutouts are the
// gallery items whose category is 'collage' (6 to 8 used): product photos on white or light grounds, multiplied onto the page
// so they read as cutouts. Desktop: absolutely placed around the words at different sizes. Phone: four smaller ones, two above
// and two below the words, never over them. No cutouts and no heading: nothing.

// the desktop scatter: [left or right edge, %, top %, width in vw, max px]; the middle third stays clear for the words
const SPOTS: Array<{ side: 'left' | 'right'; x: number; y: number; w: number; max: number }> = [
  { side: 'left', x: 3, y: 6, w: 15, max: 230 },
  { side: 'left', x: 21, y: 0, w: 9, max: 140 },
  { side: 'right', x: 4, y: 3, w: 13, max: 200 },
  { side: 'right', x: 20, y: 14, w: 8, max: 120 },
  { side: 'left', x: 2, y: 58, w: 11, max: 170 },
  { side: 'left', x: 17, y: 72, w: 14, max: 210 },
  { side: 'right', x: 3, y: 60, w: 15, max: 230 },
  { side: 'right', x: 21, y: 78, w: 9, max: 140 },
]

export function RichTextShowcaseCollageBlock({
  heading,
  body,
  buttonLabel,
  buttonHref,
}: {
  heading?: string
  body?: string
  buttonLabel?: string
  buttonHref?: string
}) {
  const cutouts = piecesIn('collage').slice(0, 8)
  if (cutouts.length === 0 && !hasText(heading)) return null
  const alt = (i: number) => cutouts[i]!.alt ?? pieceText(cutouts[i]!).name
  const phone = cutouts.slice(0, 4)
  const img = (i: number, className: string, style?: CSSProperties) => (
    <img key={i} src={imageSrc(cutouts[i]!.image)} alt={alt(i)} loading="lazy" className={`mix-blend-multiply object-contain ${className}`} style={style} />
  )
  const words = (
    <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center text-center">
      {hasText(heading) && <GoldHeading text={heading!} className="text-4xl sm:text-5xl lg:text-[64px]" />}
      {hasText(body) && <p className="mt-6 max-w-md font-sans text-[15px] leading-relaxed text-fam-ink-muted">{body}</p>}
      <ShowcaseCta to={httpsOr(buttonHref, '/#pieces')} tone="ink" className="mt-10">{hasText(buttonLabel) ? buttonLabel : tr('showcase.explore')}</ShowcaseCta>
    </div>
  )
  return (
    <section className="relative overflow-hidden bg-fam-page" data-showcase="collage">
      {/* phone: two cutouts, the words, two cutouts; nothing overlaps */}
      <div className="container-x py-section md:hidden">
        {phone.length > 0 && (
          <div className="mb-12 flex items-end justify-between gap-6">
            {phone[0] && img(0, 'w-[42%]')}
            {phone[1] && img(1, 'mt-10 w-[30%]')}
          </div>
        )}
        {words}
        {phone.length > 2 && (
          <div className="mt-12 flex items-start justify-between gap-6">
            {phone[2] && img(2, 'mt-6 w-[32%]')}
            {phone[3] && img(3, 'w-[44%]')}
          </div>
        )}
      </div>
      {/* tablet and up: the scatter around the clear middle */}
      <div className="hidden py-section md:block">
      <div className="relative flex min-h-[640px] items-center justify-center lg:min-h-[760px]">
        {cutouts.map((_, i) => {
          const s = SPOTS[i]!
          return img(i, 'absolute h-auto', { [s.side]: `${s.x}%`, top: `${s.y}%`, width: `min(${s.w}vw, ${s.max}px)` })
        })}
        <div className="px-8">{words}</div>
      </div>
      </div>
    </section>
  )
}
