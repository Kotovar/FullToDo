import { ROUTES } from '@shared/routes';

export const ROUTE_REGEX = {
  NOTEPAD_TASKS: new RegExp(
    `^${ROUTES.NOTEPAD_TASKS.replace(':notepadId', '([^/]+)')}$`,
  ),
  NOTEPAD_ID: new RegExp(
    `^${ROUTES.NOTEPAD_ID.replace(':notepadId', '([^/]+)')}$`,
  ),
  TASK_DETAIL: new RegExp(
    `^${ROUTES.TASK_DETAIL.replace(':notepadId', '([^/]+)').replace(':taskId', '([^/]+)')}$`,
  ),
  COMMON_TASK_DETAIL: new RegExp(
    `^${ROUTES.COMMON_TASK_DETAIL.replace(':taskId', '([^/]+)')}$`,
  ),
};
