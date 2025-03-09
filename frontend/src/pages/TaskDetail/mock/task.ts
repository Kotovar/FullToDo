import { Notepad, Task } from '@sharedCommon/*';

export const NOTEPADS: Notepad[] = [
  { title: 'Сегодня', _id: 'today', tasks: [] },
  { title: 'Задачи', _id: 'all', tasks: [] },
  { title: 'Рабочее', _id: '1', tasks: [] },
  { title: 'Дом', _id: '2', tasks: [] },
  { title: 'Быт', _id: '3', tasks: [] },
];

export const TASKS1: Task[] = [
  {
    title: 'Задача 1',
    _id: '1',
    notepadId: '1',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { isCompleted: false, title: 'Выучить Node.js' },
      { isCompleted: true, title: 'Выучить js' },
      { isCompleted: false, title: 'Выучить GO' },
      { isCompleted: false, title: 'Выучить Nest.js' },
      { isCompleted: false, title: 'Выучить Express' },
    ],
  },
  {
    title: 'Задача 2',
    _id: '2',
    notepadId: '1',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { isCompleted: false, title: 'Выучить Python' },
      { isCompleted: true, title: 'Выучить css' },
      { isCompleted: true, title: 'Выучить http' },
    ],
  },
  {
    title: 'Задача 3',
    _id: '3',
    notepadId: '1',
    createdDate: new Date(),
    isCompleted: false,
    subtasks: [
      { isCompleted: true, title: 'Выучить Python' },
      { isCompleted: true, title: 'Выучить css' },
      { isCompleted: true, title: 'Выучить http' },
    ],
  },
  {
    title: 'Задача 4',
    _id: '4',
    notepadId: '1',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { isCompleted: false, title: 'Выучить Python' },
      { isCompleted: true, title: 'Выучить css' },
      { isCompleted: true, title: 'Выучить http' },
    ],
  },
  {
    title: 'Задача 5',
    _id: '5',
    notepadId: '1',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { isCompleted: false, title: 'Выучить Python' },
      { isCompleted: true, title: 'Выучить css' },
      { isCompleted: true, title: 'Выучить http' },
    ],
  },
  {
    title: 'Задача 6',
    _id: '6',
    notepadId: '1',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { isCompleted: false, title: 'Выучить Python' },
      { isCompleted: true, title: 'Выучить css' },
      { isCompleted: true, title: 'Выучить http' },
    ],
  },
  {
    title: 'Задача 7',
    _id: '7',
    notepadId: '1',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { isCompleted: false, title: 'Выучить Python' },
      { isCompleted: true, title: 'Выучить css' },
      { isCompleted: true, title: 'Выучить http' },
    ],
  },
  {
    title: 'Задача 8',
    _id: '8',
    notepadId: '1',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { isCompleted: false, title: 'Выучить Python' },
      { isCompleted: true, title: 'Выучить css' },
      { isCompleted: true, title: 'Выучить http' },
    ],
  },
  {
    title: 'Задача 9',
    _id: '9',
    notepadId: '1',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { isCompleted: false, title: 'Выучить Python' },
      { isCompleted: true, title: 'Выучить css' },
      { isCompleted: true, title: 'Выучить http' },
    ],
  },
  {
    title: 'Задача 10',
    _id: '10',
    notepadId: '1',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { isCompleted: false, title: 'Выучить Python' },
      { isCompleted: true, title: 'Выучить css' },
      { isCompleted: true, title: 'Выучить http' },
    ],
  },
];
export const TASKS2: Task[] = [
  {
    title: 'Задача 3',
    _id: '3',
    notepadId: '2',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { isCompleted: false, title: 'Выучить Python' },
      { isCompleted: true, title: 'Выучить css' },
      { isCompleted: true, title: 'Выучить http' },
    ],
  },
  {
    title: 'Задача 4',
    _id: '4',
    notepadId: '2',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { isCompleted: false, title: 'Выучить Python' },
      { isCompleted: true, title: 'Выучить css' },
      { isCompleted: true, title: 'Выучить http' },
    ],
  },
];
export const TASKS3: Task[] = [
  {
    title: 'Задача 1',
    _id: '5',
    notepadId: '3',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { isCompleted: false, title: 'Выучить Python' },
      { isCompleted: true, title: 'Выучить css' },
      { isCompleted: true, title: 'Выучить http' },
    ],
  },
  {
    title: 'Задача 3',
    _id: '6',
    notepadId: '3',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { isCompleted: false, title: 'Выучить Python' },
      { isCompleted: true, title: 'Выучить css' },
      { isCompleted: true, title: 'Выучить http' },
    ],
  },
  {
    title: 'Задача 5',
    _id: '7',
    notepadId: '3',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { isCompleted: false, title: 'Выучить Python' },
      { isCompleted: true, title: 'Выучить css' },
      { isCompleted: true, title: 'Выучить http' },
    ],
  },
];
