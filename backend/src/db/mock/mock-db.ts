import type { Task, Notepad } from '@shared/schemas';

const TASKS1: Task[] = [
  {
    _id: '1',
    notepadId: '1',
    title: 'Задача 1',
    description: 'Описание для задачи 1',
    dueDate: new Date(),
    createdDate: new Date(),
    isCompleted: false,
    subtasks: [
      { isCompleted: false, title: 'Выучить Node.js' },
      { isCompleted: true, title: 'Выучить js' },
      { isCompleted: false, title: 'Выучить GO' },
      { isCompleted: false, title: 'Выучить Nest.js' },
      { isCompleted: false, title: 'Выучить Express' },
    ],
  },
  {
    _id: '2',
    notepadId: '1',
    title: 'Задача 2',
    description: 'Описание для задачи 2',
    isCompleted: false,
    createdDate: new Date(),
    priority: 'low',
    subtasks: [
      { isCompleted: false, title: 'Выучить Python1' },
      { isCompleted: true, title: 'Выучить css1' },
      { isCompleted: true, title: 'Выучить http1' },
    ],
  },
  {
    _id: '3',
    notepadId: '1',
    title: 'Задача 3',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { isCompleted: true, title: 'Выучить Python1' },
      { isCompleted: true, title: 'Выучить css1' },
      { isCompleted: true, title: 'Выучить http1' },
    ],
  },
  {
    _id: '4',
    notepadId: '1',
    title: 'Задача 4',
    description: 'Описание для задачи 4',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { isCompleted: false, title: 'Выучить Python1' },
      { isCompleted: true, title: 'Выучить css1' },
      { isCompleted: true, title: 'Выучить http1' },
    ],
  },
  {
    _id: '5',
    notepadId: '1',
    title: 'Задача 4',
    description: 'Описание для задачи 4',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { isCompleted: false, title: 'Выучить Python1' },
      { isCompleted: true, title: 'Выучить css1' },
      { isCompleted: true, title: 'Выучить http1' },
    ],
  },
  {
    _id: '6',
    notepadId: '1',
    title: 'Задача 4',
    description: 'Описание для задачи 4',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { isCompleted: false, title: 'Выучить Python1' },
      { isCompleted: true, title: 'Выучить css1' },
      { isCompleted: true, title: 'Выучить http1' },
    ],
  },
  {
    _id: '7',
    notepadId: '1',
    title: 'Задача 4',
    description: 'Описание для задачи 4',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { isCompleted: false, title: 'Выучить Python1' },
      { isCompleted: true, title: 'Выучить css1' },
      { isCompleted: true, title: 'Выучить http1' },
    ],
  },
  {
    _id: '8',
    notepadId: '1',
    title: 'Задача 4',
    description: 'Описание для задачи 4',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { isCompleted: false, title: 'Выучить Python1' },
      { isCompleted: true, title: 'Выучить css1' },
      { isCompleted: true, title: 'Выучить http1' },
    ],
  },
  {
    _id: '9',
    notepadId: '1',
    title: 'Задача 4',
    description: 'Описание для задачи 4',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { isCompleted: false, title: 'Выучить Python1' },
      { isCompleted: true, title: 'Выучить css1' },
      { isCompleted: true, title: 'Выучить http1' },
    ],
  },
  {
    _id: '10',
    notepadId: '1',
    title: 'Задача 4',
    description: 'Описание для задачи 4',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { isCompleted: false, title: 'Выучить Python1' },
      { isCompleted: true, title: 'Выучить css1' },
      { isCompleted: true, title: 'Выучить http1' },
    ],
  },
  {
    _id: '11',
    notepadId: '1',
    title: 'Задача 4',
    description: 'Описание для задачи 4',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { isCompleted: false, title: 'Выучить Python1' },
      { isCompleted: true, title: 'Выучить css1' },
      { isCompleted: true, title: 'Выучить http1' },
    ],
  },
];

const TASKS2: Task[] = [
  {
    _id: '12',
    notepadId: '2',
    title: 'Задача 3',
    description: 'Описание для задачи 3',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { isCompleted: false, title: 'Выучить Python2' },
      { isCompleted: true, title: 'Выучить css2' },
      { isCompleted: true, title: 'Выучить http2' },
    ],
  },
  {
    _id: '13',
    notepadId: '2',
    title: 'Задача 4',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { isCompleted: false, title: 'Выучить Python2' },
      { isCompleted: true, title: 'Выучить css2' },
      { isCompleted: true, title: 'Выучить http2' },
    ],
  },
];
const TASKS3: Task[] = [
  {
    _id: '14',
    notepadId: '3',
    title: 'Задача 1',
    description: 'Описание для задачи 5',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { isCompleted: false, title: 'Выучить Python3' },
      { isCompleted: true, title: 'Выучить css3' },
      { isCompleted: true, title: 'Выучить http3' },
    ],
  },
  {
    _id: '15',
    notepadId: '3',
    title: 'Задача 3',
    isCompleted: false,
    createdDate: new Date(),
    subtasks: [
      { isCompleted: false, title: 'Выучить Python3' },
      { isCompleted: true, title: 'Выучить css3' },
      { isCompleted: true, title: 'Выучить http3' },
    ],
  },
  {
    _id: '16',
    notepadId: '3',
    title: 'Задача 5',
    description: 'Описание для задачи 5',
    isCompleted: true,
    createdDate: new Date(),
    subtasks: [
      { isCompleted: true, title: 'Выучить Python3' },
      { isCompleted: true, title: 'Выучить css3' },
      { isCompleted: true, title: 'Выучить http3' },
    ],
  },
];

const TASKS4: Task[] = [];

export const NOTEPADS: Notepad[] = [
  { title: 'Рабочее', _id: '1', tasks: TASKS1 },
  { title: 'Дом', _id: '2', tasks: TASKS2 },
  { title: 'Быт', _id: '3', tasks: TASKS3 },
  { title: 'Временный', _id: '4', tasks: TASKS4 },
];
