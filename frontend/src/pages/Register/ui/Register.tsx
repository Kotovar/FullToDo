import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { RegisterForm } from '@features/auth';
import { ROUTES } from '@sharedCommon';

export const Register = () => {
  const { t } = useTranslation();

  return (
    <>
      <RegisterForm />
      <Link
        className='w-full max-w-md rounded border border-slate-300 bg-white p-2 text-slate-700 transition hover:bg-slate-50'
        to={ROUTES.app.login}
      >
        {t('register.login')}
      </Link>
      <div aria-hidden='true' className='min-h-24 w-full max-w-md' />
    </>
  );
};
