import {
  commonNotepadId,
  type NotepadWithoutTasksResponse,
  type TaskResponse,
  type TasksResponse,
} from '@sharedCommon/schemas';
import { TASKS1 } from './mock-db';

export const validTasksData: TasksResponse = {
  status: 200,
  message: 'Success',
  data: TASKS1,
};

export const validTaskData: TaskResponse = {
  status: 200,
  message: 'Success',
  data: {
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
  },
};

export const validNotepadWithoutTasksData: NotepadWithoutTasksResponse = {
  status: 200,
  message: 'Success',
  data: [
    {
      title: 'Задачи',
      _id: commonNotepadId,
    },
  ],
};
