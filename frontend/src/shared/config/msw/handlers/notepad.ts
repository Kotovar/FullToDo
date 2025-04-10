import { http, HttpResponse } from 'msw';
import { ROUTES } from '@sharedCommon/';
import { MOCK_NOTEPADS, MOCK_TODAY_TASKS } from '@shared/mocks';
import { notepadTestState } from '@shared/config';

type AddNotepadRequestParams = {
  notepadId: string;
};

type AddNotepadRequestBody = {
  title: string;
};

type AddNotepadResponseBody = {
  status: number;
  message: string;
};

export const notepadHandlers = [
  http.get(`${import.meta.env.VITE_URL}${ROUTES.NOTEPADS}`, () => {
    if (notepadTestState.forceError) {
      return new HttpResponse(null, { status: 500 });
    }

    return HttpResponse.json(MOCK_NOTEPADS);
  }),

  http.get(`${import.meta.env.VITE_URL}${ROUTES.TODAY_TASKS}`, () => {
    return HttpResponse.json(MOCK_TODAY_TASKS);
  }),

  http.post<
    AddNotepadRequestParams,
    AddNotepadRequestBody,
    AddNotepadResponseBody
  >(`${import.meta.env.VITE_URL}${ROUTES.NOTEPADS}`, async ({ request }) => {
    const { title } = await request.json();

    if (title !== 'TEST') {
      return HttpResponse.json({
        status: 201,
        message: `A notebook with the title ${title} has been successfully created`,
      });
    }

    return HttpResponse.json({
      status: 409,
      message: `A notebook with the title ${title} already exists`,
    });
  }),
];
