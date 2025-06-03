import { useTranslation } from 'react-i18next';
import { useBackNavigate } from '@shared/lib';
import { Button } from '@shared/ui';

export const Error = () => {
  const handleGoBack = useBackNavigate();
  const { t } = useTranslation();

  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <h1>{t('errors.notFound')}</h1>
      <Button appearance='primary' onClick={handleGoBack}>
        {t('back')}
      </Button>
    </div>
  );
};
