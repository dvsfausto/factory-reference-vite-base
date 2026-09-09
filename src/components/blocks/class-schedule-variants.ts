import { ClassScheduleWeekBlock } from './ClassScheduleWeekBlock'

// Per-type variant map (additive, like HERO_VARIANTS). One composition today: the week grid. Listed in the
// editor's manifest so the block is swappable the day a second one exists (niche arc Stage 5b).
export const CLASS_SCHEDULE_VARIANTS: Record<string, typeof ClassScheduleWeekBlock> = {
  week: ClassScheduleWeekBlock,
}
