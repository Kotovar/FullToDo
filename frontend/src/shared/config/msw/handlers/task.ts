import { http, HttpResponse } from 'msw';
import { ROUTES } from '@sharedCommon/';

const MOCK_TASK = {
  status: 200,
  message: 'Success',
  data: {
    _id: '1',
    notepadId: '1',
    title: 'Задача 1',
    description: 'Описание для задачи 1',
    dueDate: '2025-04-09T05:49:14.966Z',
    createdDate: '2025-04-09T05:49:14.966Z',
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

export const taskHandlers = [
  http.get(
    `${import.meta.env.VITE_URL}${() => ROUTES.getTaskDetailPath('/notepad/all', '1')}`,
    () => {
      return HttpResponse.json(MOCK_TASK);
    },
  ),
];
