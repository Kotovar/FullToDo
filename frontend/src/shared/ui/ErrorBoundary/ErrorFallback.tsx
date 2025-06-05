import { useTranslation } from 'react-i18next';

export const ErrorFallback = () => {
  const { t } = useTranslation();

  return <h1>{t('errors.errorBoundary')}</h1>;
};
