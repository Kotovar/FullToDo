import { COMMON_NOTEPAD_ID, USER_ID } from 'shared/schemas';
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
      _id: COMMON_NOTEPAD_ID,
      userId: USER_ID,
    },
    {
      title: 'Рабочее',
      _id: '1',
      userId: USER_ID,
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
      userId: USER_ID,
    },
  ],
};
