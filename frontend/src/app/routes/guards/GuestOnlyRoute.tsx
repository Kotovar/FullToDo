import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '@app/providers';
import { ROUTES } from '@sharedCommon';

/**
 * Пропускает только гостей.
 * Авторизованных пользователей перенаправляет в рабочую часть приложения.
 */
export const GuestOnlyRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const fallbackRoute =
    typeof location.state?.from === 'string'
      ? location.state.from
      : ROUTES.tasks.base;

  if (isAuthenticated) {
    return <Navigate to={fallbackRoute} replace />;
  }

  return <Outlet />;
};
