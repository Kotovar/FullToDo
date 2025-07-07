import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import type { Translation } from '@shared/i18n';

export const useNotifications = () => {
  const { t } = useTranslation();

  const showError = useCallback(
    (message: Translation) => {
      toast.error(t(message), {
        toastId: 'error',
      });
    },
    [t],
  );

  const showSuccess = useCallback(
    (message: Translation) => {
      toast.success(t(message), {
        toastId: 'success',
      });
    },
    [t],
  );

  const showInfo = useCallback(
    (message: Translation) => {
      toast.info(t(message), {
        toastId: 'info',
      });
    },
    [t],
  );

  return { showError, showSuccess, showInfo };
};
