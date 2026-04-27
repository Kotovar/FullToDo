import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ROUTES } from 'shared/routes';

const FULL_PATH_FOR_TASK_LENGTH = 4;

/**
 * Возвращает обработчик "назад" с учётом известных detail-маршрутов.
 *
 * Для страниц задачи хук ведёт пользователя в ожидаемый список,
 * а для остальных случаев делегирует переход браузерной истории назад.
 */
export const useBackNavigate = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return useCallback(() => {
    const parts = pathname.split('/').filter(Boolean);
    const isTaskDetailRoute = parts[0] === 'tasks' && parts.length === 2;
    const isNotepadTaskDetailRoute =
      parts[0] === 'notepads' &&
      parts.length === FULL_PATH_FOR_TASK_LENGTH &&
      parts[2] === 'tasks';

    if (isTaskDetailRoute) {
      navigate(ROUTES.tasks.base);
    } else if (isNotepadTaskDetailRoute) {
      navigate(ROUTES.notepads.getPath(parts[1]));
    } else {
      navigate(-1);
    }
  }, [navigate, pathname]);
};
