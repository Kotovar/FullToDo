import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@sharedCommon/';

export const Home = () => {
  const { t } = useTranslation();

  return (
    <div className='mt-2 flex flex-col items-center justify-center gap-4'>
      <h1>{t('homePage.mainTitle')}</h1>
      <Link className='border-accent m-2 border-2 p-2' to={ROUTES.TASKS}>
        {t('homePage.open')}
      </Link>
    </div>
  );
};
