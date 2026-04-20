import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { getRegisterRedirectEmail } from '@features/auth/register';
import { ROUTES } from '@sharedCommon';

export const Login = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const registeredEmail = getRegisterRedirectEmail(location.state);
  const registrationCompleted = registeredEmail !== null;

  return (
    <main className='bg-light text-dark flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center'>
      <h1 className='text-3xl font-semibold'>{t('login.title')}</h1>
      {registrationCompleted ? (
        <div className='max-w-md rounded border border-emerald-200 bg-emerald-50 px-4 py-3 text-left text-sm text-emerald-800'>
          <p className='font-medium'>{t('login.afterRegister.title')}</p>
          <p>
            {t('login.afterRegister.message', {
              email: registeredEmail ?? t('login.afterRegister.fallbackEmail'),
            })}
          </p>
        </div>
      ) : (
        <p className='max-w-md text-base'>{t('login.description')}</p>
      )}
      <Link
        className='bg-accent hover:bg-accent/80 rounded border p-2 text-white'
        to={ROUTES.app.register}
      >
        {t('login.register')}
      </Link>
    </main>
  );
};
