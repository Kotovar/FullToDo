import { useCallback } from 'react';
import { toast } from 'react-toastify';

export const useNotifications = () => {
  const showError = useCallback((message: string) => {
    toast.error(message, {
      toastId: 'error',
    });
  }, []);

  const showSuccess = useCallback((message: string) => {
    toast.success(message, {
      toastId: 'success',
    });
  }, []);

  const showInfo = useCallback((message: string) => {
    toast.info(message, {
      toastId: 'info',
    });
  }, []);

  return { showError, showSuccess, showInfo };
};
