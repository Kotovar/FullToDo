import { Translation } from '@shared/i18n';
import { useTranslation } from 'react-i18next';

interface ErrorFetchingProps {
  message?: Translation;
}

export const ErrorFetching = ({
  message = 'errors.loadingFail',
}: ErrorFetchingProps) => {
  const { t } = useTranslation();

  return <div className='text-center'>{t(message)}</div>;
};
