import { Outlet, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { getLoginRedirectTarget, GoogleAuthSection } from '@features/auth';
import { ROUTES } from '@sharedCommon';

export const AuthLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const isLoginPage = location.pathname === ROUTES.app.login;
  const googleRedirectTo = isLoginPage
    ? getLoginRedirectTarget(location.state)
    : ROUTES.tasks.base;

  return (
    <main className='bg-light text-dark flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center'>
      <h1 className='text-3xl font-semibold'>
        {t(isLoginPage ? 'login.title' : 'register.title')}
      </h1>
      <div className='flex w-full max-w-md flex-col gap-4'>
        <GoogleAuthSection redirectTo={googleRedirectTo} />
        <Outlet />
      </div>
    </main>
  );
};
