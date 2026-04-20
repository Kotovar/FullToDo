import { Navigate } from 'react-router';
import { useAuth } from '@app/providers';
import { ROUTES } from '@sharedCommon';

/**
 * Делает корневой маршрут точкой входа:
 * гостя перенаправляет на логин, пользователя — в рабочую часть приложения.
 */
export const RootRedirect = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Navigate
      to={isAuthenticated ? ROUTES.tasks.base : ROUTES.app.login}
      replace
    />
  );
};
