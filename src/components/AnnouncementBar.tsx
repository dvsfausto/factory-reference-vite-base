import { ANNOUNCEMENT } from '~/lib/chrome-extras'

/**
 * The announcement strip (ZB-451). Renders nothing unless the business set one. One line, never wraps: a long text is
 * cut with an ellipsis rather than pushing the header down. The owner's colours when set (validated hex), else the
 * site's CTA slot, so it always reads on its own ground.
 */
export function AnnouncementBar() {
  if (!ANNOUNCEMENT) return null
  const own = ANNOUNCEMENT.bg ? { background: ANNOUNCEMENT.bg, color: ANNOUNCEMENT.fg ?? '#ffffff' } : undefined
  return (
    <div
      data-announcement=""
      className={`flex h-9 items-center justify-center overflow-hidden px-4 text-center text-[13px] font-bold uppercase tracking-[0.08em] ${own ? '' : 'bg-cta text-cta-foreground'}`}
      style={own}
    >
      <p className="truncate leading-normal">{ANNOUNCEMENT.text}</p>
    </div>
  )
}
