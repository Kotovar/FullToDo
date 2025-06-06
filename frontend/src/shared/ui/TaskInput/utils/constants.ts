export const styles = {
  addSubtask: 'flex items-center gap-2',
  addTask: 'shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-grey-light rounded grid',
  addTaskText: 'grid-cols-[auto_1fr] bg-light',
  addTaskDate: 'grid-cols-[auto_1fr_auto]',
  input: 'min-w-0 outline-0 w-full placeholder:text-grey',
  dateInput: 'w-fit [&::-webkit-calendar-picker-indicator]:hidden',
} as const;

export const ICONS = {
  text: 'plus',
  date: 'calendar',
} as const;
