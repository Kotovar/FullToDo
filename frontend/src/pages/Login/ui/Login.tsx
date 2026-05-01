import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  getLoginPrefilledEmail,
  getLoginRedirectTarget,
  getRegisterRedirectEmail,
  LoginForm,
} from '@features/auth';
import { ROUTES } from '@sharedCommon';

export const Login = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const registeredEmail = getRegisterRedirectEmail(location.state);
  const prefilledEmail = getLoginPrefilledEmail(location.state);
  const registrationCompleted = registeredEmail !== null;
  const redirectTo = getLoginRedirectTarget(location.state);

  return (
    <>
      <LoginForm initialEmail={prefilledEmail} redirectTo={redirectTo} />
      <Link
        className='text-sm text-blue-700 underline-offset-4 transition hover:underline'
        to={ROUTES.app.forgotPassword}
      >
        {t('login.forgotPassword')}
      </Link>
      <Link
        className='w-full max-w-md rounded border border-slate-300 bg-white p-2 text-slate-700 transition hover:bg-slate-50'
        to={ROUTES.app.register}
      >
        {t('login.register')}
      </Link>
      <div className='min-h-24 w-full max-w-md'>
        {registrationCompleted && (
          <div className='rounded border border-emerald-200 bg-emerald-50 px-4 py-3 text-left text-sm text-emerald-800'>
            <p className='font-medium'>{t('login.afterRegister.title')}</p>
            <p>
              {t('login.afterRegister.message', {
                email:
                  registeredEmail ?? t('login.afterRegister.fallbackEmail'),
              })}
            </p>
          </div>
        )}
      </div>
    </>
  );
};
