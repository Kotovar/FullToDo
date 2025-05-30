import { http, HttpResponse } from 'msw';
import { notepadId, ROUTES } from '@sharedCommon/';
import {
  getDeleteResponse,
  MOCK_NOTEPADS_RESPONSE,
  MOCK_NOTEPADS_UPDATE_RESPONSE,
  MOCK_TITLE_EXISTING,
} from '@shared/mocks';

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
    return HttpResponse.json(MOCK_NOTEPADS_RESPONSE);
  }),

  http.post<
    AddNotepadRequestParams,
    AddNotepadRequestBody,
    AddNotepadResponseBody
  >(`${import.meta.env.VITE_URL}${ROUTES.NOTEPADS}`, async ({ request }) => {
    const { title } = await request.json();

    if (title !== MOCK_TITLE_EXISTING) {
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

  http.patch<
    AddNotepadRequestParams,
    AddNotepadRequestBody,
    AddNotepadResponseBody
  >(
    `${import.meta.env.VITE_URL}${ROUTES.NOTEPADS}/${notepadId}`,
    async ({ request }) => {
      const { title } = await request.json();

      if (title !== MOCK_TITLE_EXISTING) {
        return HttpResponse.json(MOCK_NOTEPADS_UPDATE_RESPONSE);
      }

      return HttpResponse.json({
        status: 409,
        message: `The title ${title} is already in use`,
      });
    },
  ),

  http.delete<
    AddNotepadRequestParams,
    AddNotepadRequestBody,
    AddNotepadResponseBody
  >(`${import.meta.env.VITE_URL}${ROUTES.NOTEPADS}/${notepadId}`, async () => {
    return HttpResponse.json(getDeleteResponse('Notepad'));
  }),
];
