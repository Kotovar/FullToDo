export const styles = {
  addSubtask: 'flex items-center gap-2 bg-light rounded-sm',
  addTask:
    'shadow-[0_4px_4px_0_oklch(0%_0_0_/_25%)] bg-grey-light rounded grid gap-x-2',
  addTaskText: 'grid-cols-[auto_1fr] bg-light',
  addTaskDate: 'grid-cols-[auto_1fr_auto]',
  input: 'min-w-0 outline-0 w-full placeholder:text-grey',
  dateInput: 'w-fit [&::-webkit-calendar-picker-indicator]:hidden',
} as const;

export const ICONS = {
  text: 'plus',
  date: 'calendar',
} as const;
