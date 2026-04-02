import {
  commonNotepadId,
  NotepadWithoutTasks,
  PaginatedTasks,
  Task,
} from '@sharedCommon/schemas';
import { TASKS1 } from './mock-db';
import { getMetaMock } from '@tests/utils';

const meta = getMetaMock(TASKS1);

export const validTasksData: PaginatedTasks = {
  tasks: TASKS1,
  meta,
};

export const validTaskDataMock: Task = {
  _id: '1',
  notepadId: '1',
  title: 'Задача 1',
  description: 'Описание для задачи 1',
  dueDate: new Date(),
  createdDate: new Date(),
  isCompleted: false,
  progress: '1 из 5',
  subtasks: [
    { isCompleted: false, title: 'Выучить Node.js', _id: '1' },
    { isCompleted: true, title: 'Выучить js', _id: '2' },
    { isCompleted: false, title: 'Выучить GO', _id: '3' },
    { isCompleted: false, title: 'Выучить Nest.js', _id: '4' },
    { isCompleted: false, title: 'Выучить Express', _id: '5' },
  ],
};

export const validNotepadWithoutTasksData: NotepadWithoutTasks[] = [
  {
    title: 'Задачи',
    _id: commonNotepadId,
  },
];
