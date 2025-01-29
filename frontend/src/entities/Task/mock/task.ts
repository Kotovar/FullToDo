import { Task } from '@entities/Task/model';

export const NOTEPADS = [
  { taskName: 'Сегодня', path: '/notepad/today', id: 1 },
  { taskName: 'Задачи', path: '/notepad/all', id: 2 },
  { taskName: 'Рабочее', path: '/notepad/1', id: 3 },
  { taskName: 'Дом', path: '/notepad/2', id: 4 },
  { taskName: 'Быт', path: '/notepad/3', id: 5 },
];

export const TASKS1: Task[] = [
  {
    name: 'Задача 1',
    progress: '1 из 5',
    id: 1,
    notepadId: 1,
    subtasksCompleted: false,
    subtasks: [
      { completed: false, title: 'Выучить Node.js' },
      { completed: true, title: 'Выучить js' },
      { completed: false, title: 'Выучить GO' },
      { completed: false, title: 'Выучить Nest.js' },
      { completed: false, title: 'Выучить Express' },
    ],
  },
  {
    name: 'Задача 2',
    progress: '2 из 3',
    id: 2,
    notepadId: 1,
    subtasksCompleted: false,
    subtasks: [
      { completed: false, title: 'Выучить Python' },
      { completed: true, title: 'Выучить css' },
      { completed: true, title: 'Выучить http' },
    ],
  },
  {
    name: 'Задача 3',
    progress: '2 из 3',
    id: 3,
    notepadId: 1,
    subtasksCompleted: true,
    subtasks: [
      { completed: true, title: 'Выучить Python' },
      { completed: true, title: 'Выучить css' },
      { completed: true, title: 'Выучить http' },
    ],
  },
  {
    name: 'Задача 4',
    progress: '2 из 3',
    id: 4,
    notepadId: 1,
    subtasksCompleted: false,
    subtasks: [
      { completed: false, title: 'Выучить Python' },
      { completed: true, title: 'Выучить css' },
      { completed: true, title: 'Выучить http' },
    ],
  },
  {
    name: 'Задача 5',
    progress: '2 из 3',
    id: 5,
    notepadId: 1,
    subtasksCompleted: false,
    subtasks: [
      { completed: false, title: 'Выучить Python' },
      { completed: true, title: 'Выучить css' },
      { completed: true, title: 'Выучить http' },
    ],
  },
  {
    name: 'Задача 6',
    progress: '2 из 3',
    id: 6,
    notepadId: 1,
    subtasksCompleted: false,
    subtasks: [
      { completed: false, title: 'Выучить Python' },
      { completed: true, title: 'Выучить css' },
      { completed: true, title: 'Выучить http' },
    ],
  },
  {
    name: 'Задача 7',
    progress: '2 из 3',
    id: 7,
    notepadId: 1,
    subtasksCompleted: false,
    subtasks: [
      { completed: false, title: 'Выучить Python' },
      { completed: true, title: 'Выучить css' },
      { completed: true, title: 'Выучить http' },
    ],
  },
  {
    name: 'Задача 8',
    progress: '2 из 3',
    id: 8,
    notepadId: 1,
    subtasksCompleted: false,
    subtasks: [
      { completed: false, title: 'Выучить Python' },
      { completed: true, title: 'Выучить css' },
      { completed: true, title: 'Выучить http' },
    ],
  },
  {
    name: 'Задача 9',
    progress: '2 из 3',
    id: 9,
    notepadId: 1,
    subtasksCompleted: false,
    subtasks: [
      { completed: false, title: 'Выучить Python' },
      { completed: true, title: 'Выучить css' },
      { completed: true, title: 'Выучить http' },
    ],
  },
  {
    name: 'Задача 10',
    progress: '2 из 3',
    id: 10,
    notepadId: 1,
    subtasksCompleted: false,
    subtasks: [
      { completed: false, title: 'Выучить Python' },
      { completed: true, title: 'Выучить css' },
      { completed: true, title: 'Выучить http' },
    ],
  },
];
export const TASKS2: Task[] = [
  {
    name: 'Задача 3',
    progress: '0 из 1',
    id: 3,
    notepadId: 2,
    subtasksCompleted: false,
    subtasks: [
      { completed: false, title: 'Выучить Python' },
      { completed: true, title: 'Выучить css' },
      { completed: true, title: 'Выучить http' },
    ],
  },
  {
    name: 'Задача 4',
    progress: '7 из 8',
    id: 4,
    notepadId: 2,
    subtasksCompleted: false,
    subtasks: [
      { completed: false, title: 'Выучить Python' },
      { completed: true, title: 'Выучить css' },
      { completed: true, title: 'Выучить http' },
    ],
  },
];
export const TASKS3: Task[] = [
  {
    name: 'Задача 1',
    progress: '1 из 5',
    id: 5,
    notepadId: 3,
    subtasksCompleted: false,
    subtasks: [
      { completed: false, title: 'Выучить Python' },
      { completed: true, title: 'Выучить css' },
      { completed: true, title: 'Выучить http' },
    ],
  },
  {
    name: 'Задача 3',
    progress: '0 из 1',
    id: 6,
    notepadId: 3,
    subtasksCompleted: false,
    subtasks: [
      { completed: false, title: 'Выучить Python' },
      { completed: true, title: 'Выучить css' },
      { completed: true, title: 'Выучить http' },
    ],
  },
  {
    name: 'Задача 5',
    progress: '0 из 3',
    id: 7,
    notepadId: 3,
    subtasksCompleted: false,
    subtasks: [
      { completed: false, title: 'Выучить Python' },
      { completed: true, title: 'Выучить css' },
      { completed: true, title: 'Выучить http' },
    ],
  },
];
