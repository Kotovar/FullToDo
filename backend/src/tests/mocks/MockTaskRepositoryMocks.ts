import { NOTEPADS } from '@db/mock';
import {
  COMMON_NOTEPAD_ID,
  PAGINATION,
  USER_ID,
  type Notepad,
} from '@sharedCommon/schemas';

const sameDate = new Date();

export const realId = '1';

export const dates = {
  date1: new Date('2024-01-01'),
  date2: new Date('2024-02-01'),
  date3: new Date('2024-03-01'),
};

export const newTask = {
  title: 'Task title',
  createdDate: new Date(),
  isCompleted: false,
  notepadId: realId,
  dueDate: new Date(),
  description: 'Task description',
  userId: USER_ID,
};

export const allTasks = NOTEPADS.flatMap(notepad => notepad.tasks);
export const paginatedTasks = allTasks.slice(0, PAGINATION.DEFAULT_LIMIT);

export const customNotepad: Notepad[] = [
  {
    title: 'Рабочее',
    _id: realId,
    userId: USER_ID,
    tasks: [{ ...newTask, progress: '', _id: realId }],
  },
];

export const tasksWithUndefined = [
  {
    title: 'Task 1',
    _id: '1',
    userId: USER_ID,
    createdDate: new Date(),
    isCompleted: false,
    notepadId: realId,
    dueDate: undefined,
    description: 'Description 1',
    subtasks: [],
    progress: '',
  },
  {
    title: 'Task 2',
    _id: '2',
    userId: USER_ID,
    createdDate: new Date(),
    isCompleted: false,
    notepadId: realId,
    dueDate: new Date(),
    description: 'Description 2',
    subtasks: [],
    progress: '',
  },
  {
    title: 'Task 3',
    _id: '3',
    userId: USER_ID,
    createdDate: new Date(),
    isCompleted: false,
    notepadId: realId,
    dueDate: undefined,
    description: 'Description 3',
    subtasks: [],
    progress: '',
  },
];

export const tasksWithEqualDates = [
  {
    title: 'Task 1',
    _id: '1',
    userId: USER_ID,
    createdDate: sameDate,
    isCompleted: false,
    notepadId: realId,
    dueDate: sameDate,
    description: 'Description 1',
    subtasks: [],
    progress: '',
  },
  {
    title: 'Task 2',
    _id: '2',
    userId: USER_ID,
    createdDate: sameDate,
    isCompleted: false,
    notepadId: realId,
    dueDate: sameDate,
    description: 'Description 2',
    subtasks: [],
    progress: '',
  },
];

export const tasksWithDifferentDates = [
  {
    title: 'Task 1',
    _id: '1',
    userId: USER_ID,
    createdDate: new Date(),
    isCompleted: false,
    notepadId: realId,
    dueDate: dates.date2,
    description: 'Description 1',
    subtasks: [],
    progress: '',
  },
  {
    title: 'Task 2',
    _id: '2',
    userId: USER_ID,
    createdDate: new Date(),
    isCompleted: false,
    notepadId: realId,
    dueDate: dates.date1,
    description: 'Description 2',
    subtasks: [],
    progress: '',
  },
  {
    title: 'Task 3',
    _id: '3',
    userId: USER_ID,
    createdDate: new Date(),
    isCompleted: false,
    notepadId: realId,
    dueDate: dates.date3,
    description: 'Description 3',
    subtasks: [],
    progress: '',
  },
];

export const tasksWithCommonAndUnrealNotepadIds = [
  {
    title: 'Task 2',
    _id: '1',
    userId: USER_ID,
    createdDate: new Date(),
    isCompleted: false,
    notepadId: COMMON_NOTEPAD_ID,
    dueDate: dates.date1,
    description: 'Description 2',
    subtasks: [],
    progress: '',
  },
  {
    title: 'Task 2',
    _id: '2',
    userId: USER_ID,
    createdDate: new Date(),
    isCompleted: false,
    notepadId: '1111111',
    dueDate: dates.date1,
    description: 'Description 2',
    subtasks: [],
    progress: '',
  },
];
