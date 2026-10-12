import type { SocialPlatform } from '~/lib/social-profiles'

// The three platform marks, drawn simply in currentColor (no brand files, no external requests). Decorative: the link around
// the icon carries the platform's name for screen readers.
export function SocialIcon({ platform, className = 'h-5 w-5' }: { platform: SocialPlatform; className?: string }) {
  if (platform === 'instagram')
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
      </svg>
    )
  if (platform === 'tiktok')
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
        <path d="M16.2 3c.3 2.3 1.8 3.9 4 4.1v3.3c-1.5 0-2.9-.5-4-1.3v6.3a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v3.4a2.3 2.3 0 1 0 1.4 2.1V3h3.3Z" />
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M13.5 21v-7.5H16l.5-3h-3V8.6c0-.9.3-1.6 1.6-1.6h1.6V4.3c-.3 0-1.3-.1-2.4-.1-2.4 0-3.9 1.4-3.9 4v2.3H7.9v3h2.5V21h3.1Z" />
    </svg>
  )
}
