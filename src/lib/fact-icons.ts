// THE ICON REGISTRY, KEYED BY FACT KIND (visual elevation Stage B, 2026-09-10).
//
// A trust card used to take its icon from its POSITION — shield, clock, heart in that order whatever the card said —
// so "Minneapolis bakery" got a shield and "Posted hours" a sparkle. The scaffolder now derives each card's KIND from
// the honest facts it was written from (services · areas · booking · hours · phone · quote · mobile · years · delivery
// · pickup · online · payment · reviews · language) and the icon follows the kind. A card whose kind is unknown gets
// NO icon: the variant renders without the icon slot. Never by position, never invented.
import type { LucideIcon } from 'lucide-react'
import { CalendarCheck, CalendarDays, Clock, CreditCard, FileText, Globe, Languages, LayoutList, MapPin, Navigation, Phone, ShoppingBag, Star, Truck } from 'lucide-react'

export type FactKind =
  | 'services' | 'areas' | 'booking' | 'hours' | 'phone' | 'quote' | 'mobile' | 'years'
  | 'delivery' | 'pickup' | 'online' | 'payment' | 'reviews' | 'language'

export const FACT_ICONS: Readonly<Record<FactKind, LucideIcon>> = {
  services: LayoutList,
  areas: MapPin,
  booking: CalendarCheck,
  hours: Clock,
  phone: Phone,
  quote: FileText,
  mobile: Navigation,
  years: CalendarDays,
  delivery: Truck,
  pickup: ShoppingBag,
  online: Globe,
  payment: CreditCard,
  reviews: Star,
  language: Languages,
}

export interface TrustItem { title: string; description: string; kind?: FactKind | string | null }

/** The icon for a trust card, or null when its kind is unknown — then the card shows no icon. */
export function factIcon(item: TrustItem | null | undefined): LucideIcon | null {
  const k = item?.kind
  return k && Object.prototype.hasOwnProperty.call(FACT_ICONS, k) ? FACT_ICONS[k as FactKind] : null
}
