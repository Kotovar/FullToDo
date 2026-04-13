import { ROUTES } from '@sharedCommon/routes';

export const ROUTE_REGEX = {
  NOTEPAD_TASKS: new RegExp(
    `^${ROUTES.notepads.tasks.replace(':notepadId', '([^/]+)')}$`,
  ),
  NOTEPAD_ID: new RegExp(
    `^${ROUTES.notepads.byId.replace(':notepadId', '([^/]+)')}$`,
  ),
  TASK_DETAIL: new RegExp(
    `^${ROUTES.notepads.taskDetail.replace(':notepadId', '([^/]+)').replace(':taskId', '([^/]+)')}$`,
  ),
  COMMON_TASK_DETAIL: new RegExp(
    `^${ROUTES.tasks.byId.replace(':taskId', '([^/]+)')}$`,
  ),
};
