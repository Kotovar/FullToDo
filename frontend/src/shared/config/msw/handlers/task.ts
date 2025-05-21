import { http, HttpResponse } from 'msw';
import { type CreateTask, notepadId, ROUTES, taskId } from '@sharedCommon/';
import {
  getDeleteResponse,
  MOCK_SINGE_NOTEPAD_RESPONSE,
  MOCK_SINGE_TASK_RESPONSE,
  MOCK_TASK_UPDATE_RESPONSE,
  MOCK_TITLE_EXISTING,
  MOCK_TITLE_EXISTING_NOTEPAD,
} from '@shared/mocks';
import { testState } from '@shared/config';

type AddTaskRequestParams = {
  taskId: string;
};

type AddTaskRequestBody = CreateTask;

type AddTaskResponseBody = {
  status: number;
  message: string;
};

export const taskHandlers = [
  http.get(
    `${import.meta.env.VITE_URL}${ROUTES.getTaskDetailPath(notepadId, taskId)}`,
    () => {
      if (testState.forceError) {
        return new HttpResponse(null, { status: 500 });
      }
      return HttpResponse.json(MOCK_SINGE_TASK_RESPONSE);
    },
  ),

  http.get(`${import.meta.env.VITE_URL}${ROUTES.TASKS}/${taskId}`, () => {
    if (testState.forceError) {
      return new HttpResponse(null, { status: 500 });
    }
    return HttpResponse.json(MOCK_SINGE_TASK_RESPONSE);
  }),

  http.get(
    `${import.meta.env.VITE_URL}${ROUTES.getNotepadPath(notepadId)}`,
    () => {
      if (testState.forceError) {
        return new HttpResponse(null, { status: 500 });
      }
      return HttpResponse.json(MOCK_SINGE_NOTEPAD_RESPONSE);
    },
  ),

  http.get(`${import.meta.env.VITE_URL}${ROUTES.TASKS}`, () => {
    if (testState.forceError) {
      return new HttpResponse(null, { status: 500 });
    }
    return HttpResponse.json(MOCK_SINGE_NOTEPAD_RESPONSE);
  }),

  http.post<AddTaskRequestParams, AddTaskRequestBody, AddTaskResponseBody>(
    `${import.meta.env.VITE_URL}${ROUTES.getNotepadPath(notepadId)}`,
    async ({ request }) => {
      if (testState.forceError) {
        return new HttpResponse(null, { status: 500 });
      }

      const { title } = await request.json();

      if (title !== MOCK_TITLE_EXISTING) {
        return HttpResponse.json({
          status: 201,
          message: `A task with the title ${title} has been successfully created`,
        });
      }

      return HttpResponse.json({
        status: 409,
        message: `A task with the title ${MOCK_TITLE_EXISTING} already exists in notepad ${MOCK_TITLE_EXISTING_NOTEPAD}`,
      });
    },
  ),

  http.patch<AddTaskRequestParams, AddTaskRequestBody, AddTaskResponseBody>(
    `${import.meta.env.VITE_URL}${ROUTES.TASKS}/${taskId}`,
    async ({ request }) => {
      if (testState.forceError) {
        return new HttpResponse(null, { status: 500 });
      }

      const { title } = await request.json();

      if (title !== MOCK_TITLE_EXISTING) {
        return HttpResponse.json(MOCK_TASK_UPDATE_RESPONSE);
      }

      return HttpResponse.json({
        status: 409,
        message: `A task with the title ${MOCK_TITLE_EXISTING} already exists in notepad ${MOCK_TITLE_EXISTING_NOTEPAD}`,
      });
    },
  ),

  http.delete<AddTaskRequestParams, AddTaskRequestBody, AddTaskResponseBody>(
    `${import.meta.env.VITE_URL}${ROUTES.TASKS}/${taskId}`,
    async () => {
      if (testState.forceError) {
        return new HttpResponse(null, { status: 500 });
      }

      return HttpResponse.json(getDeleteResponse('Task'));
    },
  ),

  http.all(`${import.meta.env.VITE_URL}/*`, () => {
    return HttpResponse.json(
      {
        status: 404,
        message: 'Страница не найдена',
        error: 'Not Found',
      },
      { status: 404 },
    );
  }),

  http.get(`${import.meta.env.VITE_URL}/notepads/unknown/tasks/404`, () => {
    return new HttpResponse(null, { status: 404 });
  }),
];
