import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@sharedCommon/';
import { useDarkMode } from '@shared/lib';

export const Home = () => {
  const { t } = useTranslation();
  useDarkMode();

  return (
    <div className='bg-light text-dark flex h-dvh flex-col items-center gap-4 pt-2'>
      <h1>{t('homePage.mainTitle')}</h1>
      <Link
        className='bg-accent hover:bg-accent/80 dark:border-dark rounded border-1 p-2 text-white'
        to={ROUTES.TASKS}
      >
        {t('homePage.open')}
      </Link>
    </div>
  );
};
