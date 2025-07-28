import { commonNotepadId } from 'shared/schemas';
import type { NotepadWithoutTasksResponse } from '@sharedCommon/*';

export const MOCK_TITLE_EXISTING = 'EXISTING';
export const MOCK_TITLE_NON_EXISTING = 'NON_EXISTING';
export const MOCK_TITLE_EXISTING_NOTEPAD = 'EXISTING_NOTEPAD';

export const MOCK_NOTEPADS_RESPONSE: NotepadWithoutTasksResponse = {
  status: 200,
  message: 'Success',
  data: [
    {
      title: 'Задачи',
      _id: commonNotepadId,
    },
    {
      title: 'Рабочее',
      _id: '1',
    },
  ],
};

export const MOCK_NOTEPADS_UPDATE_RESPONSE: NotepadWithoutTasksResponse = {
  status: 200,
  message: 'A notepad with the id 1 has been successfully updated',
  data: [
    {
      _id: '1',
      title: MOCK_TITLE_NON_EXISTING,
    },
  ],
};
