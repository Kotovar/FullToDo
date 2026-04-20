import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@sharedCommon';

export const Home = () => {
  const { t } = useTranslation();

  return (
    <div className='bg-light text-dark flex h-dvh flex-col items-center gap-4 pt-2'>
      <h1>{t('homePage.mainTitle')}</h1>
      <Link
        className='bg-accent hover:bg-accent/80 dark:border-dark rounded border p-2 text-white'
        to={ROUTES.tasks.base}
      >
        {t('homePage.open')}
      </Link>
    </div>
  );
};
