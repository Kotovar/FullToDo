import { getFormattedDate } from './getFormattedDate';

export const getDateUpdate = (
  taskDate: Date | null | undefined,
  newDate: string,
) => {
  if (newDate === '' && taskDate) return null;
  if (!newDate) return undefined;

  const current = taskDate ? getFormattedDate(taskDate) : null;
  return current !== newDate ? new Date(newDate) : undefined;
};
