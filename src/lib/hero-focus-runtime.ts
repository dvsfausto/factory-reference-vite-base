// ★ THE PORTRAIT RULE, IN THE BROWSER (see hero-focus.ts). The server cannot know a photo's shape, so the rule runs once the
// photo has loaded: a hero photo with no explicit focal point that is clearly taller than it is wide is anchored towards its
// top. Idempotent; safe to call on every navigation.
import { PORTRAIT_DEFAULT_FOCUS } from './hero-focus'

const PORTRAIT_RATIO = 1.15

function settle(img: HTMLImageElement): void {
  if (img.dataset.heroFocusSettled === '1') return
  if (img.style.objectPosition) { img.dataset.heroFocusSettled = '1'; return } // the owner's own point wins
  if (!img.naturalWidth || !img.naturalHeight) return
  if (img.naturalHeight > img.naturalWidth * PORTRAIT_RATIO) img.style.objectPosition = PORTRAIT_DEFAULT_FOCUS
  img.dataset.heroFocusSettled = '1'
}

export function applyHeroFocusRule(root: ParentNode = document): void {
  root.querySelectorAll<HTMLImageElement>('img[data-hero-photo]').forEach((img) => {
    if (img.complete) settle(img)
    else img.addEventListener('load', () => settle(img), { once: true })
  })
}
