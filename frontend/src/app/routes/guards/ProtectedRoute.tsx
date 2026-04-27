import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '@app/providers';
import { ROUTES } from '@sharedCommon';

/**
 * Пропускает только авторизованных пользователей.
 * Гостей перенаправляет на страницу логина с сохранением исходного маршрута.
 */
export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.app.login}
        replace
        state={{ from: location.pathname + location.search + location.hash }}
      />
    );
  }

  return <Outlet />;
};
