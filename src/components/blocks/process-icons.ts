import {
  Phone,
  CalendarCheck,
  ClipboardList,
  Wrench,
  Sparkles,
  ShieldCheck,
  MessageSquare,
  ThumbsUp,
  type LucideIcon,
} from 'lucide-react'

// Optional per-step icon lookup for the process section. A step's optional `icon`
// string maps to a lucide icon; when absent or unknown the layouts fall back to
// the step's NUMBER badge. Kept in its own module (no component imports) so the
// variants map and the components can both use it without a cycle.
const ICONS: Record<string, LucideIcon> = {
  phone: Phone,
  calendar: CalendarCheck,
  clipboard: ClipboardList,
  wrench: Wrench,
  sparkles: Sparkles,
  shield: ShieldCheck,
  message: MessageSquare,
  thumbsup: ThumbsUp,
}

export function getProcessIcon(name?: string): LucideIcon | null {
  if (!name) return null
  return ICONS[name] ?? null
}
