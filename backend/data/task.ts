import { Notebook, Priority, Task } from '../src/models/Task';

export const TASKS1: Task[] = [
  {
    id: '1',
    notebookId: '1',
    title: 'Задача 1',
    description: 'Описание для задачи 1',
    dueDate: new Date(),
    createdDate: new Date(),
    isCompleted: false,
    subtasks: [
      { completed: false, title: 'Выучить Node.js' },
      { completed: true, title: 'Выучить js' },
      { completed: false, title: 'Выучить GO' },
      { completed: false, title: 'Выучить Nest.js' },
      { completed: false, title: 'Выучить Express' },
    ],
  },
  {
    id: '2',
    notebookId: '1',
    title: 'Задача 2',
    description: 'Описание для задачи 2',
    isCompleted: false,
    createdDate: new Date(),
    priority: Priority.Low,
    subtasks: [
      { completed: false, title: 'Выучить Python1' },
      { completed: true, title: 'Выучить css1' },
      { completed: true, title: 'Выучить http1' },
    ],
  },
  {
    id: '3',
    notebookId: '1',
    title: 'Задача 3',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { completed: true, title: 'Выучить Python1' },
      { completed: true, title: 'Выучить css1' },
      { completed: true, title: 'Выучить http1' },
    ],
  },
  {
    id: '4',
    notebookId: '1',
    title: 'Задача 4',
    description: 'Описание для задачи 4',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { completed: false, title: 'Выучить Python1' },
      { completed: true, title: 'Выучить css1' },
      { completed: true, title: 'Выучить http1' },
    ],
  },
  {
    id: '5',
    notebookId: '1',
    title: 'Задача 4',
    description: 'Описание для задачи 4',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { completed: false, title: 'Выучить Python1' },
      { completed: true, title: 'Выучить css1' },
      { completed: true, title: 'Выучить http1' },
    ],
  },
  {
    id: '6',
    notebookId: '1',
    title: 'Задача 4',
    description: 'Описание для задачи 4',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { completed: false, title: 'Выучить Python1' },
      { completed: true, title: 'Выучить css1' },
      { completed: true, title: 'Выучить http1' },
    ],
  },
  {
    id: '7',
    notebookId: '1',
    title: 'Задача 4',
    description: 'Описание для задачи 4',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { completed: false, title: 'Выучить Python1' },
      { completed: true, title: 'Выучить css1' },
      { completed: true, title: 'Выучить http1' },
    ],
  },
  {
    id: '8',
    notebookId: '1',
    title: 'Задача 4',
    description: 'Описание для задачи 4',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { completed: false, title: 'Выучить Python1' },
      { completed: true, title: 'Выучить css1' },
      { completed: true, title: 'Выучить http1' },
    ],
  },
  {
    id: '9',
    notebookId: '1',
    title: 'Задача 4',
    description: 'Описание для задачи 4',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { completed: false, title: 'Выучить Python1' },
      { completed: true, title: 'Выучить css1' },
      { completed: true, title: 'Выучить http1' },
    ],
  },
  {
    id: '10',
    notebookId: '1',
    title: 'Задача 4',
    description: 'Описание для задачи 4',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { completed: false, title: 'Выучить Python1' },
      { completed: true, title: 'Выучить css1' },
      { completed: true, title: 'Выучить http1' },
    ],
  },
  {
    id: '11',
    notebookId: '1',
    title: 'Задача 4',
    description: 'Описание для задачи 4',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { completed: false, title: 'Выучить Python1' },
      { completed: true, title: 'Выучить css1' },
      { completed: true, title: 'Выучить http1' },
    ],
  },
];

export const TASKS2: Task[] = [
  {
    id: '12',
    notebookId: '2',
    title: 'Задача 3',
    description: 'Описание для задачи 3',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { completed: false, title: 'Выучить Python2' },
      { completed: true, title: 'Выучить css2' },
      { completed: true, title: 'Выучить http2' },
    ],
  },
  {
    id: '13',
    notebookId: '2',
    title: 'Задача 4',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { completed: false, title: 'Выучить Python2' },
      { completed: true, title: 'Выучить css2' },
      { completed: true, title: 'Выучить http2' },
    ],
  },
];
export const TASKS3: Task[] = [
  {
    id: '14',
    notebookId: '3',
    title: 'Задача 1',
    description: 'Описание для задачи 5',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { completed: false, title: 'Выучить Python3' },
      { completed: true, title: 'Выучить css3' },
      { completed: true, title: 'Выучить http3' },
    ],
  },
  {
    id: '15',
    notebookId: '3',
    title: 'Задача 3',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { completed: false, title: 'Выучить Python3' },
      { completed: true, title: 'Выучить css3' },
      { completed: true, title: 'Выучить http3' },
    ],
  },
  {
    id: '16',
    notebookId: '3',
    title: 'Задача 5',
    description: 'Описание для задачи 5',
    isCompleted: true,
    createdDate: new Date(),
    subtasks: [
      { completed: true, title: 'Выучить Python3' },
      { completed: true, title: 'Выучить css3' },
      { completed: true, title: 'Выучить http3' },
    ],
  },
];

export const NOTEPADS: Notebook[] = [
  { name: 'Рабочее', createdDate: new Date(), id: '1', tasks: TASKS1 },
  { name: 'Дом', createdDate: new Date(), id: '2', tasks: TASKS2 },
  { name: 'Быт', createdDate: new Date(), id: '3', tasks: TASKS3 },
];

export const ALL_TASKS = [...TASKS1, ...TASKS2, ...TASKS3];
