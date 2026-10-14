import { ClassScheduleWeekBlock } from './ClassScheduleWeekBlock'
import { ClassScheduleConnectedBlock } from './ClassScheduleConnectedBlock'

// Per-type variant map (additive, like HERO_VARIANTS). One composition today: the week grid. Listed in the
// editor's manifest so the block is swappable the day a second one exists (niche arc Stage 5b).
export const CLASS_SCHEDULE_VARIANTS: Record<string, typeof ClassScheduleWeekBlock> = {
  week: ClassScheduleWeekBlock,
  // 2026-10-14 (the trainer-led homepage): the words beside a phone frame holding the live next classes, packs and My bookings
  connected: ClassScheduleConnectedBlock,
}
