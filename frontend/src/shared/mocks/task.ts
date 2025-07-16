import type {
  Subtask,
  Task,
  TaskResponse,
  NotepadResponse,
  NotepadWithoutTasksResponse,
} from '@sharedCommon/*';

export const MOCK_SUBTASK: Subtask = {
  isCompleted: false,
  title: 'Выучить Node.js',
  _id: '1',
};

export const MOCK_SUBTASK_OTHER: Subtask = {
  isCompleted: true,
  title: 'Выучить Nest.js',
  _id: '2',
};

export const MOCK_TASK: Task = {
  title: 'Задача 1',
  notepadId: '1',
  _id: '1',
  description: 'Описание для задачи 1',
  createdDate: new Date('2025-04-11T06:26:26.561Z'),
  dueDate: new Date('2025-04-11T06:26:26.561Z'),
  isCompleted: false,
  progress: '1 из 5',
  subtasks: [MOCK_SUBTASK],
};

export const MOCK_SINGE_TASK_RESPONSE: TaskResponse = {
  status: 200,
  message: 'Success',
  data: {
    title: 'Задача 1',
    notepadId: '1',
    _id: '1',
    description: 'Описание для задачи 1',
    createdDate: new Date('2025-04-11T06:26:26.561Z'),
    isCompleted: false,
    progress: '1 из 5',
    subtasks: [
      {
        isCompleted: false,
        title: 'Выучить Node.js',
        _id: '1',
      },
      {
        isCompleted: true,
        title: 'Выучить js',
        _id: '2',
      },
      {
        isCompleted: false,
        title: 'Выучить GO',
        _id: '3',
      },
      {
        isCompleted: false,
        title: 'Выучить Nest.js',
        _id: '4',
      },
      {
        isCompleted: false,
        title: 'Выучить Express',
        _id: '5',
      },
    ],
  },
};

export const MOCK_SINGE_NOTEPAD_RESPONSE: NotepadResponse = {
  status: 200,
  message: 'Success',
  data: {
    title: '123',
    _id: '123',
    tasks: [
      {
        _id: '12',
        notepadId: '1',
        title: 'Задача 12',
        description: 'Описание для задачи 3',
        isCompleted: false,
        createdDate: new Date('2025-04-14T05:36:46.981Z'),
        progress: '2 из 3',
        subtasks: [
          {
            isCompleted: false,
            title: 'Выучить Python2',
            _id: '1',
          },
          {
            isCompleted: true,
            title: 'Выучить css2',
            _id: '2',
          },
          {
            isCompleted: true,
            title: 'Выучить http2',
            _id: '3',
          },
        ],
      },
      {
        _id: '13',
        notepadId: '2',
        title: 'Задача 13',
        isCompleted: false,
        createdDate: new Date('2025-04-14T05:36:46.981Z'),
        progress: '2 из 3',
        subtasks: [
          {
            isCompleted: false,
            title: 'Выучить Python2',
            _id: '1',
          },
          {
            isCompleted: true,
            title: 'Выучить css2',
            _id: '2',
          },
          {
            isCompleted: true,
            title: 'Выучить http2',
            _id: '3',
          },
        ],
      },
    ],
  },
};

export const MOCK_SINGE_NOTEPAD_RESPONSE_WITH_PARAMS: NotepadWithoutTasksResponse =
  {
    status: 200,
    message: 'Success',
    data: [],
  };

export const MOCK_TASK_UPDATE_RESPONSE: TaskResponse = {
  status: 200,
  message: 'A task with the _id 1 has been successfully updated',
  data: {
    _id: '1',
    notepadId: '1',
    title: 'new23211',
    description: 'Описание для задачи 1',
    dueDate: new Date('2025-04-14T05:36:46.981Z'),
    createdDate: new Date('2025-04-14T05:36:46.981Z'),
    isCompleted: false,
    progress: '1 из 5',
    subtasks: [
      {
        isCompleted: false,
        title: 'Выучить Node.js',
        _id: '1',
      },
      {
        isCompleted: true,
        title: 'Выучить js',
        _id: '2',
      },
      {
        isCompleted: false,
        title: 'Выучить GO',
        _id: '3',
      },
      {
        isCompleted: false,
        title: 'Выучить Nest.js',
        _id: '4',
      },
      {
        isCompleted: false,
        title: 'Выучить Express',
        _id: '5',
      },
    ],
  },
};
