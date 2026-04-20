import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@sharedCommon';

export const Login = () => {
  const { t } = useTranslation();

  return (
    <main className='bg-light text-dark flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center'>
      <h1 className='text-3xl font-semibold'>{t('login.title')}</h1>
      <p className='max-w-md text-base'>
        Интерфейс аутентификации пока не реализован. Этот маршрут зарезервирован
        для гостевых пользователей.
      </p>
      <Link
        className='bg-accent hover:bg-accent/80 rounded border p-2 text-white'
        to={ROUTES.app.register}
      >
        {t('login.register')}
      </Link>
    </main>
  );
};
