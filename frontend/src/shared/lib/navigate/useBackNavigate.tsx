import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ROUTES } from 'shared/routes';

const FULL_PATH_FOR_TASK_LENGTH = 4;

export const useBackNavigate = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return useCallback(() => {
    const parts = pathname.split('/').filter(Boolean);

    if (parts[0] === 'tasks' && parts.length === 2) {
      navigate(ROUTES.TASKS);
    } else if (
      parts[0] === 'notepads' &&
      parts[2] === 'tasks' &&
      parts.length === FULL_PATH_FOR_TASK_LENGTH
    ) {
      navigate(`${ROUTES.getNotepadPath(parts[1])}`);
    } else {
      navigate(-1);
    }
  }, [navigate, pathname]);
};
