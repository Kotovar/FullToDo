import { useTranslation } from 'react-i18next';
import { useBackNavigate, useDarkMode } from '@shared/lib';
import { Button } from '@shared/ui';

export const Error = () => {
  const handleGoBack = useBackNavigate();
  const { t } = useTranslation();
  useDarkMode();

  return (
    <div className='bg-light text-dark flex h-dvh flex-col items-center gap-4 pt-2'>
      <h1>{t('errors.notFound')}</h1>
      <Button appearance='primary' onClick={handleGoBack}>
        {t('back')}
      </Button>
    </div>
  );
};
