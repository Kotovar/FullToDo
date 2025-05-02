import { Notepad } from '@shared/schemas';

export const commonNotepads: Omit<Notepad, 'tasks'>[] = [
  { title: 'Сегодня', _id: 'today' },
  { title: 'Задачи', _id: 'all' },
];

export const commonNotepadTitles = commonNotepads.map(task => task._id);
