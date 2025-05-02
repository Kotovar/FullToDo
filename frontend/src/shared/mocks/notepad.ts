export const MOCK_TITLE_EXISTING = 'EXISTING';
export const MOCK_TITLE_NON_EXISTING = 'NON_EXISTING';
export const MOCK_TITLE_EXISTING_NOTEPAD = 'EXISTING_NOTEPAD';

export const MOCK_NOTEPADS_RESPONSE = {
  status: 200,
  message: 'Success',
  data: [
    {
      title: 'Сегодня',
      _id: 'today',
    },
    {
      title: 'Задачи',
      _id: 'all',
    },
    {
      title: 'Рабочее',
      _id: '1',
    },
  ],
};

export const MOCK_NOTEPADS_UPDATE_RESPONSE = {
  status: 200,
  message: 'A notepad with the id 1 has been successfully updated',
  data: [
    {
      _id: '1',
      title: MOCK_TITLE_NON_EXISTING,
      tasks: [],
    },
  ],
};

export const MOCK_TODAY_TASKS_RESPONSE = {
  status: 200,
  message: 'Success',
  data: [
    {
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
  ],
};
