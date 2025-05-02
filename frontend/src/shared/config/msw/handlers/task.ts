import { http, HttpResponse } from 'msw';
import { CreateTask, ROUTES } from '@sharedCommon/';
import {
  getDeleteResponse,
  MOCK_SINGE_NOTEPAD_RESPONSE,
  MOCK_SINGE_TASK_RESPONSE,
  MOCK_TASK_UPDATE_RESPONSE,
  MOCK_TITLE_EXISTING,
  MOCK_TITLE_EXISTING_NOTEPAD,
  notepadId,
  taskId,
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
    `${import.meta.env.VITE_URL}${ROUTES.NOTEPADS}/${notepadId}${ROUTES.TASK}/${taskId}`,
    () => {
      if (testState.forceError) {
        return new HttpResponse(null, { status: 500 });
      }
      return HttpResponse.json(MOCK_SINGE_TASK_RESPONSE);
    },
  ),

  http.get(`${import.meta.env.VITE_URL}${ROUTES.NOTEPADS}/${notepadId}`, () => {
    if (testState.forceError) {
      return new HttpResponse(null, { status: 500 });
    }
    return HttpResponse.json(MOCK_SINGE_NOTEPAD_RESPONSE);
  }),

  http.post<AddTaskRequestParams, AddTaskRequestBody, AddTaskResponseBody>(
    `${import.meta.env.VITE_URL}${ROUTES.NOTEPADS}/${notepadId}${ROUTES.TASK}`,
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
    `${import.meta.env.VITE_URL}${ROUTES.NOTEPADS}/${notepadId}${ROUTES.TASK}/${taskId}`,
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
    `${import.meta.env.VITE_URL}${ROUTES.NOTEPADS}/${notepadId}${ROUTES.TASK}/${taskId}`,
    async () => {
      if (testState.forceError) {
        return new HttpResponse(null, { status: 500 });
      }

      return HttpResponse.json(getDeleteResponse('Task'));
    },
  ),
];
