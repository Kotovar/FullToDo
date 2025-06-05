import { useTranslation } from 'react-i18next';

interface ErrorFetchingProps {
  message?: string;
}

export const ErrorFetching = ({ message }: ErrorFetchingProps) => {
  const { t } = useTranslation();
  return (
    <div className='text-center'>{message ?? t('errors.loadingFail')}</div>
  );
};
