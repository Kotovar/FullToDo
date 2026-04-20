import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { RegisterForm } from '@features/auth/register';
import { ROUTES } from '@sharedCommon';

export const Register = () => {
  const { t } = useTranslation();

  return (
    <main className='bg-light text-dark flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center'>
      <h1 className='text-3xl font-semibold'>{t('register.title')}</h1>
      <RegisterForm />
      <Link
        className='w-full max-w-md rounded border border-slate-300 bg-white p-2 text-slate-700 transition hover:bg-slate-50'
        to={ROUTES.app.login}
      >
        {t('register.login')}
      </Link>
    </main>
  );
};
