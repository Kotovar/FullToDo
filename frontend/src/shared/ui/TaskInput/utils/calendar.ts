export type CalendarPosition = 'top' | 'bottom';

export const CALENDAR_MIN_SPACE_PX = 360;

export const getCalendarPosition = (rect: DOMRect): CalendarPosition => {
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;

  if (spaceBelow >= CALENDAR_MIN_SPACE_PX) {
    return 'bottom';
  }

  if (spaceAbove >= CALENDAR_MIN_SPACE_PX) {
    return 'top';
  }

  return spaceBelow >= spaceAbove ? 'bottom' : 'top';
};
